import { randomBytes, randomInt, createHash } from 'node:crypto';
import { StudyRoom, StudyLock, StudyTableMessage } from './models.js';
import { settle, publicRoom, RELEASE_MS, GRACE_MS } from './timing.js';
import { unreadMessages } from './social.js';
import { joinInbox, joinUpdates, preferences, tableHistory, tableNotifications, allowed } from './collaboration.js';
import { User } from '../src/models/User.js';
import { STUDY_TABLES, tableForSeat } from './tableLayout.js';
import { SEATS, seatMotion, leaveSeatMotion, HALL_CAPACITY } from './seating.js';
export const fail = (message, status = 409) => { throw Object.assign(new Error(message), { status }); };
const renewedMessages=new Map(),cleanedMessages=new Map();
export async function reconcileTableMessages(room, force=false) {
  const id=String(room._id),now=Date.now();
  if(!force&&now-(cleanedMessages.get(id)||0)<5000)return;
  cleanedMessages.set(id,now);
  // Read message IDs before fresh membership. Never delete by a stale room
  // snapshot's negative filter: that could erase a newer rejoin generation.
  const candidates=await StudyTableMessage.find({roomId:id}).select('_id senderId tableId membershipId sessionId').lean();
  const fresh=await StudyRoom.findById(id).lean();
  const active=(fresh?.members||[]).filter(m=>m.seat&&now-m.lastSeen<RELEASE_MS&&fresh.expiresAt>new Date(now));
  const orphanIds=candidates.filter(msg=>!active.some(m=>m.id===msg.senderId&&tableForSeat(m.seat)===msg.tableId&&(m.tableGeneration||'legacy')===(msg.membershipId||'legacy')&&(fresh.tableSessions?.[msg.tableId]||'legacy')===msg.sessionId)).map(m=>m._id);
  if(orphanIds.length)await StudyTableMessage.deleteMany({_id:{$in:orphanIds}});
  if(active.length&&now-(renewedMessages.get(id)||0)>60000){renewedMessages.set(id,now);await StudyTableMessage.updateMany({roomId:id},{$set:{expiresAt:new Date(now+86400000)}});}
  for(const cache of [renewedMessages,cleanedMessages])for(const [key,at]of cache)if(now-at>86400000)cache.delete(key);
}
export async function sweepTableMessages() {
  const ids=await StudyTableMessage.distinct('roomId');
  for(const id of ids)await reconcileTableMessages({_id:id},true);
}
// Presence expiry also cleans abandoned tables when no client remains online.
const tableCleanup=setInterval(()=>{sweepTableMessages().catch(()=>{});},30000);
tableCleanup.unref();
const hash = value => createHash('sha256').update(value).digest('hex');
const text = (value, max = 100) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export const account = user => String(user._id);
export async function edit(id, fn) {
  if (!/^[a-f\d]{24}$/i.test(String(id))) fail('Room unavailable.', 404);
  for (let retry = 0; retry < 12; retry++) {
    const room = await StudyRoom.findById(id).lean();
    if (!room || room.expiresAt < new Date()) fail('Room unavailable.', 404);
    const revision = room.revision, now = Date.now();
    const previousMembers = room.members.map(m=>({...m}));
    settle(room, now);
    room.members = room.members.filter(m => now - m.lastSeen < RELEASE_MS);
    if (room.kind === 'public') room.hostId = '';
    else if (!room.members.some(m => m.id === room.hostId)) room.hostId = room.members[0]?.id || '';
    const occupiedBefore=new Set(room.members.map(m=>tableForSeat(m.seat)).filter(Boolean));
    const result = fn(room, now);
    const previousById = new Map(previousMembers.map(m=>[m.id,m]));
    for(const m of room.members){const old=previousById.get(m.id);if(!m.seat)m.tableGeneration=null;else if(!m.tableGeneration||tableForSeat(old?.seat)!==tableForSeat(m.seat))m.tableGeneration=randomBytes(16).toString('hex');}
    room.tableSessions ||= {};
    for(const t of new Set(room.members.map(m=>tableForSeat(m.seat)).filter(Boolean)))if(!occupiedBefore.has(t)||!room.tableSessions[t])room.tableSessions[t]=randomBytes(12).toString("hex");
    room.revision++;
    room.expiresAt = new Date(now + (room.members.length ? 86400000 : 300000));
    const saved = await StudyRoom.updateOne({ _id: room._id, revision }, { $set: {
      tableSessions:room.tableSessions, members: room.members, invitations: room.invitations, hostId: room.hostId,
      togetherMs: room.togetherMs, tableTogetherMs:room.tableTogetherMs, updatedAtMs: now, revision: room.revision, expiresAt: room.expiresAt,
    } });
    if (saved.modifiedCount) {
      // Upgrade currently seated legacy senders once, before revoking their
      // legacy generation. Subsequent rejoins always have a distinct token.
      for(const m of room.members){const old=previousById.get(m.id);if(old?.seat&&!old.tableGeneration&&tableForSeat(old.seat)===tableForSeat(m.seat))await StudyTableMessage.updateMany({roomId:String(room._id),senderId:m.id,tableId:tableForSeat(m.seat),sessionId:room.tableSessions[tableForSeat(m.seat)]||'legacy',membershipId:{$exists:false}},{$set:{membershipId:m.tableGeneration}});}
      // Delete only the departed generation, never a subsequent rejoin.
      const departed=previousMembers.filter(old=>old.seat&&!room.members.some(m=>m.id===old.id&&m.tableGeneration===old.tableGeneration&&tableForSeat(m.seat)===tableForSeat(old.seat)));
      if(departed.length)await StudyTableMessage.deleteMany({roomId:String(room._id),$or:departed.map(m=>({senderId:m.id,tableId:tableForSeat(m.seat),membershipId:m.tableGeneration||{$in:['legacy',null]}}))}).catch(()=>{});
      return { room, result };
    }
  }
  fail('The room is busy. Please try again.');
}
export async function membershipLock(id, action) {
  const owner = randomBytes(12).toString('hex');
  try {
    await StudyLock.findOneAndUpdate({ _id: id, until: { $lt: Date.now() } }, { $set: { until: Date.now() + 15000, owner } }, { upsert: true });
  } catch { fail('Another room action is finishing. Please try again.'); }
  try { return await action(); } finally { await StudyLock.deleteOne({ _id: id, owner }); }
}
function member(user, client, now) {
  if (!/^[\w-]{8,80}$/.test(client || '')) fail('Please reopen the Study Room.', 400);
  return { id: account(user), name: text(user.name, 50) || 'Student', controller: client,
    seat: null, arrivesAt: now, phase: 'paused', focusMs: 0, focusUntil: now,
    sessionId: '', lastSeen: now, muted: false, lastCall: 0 };
}
export async function existing(id) {
  return StudyRoom.findOne({ 'members': { $elemMatch: { id, lastSeen: { $gt: Date.now() - RELEASE_MS } } }, expiresAt: { $gt: new Date() } }).lean();
}
export async function create(user, client) {
  return membershipLock(account(user), async () => {
    const current = await existing(account(user));
    if (current) return current;
    const now = Date.now();
    return (await StudyRoom.create({ name: 'Lugaish study hall', hostId: account(user), members: [member(user, client, now)],
      invitations: [], revision: 0, togetherMs: 0, updatedAtMs: now, expiresAt: new Date(now + 86400000) })).toObject();
  });
}
// One public hall, isolated from all invitation-only rooms. Mongo's unique key
// prevents concurrent API processes from creating separate occupancy universes.
async function publicHall() {
  await StudyRoom.init();
  const now = Date.now();
  let room;
  try {
    room = await StudyRoom.findOneAndUpdate({ publicKey: 'main-library', kind: 'public' }, { $setOnInsert: {
      name: 'Public Study Library', hostId: '', members: [], invitations: [],
      revision: 0, togetherMs: 0, updatedAtMs: now, expiresAt: new Date(now + 86400000),
    } }, { upsert: true, new: true }).lean();
  } catch (e) {
    if (e.code !== 11000) throw e;
    room = await StudyRoom.findOne({ publicKey: 'main-library', kind: 'public' }).lean();
  }
  if (!room) fail('Public library unavailable. Try a personal desk.', 503);
  // Revive an expired hall before TTL cleanup, without replacing its members.
  if (room.expiresAt <= new Date(now)) {
    await StudyRoom.updateOne({ _id: room._id, kind: 'public', expiresAt: { $lte: new Date(now) } },
      { $set: { expiresAt: new Date(now + 86400000) } });
  }
  return room;
}
export async function publicTables() {
  const room = await publicHall(), now = Date.now();
  const members = room.members.filter(m => now - m.lastSeen < RELEASE_MS);
  return { tables: STUDY_TABLES.map(t => {
    const seated = members.filter(m => tableForSeat(m.seat) === t.id);
    return { id: t.id, number: t.number, capacity: 5,
      available: 5 - new Set(seated.map(m => m.seat)).size,
      present: seated.filter(m => now - m.lastSeen < GRACE_MS).length };
  }), serverNow: now };
}
export async function joinPublic(user, body) {
  return membershipLock(account(user), async () => {
    const current = await existing(account(user));
    if (current) {
      if (current.kind !== 'public') fail('Leave your private room explicitly before joining the public library.');
      const me = current.members.find(m => m.id === account(user));
      if (me.seat) return current; // Keep seat and tab ownership.
      if (me.controller !== body.client) fail('Use the controlling tab before taking a new seat.');
    }
    const hall = await publicHall();
    return (await edit(hall._id, (room, now) => {
      if (room.kind !== 'public') fail('Not a public library.', 403);
      if (room.members.length >= HALL_CAPACITY && !room.members.some(m => m.id === account(user))) fail('The public library is full. Try a personal desk or a private room.');
      const free = SEATS.filter(s => !room.members.some(m => m.seat === s.id));
      if (!free.length) fail('All public seats are taken. Try a personal desk or a private room.');
      const seat = free[randomInt(free.length)];
      const me = room.members.find(m => m.id === account(user)) || member(user, body.client, now);
      if (me.arrivesAt > now) fail('Wait until you finish leaving your chair.');
      me.muted = true; me.lastSeen = now;
      if (['maya','noor','zain'].includes(body.characterId)) me.characterId = body.characterId;
      me.motion = seatMotion(null, seat.id, now, body.direct === true);
      me.seat = seat.id; me.arrivesAt = me.motion.endsAt;
      if (!room.members.includes(me)) room.members.push(me);
    })).room;
  });
}
export async function inbox(user) {
  const now = Date.now(), email = user.email.toLowerCase();
  // Filter the mixed invitation payload in JS: Mongoose can otherwise cast its
  // numeric expiresAt using the room's Date field of the same name.
  const rooms = await StudyRoom.find({ 'invitations.email': email, expiresAt: { $gt: new Date() } }).lean();
  return rooms.flatMap(r => r.invitations.filter(i => i.email === email && i.status === 'pending' && i.expiresAt > now).map(i => ({
    id: i.id, roomId: String(r._id), roomName: r.name, inviter: i.inviter, expiresAt: i.expiresAt,
    tableId:i.tableId || null,
    tableNumber:STUDY_TABLES.find(t=>t.id===i.tableId)?.number || null,
    available: i.tableId ? 5-r.members.filter(m=>tableForSeat(m.seat)===i.tableId&&now-m.lastSeen<RELEASE_MS).length : HALL_CAPACITY-r.members.filter(m=>now-m.lastSeen<RELEASE_MS).length,
  })));
}
export async function snapshot(user) {
  const room = await existing(account(user));
  if (room) {
    settle(room, Date.now());
    room.members = room.members.filter(m => Date.now() - m.lastSeen < RELEASE_MS);
    await reconcileTableMessages(room);
    if (room.kind === 'public') room.hostId = '';
    else if (!room.members.some(m => m.id === room.hostId)) room.hostId = room.members[0]?.id || '';
  }
  return { me: account(user), room: room ? publicRoom(room, account(user), Date.now()) : null, invitations: await inbox(user), joinUpdates:await joinUpdates(user), joinRequests:await joinInbox(user), preferences:await preferences(user), tableMessages:room&&tableForSeat(room.members.find(m=>m.id===account(user))?.seat)?await tableHistory(user).catch(e=>{if(e.status===403)return [];throw e;}):[], notifications:[...await unreadMessages(user),...await tableNotifications(user)], serverNow: Date.now() };
}
export async function accept(user, body) {
  return membershipLock(account(user), async () => {
    const current = await existing(account(user));
    if (current) fail('Leave your current room before joining another. Your notebook and timer will stay with you.');
    let id = body.roomId;
    if (body.token) id = (await StudyRoom.findOne({ 'invitations.digest': hash(text(body.token, 100)) }).select('_id').lean())?._id;
    const destination=await StudyRoom.findById(id).lean();
    const permission=destination?.invitations.find(i=>(body.token?i.digest===hash(text(body.token,100)):i.id===body.invitationId)&&i.email===user.email.toLowerCase());
    if(permission&&!await allowed(permission.creator,account(user)))fail('Invitation unavailable.',403);
    return edit(id, (room, now) => {
      const invite = room.invitations.find(i => (body.token ? i.digest === hash(text(body.token, 100)) : i.id === body.invitationId)
        && i.email === user.email.toLowerCase() && i.status === 'pending' && i.expiresAt > now);
      const inviter=room.members.find(m=>m.id===invite?.creator);
      if(invite&&(!inviter||now-inviter.lastSeen>GRACE_MS||tableForSeat(inviter.seat)!==invite.tableId))fail('Your friend’s table is no longer available.');
      if (!invite) fail('This invitation is unavailable or expired. Sign in with the invited account.', 403);
      if (room.members.length >= HALL_CAPACITY) fail('This room is full. Ask your friend to invite you when a seat is free.');
      if (!room.members.length) fail('This room has closed. Ask for a new invitation.');
      const joined=member(user,body.client,now);
      if(invite.tableId){
        const free=SEATS.find(s=>s.tableId===invite.tableId&&!room.members.some(m=>m.seat===s.id));
        if(!free)fail('That five-person table is full. Ask your friend to choose another table.');
        joined.motion=seatMotion(null,free.id,now,body.direct===true);joined.seat=free.id;joined.arrivesAt=joined.motion.endsAt;
      }
      room.members.push(joined); invite.status='accepted';
    });
  });
}
export async function decline(user, body) {
  return edit(body.roomId, room => {
    const invite = room.invitations.find(i => i.id === body.invitationId && i.email === user.email.toLowerCase());
    if (!invite) fail('Invitation unavailable.', 404);
    invite.status = 'declined';
  });
}
export async function act(user, id, body) {
  const token = randomBytes(24).toString('hex');
  let inviteEligible=true;
  if(body.action==='invite'){const recipient=await User.findOne({email:text(body.email,254).toLowerCase()}).select('_id').lean();inviteEligible=Boolean(recipient&&String(recipient._id)!==account(user)&&await allowed(account(user),String(recipient._id)));}
  const { room, result } = await edit(id, (room, now) => {
    const me = room.members.find(m => m.id === account(user));
    if (!me) fail('You are no longer in this room.', 403);
    if (room.kind === 'public' && ['invite','revoke','remove','call','answer'].includes(body.action)) fail('This action is only available in private rooms.', 403);
    if (!/^[\w-]{8,80}$/.test(body.client || '')) fail('Please reopen the Study Room.', 400);
    if (room.kind === 'public' && body.action === 'wave' && body.target) fail('Public greetings cannot target another student.', 403);
    if (body.action === 'takeover') { me.controller = body.client; me.lastSeen = now; return; }
    if (me.controller !== body.client) fail('This room is controlled in another tab. Choose “Use this tab” to continue.');
    me.lastSeen = now;
    if (body.action === 'heartbeat') { if(['maya','noor','zain'].includes(body.characterId))me.characterId=body.characterId; return; }
    if(body.action==='stand'){if(me.arrivesAt>now)fail('Wait until you reach your chair.');me.motion=leaveSeatMotion(me.seat,now,body.direct===true);me.seat=null;me.arrivesAt=me.motion?.endsAt||now;return;}
    if (body.action === 'seat') {
      if (me.arrivesAt > now) fail('Please wait until you reach your seat.');
      if (!SEATS.some(s => s.id === body.seat)) fail('Choose a valid seat.', 400);
      if (room.members.some(m => m.id !== me.id && m.seat === body.seat)) fail('Someone just took that seat. Choose another.');
      me.motion = seatMotion(me.seat, body.seat, now, body.direct === true);
      me.seat = body.seat; me.arrivesAt = me.motion.endsAt; return;
    }
    if (body.action === 'timer') {
      if (!['studying', 'paused', 'break'].includes(body.phase) || !/^[\w-]{1,100}$/.test(body.sessionId || '')) fail('Invalid study session.', 400);
      if (!Number.isFinite(body.remainingMs) || body.remainingMs < 0 || body.remainingMs > 2700000) fail('Invalid session duration.', 400);
      // No client-provided elapsed total is accepted. A pre-existing solo timer
      // keeps its countdown; room-visible focus accrues only from arrival.
      if (me.sessionId !== body.sessionId) { if (body.phase !== 'break') me.focusMs = 0; me.sessionId = body.sessionId; me.phase = 'new'; }
      if (me.phase === body.phase) return;
      me.phase = body.phase; me.focusUntil = now + Math.min(body.remainingMs, body.phase === 'break' ? 300000 : 2700000); return;
    }
    if (body.action === 'mute') { me.muted = body.muted === true; if (me.muted) me.call = null; return; }
    if (body.action === 'call' || body.action === 'wave') {
      if (now - me.lastCall < 10000) fail('Give your friend a moment before greeting again.');
      me.lastCall = now;
      const friend = room.members.find(m => m.id === body.target && m.id !== me.id);
      if (body.action === 'call' && !friend) fail('Your friend is no longer here.');
      me.greeting = { until: now + 4000, target: friend?.id || '', text: body.action === 'call' ? 'Come study with me!' : 'Hello!' };
      if (friend && !friend.muted) friend.call = { from: me.id, name: me.name, expiresAt: now + 30000 }; return;
    }
    if (body.action === 'answer') {
      const call = me.call; me.call = null;
      if (!body.accept) return;
      if (!call || call.expiresAt <= now || !room.members.some(m => m.id === call.from)) fail('This greeting has expired.');
      if (me.arrivesAt > now) fail('Please wait until you reach your seat.');
      const caller = room.members.find(m => m.id === call.from);
      const callerSeat=SEATS.find(s=>s.id===caller.seat);
      if(!callerSeat)fail('Your friend needs to choose a table first.');
      const origin=callerSeat.position;
      const free = SEATS.filter(s => s.tableId===callerSeat.tableId && !room.members.some(m => m.seat === s.id && m.id !== me.id))
        .sort((a, b) => Math.hypot(a.position[0] - origin[0], a.position[2] - origin[2]) - Math.hypot(b.position[0] - origin[0], b.position[2] - origin[2]))[0];
      if (!free) fail('Your friend’s five-person table is full.');
      me.motion = seatMotion(me.seat, free.id, now, body.direct === true); me.seat = free.id; me.arrivesAt = me.motion.endsAt; return;
    }
    if (body.action === 'invite') {
      if (room.members.length >= HALL_CAPACITY) fail('Your room is full.');
      const selectedTable=tableForSeat(me.seat);
      if(!STUDY_TABLES.some(t=>t.id===selectedTable))fail('Choose your five-person table before inviting a friend.',400);
      if(room.members.filter(m=>tableForSeat(m.seat)===selectedTable).length>=5)fail('This table is full. Choose another table.');
      const email = text(body.email, 254).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Enter a valid email address.', 400);
      if (now - (me.lastInvite || 0) < 10000) fail('Please wait a moment before inviting again.');
      me.lastInvite = now;
      room.invitations = room.invitations.filter(i => i.status === 'pending' && i.expiresAt > now && i.email !== email);
      if (room.invitations.length >= 20) fail('Please wait for your pending invitations to expire.');
      if(!inviteEligible)return {message:'If this account accepts invitations, your request will be delivered.'};
      room.invitations.push({ id: randomBytes(12).toString('hex'), digest: hash(token), email, inviter: me.name,
        creator: me.id, tableId:selectedTable, expiresAt: now + 900000, status: 'pending' });
      return {message:'If this account accepts invitations, your request will be delivered.'};
    }
    if (body.action === 'revoke') {
      room.invitations.forEach(i => { if (i.creator === me.id || room.hostId === me.id) i.status = 'revoked'; }); return;
    }
    if (body.action === 'remove' || body.action === 'leave') {
      const target = body.action === 'leave' ? me.id : body.target;
      if (body.action === 'remove' && (room.hostId !== me.id || target === me.id)) fail('Only the host can remove another participant.', 403);
      room.members = room.members.filter(m => m.id !== target);
      room.invitations.forEach(i => { if (i.creator === target) i.status = 'revoked'; });
      if (room.hostId === target) room.hostId = room.members[0]?.id || '';
      return;
    }
    fail('Unknown room action.', 400);
  });
  return { room: publicRoom(room, account(user), Date.now()), ...result };
}
