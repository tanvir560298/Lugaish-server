import { User } from '../src/models/User.js';
import { StudyRoom, StudyPreferences, StudyJoinRequest, StudyTableMessage } from './models.js';
import { exactEmail, messageText } from './socialValidation.js';
import { edit, existing, membershipLock, account, fail } from './service.js';
import { tableForSeat } from './tableLayout.js';
import { SEATS, seatMotion } from './seating.js';
import { GRACE_MS, RELEASE_MS } from './timing.js';
export const GENERIC='If this account accepts invitations, your request will be delivered.';
export async function preferences(user){const p=await StudyPreferences.findById(account(user)).lean();return {tableChatMuted:p?.tableChatMuted===true,doNotDisturb:p?.doNotDisturb===true,acceptInvitations:p?.acceptInvitations!==false,identifyRequester:p?.identifyRequester!==false,blocked:p?.blocked||[]};}
export async function allowed(sender,recipient,invitations=true){const [a,b]=await Promise.all([preferences({_id:sender}),preferences({_id:recipient})]);return !b.doNotDisturb&&(!invitations||b.acceptInvitations)&&!a.blocked.includes(recipient)&&!b.blocked.includes(sender);}
export async function updatePreferences(user,body){
  const p=await preferences(user),room=await existing(account(user));
  if(typeof body.tableChatMuted==='boolean')p.tableChatMuted=body.tableChatMuted;
  if(typeof body.doNotDisturb==='boolean')p.doNotDisturb=body.doNotDisturb;
  if(typeof body.acceptInvitations==='boolean')p.acceptInvitations=body.acceptInvitations;
  if(typeof body.identifyRequester==='boolean')p.identifyRequester=body.identifyRequester;
  if(body.blockRequest){if(!/^[a-f\d]{24}$/i.test(body.blockRequest))fail('Request unavailable.',400);const q=await StudyJoinRequest.findOne({_id:body.blockRequest,recipientId:account(user)}).lean();if(!q)fail('Request unavailable.',403);body.block=q.requesterId;}
  if(body.block){if(body.block===account(user))fail('Choose another participant.',400);const requester=await StudyJoinRequest.exists({requesterId:body.block,recipientId:account(user)});if(!requester&&!room?.members.some(m=>m.id===body.block))fail('Choose a participant or invitation.',403);p.blocked=[...new Set([...p.blocked,String(body.block)])].slice(0,100);}
  if(body.unblock)p.blocked=p.blocked.filter(v=>v!==body.unblock);
  await StudyPreferences.updateOne({_id:account(user)},{$set:p},{upsert:true});return p;
}
export async function requestJoin(user,body){
  const email=exactEmail(body.email),me=account(user),room=await existing(me),member=room?.members.find(m=>m.id===me);
  if(!member||Date.now()-member.lastSeen>GRACE_MS)fail('Enter a shared room before requesting to join.',409);
  const rate=await StudyPreferences.findOneAndUpdate({_id:me,$or:[{lastRequest:{$lt:Date.now()-10000}},{lastRequest:{$exists:false}}]},{$set:{lastRequest:Date.now()}},{upsert:false});
  if(!rate){const prior=await StudyPreferences.findById(me);if(prior)fail('Please wait before another request.',429);await StudyPreferences.create({_id:me,lastRequest:Date.now()});}
  const friend=await User.findOne({email}).select('_id').lean();
  if(friend&&String(friend._id)!==me&&await allowed(me,String(friend._id))){
    const target=await existing(String(friend._id)),host=target?.members.find(m=>m.id===String(friend._id));
    if(host?.seat&&Date.now()-host.lastSeen<GRACE_MS&&!await StudyJoinRequest.exists({requesterId:me,recipientId:String(friend._id),status:'pending',expiresAt:{$gt:new Date()}}))
      await StudyJoinRequest.create({requesterId:me,recipientId:String(friend._id),requesterName:user.name,requesterAvatar:member.characterId,status:'pending',expiresAt:new Date(Date.now()+900000)});
  }
  return {message:GENERIC};
}
export async function joinUpdates(user){const q=await StudyJoinRequest.find({requesterId:account(user),status:{$in:['accepted','declined','expired']},expiresAt:{$gt:new Date()}}).sort({createdAt:-1}).limit(5).lean();return q.map(r=>({id:String(r._id),status:r.status}));}
export async function joinInbox(user){const p=await preferences(user);if(!p.acceptInvitations||p.doNotDisturb)return [];const q=await StudyJoinRequest.find({recipientId:account(user),status:'pending',expiresAt:{$gt:new Date()},requesterId:{$nin:p.blocked}}).sort({createdAt:1}).lean();return q.map(r=>({id:String(r._id),name:p.identifyRequester?r.requesterName:'A student',avatar:p.identifyRequester?r.requesterAvatar:null,requesterId:p.identifyRequester?r.requesterId:null,expiresAt:r.expiresAt}));}
export async function answerRequest(user,body){
  if(!/^[a-f\d]{24}$/i.test(body.id||''))fail('Request unavailable.',404);
  if(typeof body.accept!=='boolean')fail('Choose Accept or Decline.',400);
  const request=await StudyJoinRequest.findOneAndUpdate({_id:body.id,recipientId:account(user),status:'pending',expiresAt:{$gt:new Date()}},{$set:{status:'processing'}},{new:true}).lean();
  if(!request)fail('Request expired or already answered.');
  if(!body.accept){await StudyJoinRequest.updateOne({_id:request._id},{$set:{status:'declined'}});return {ok:true};}
  try{return await membershipLock(request.requesterId,async()=>{
    if(!await allowed(request.requesterId,account(user)))fail('Request is no longer eligible.',403);
    const [source,target]=await Promise.all([existing(request.requesterId),existing(account(user))]);
    const mover=source?.members.find(m=>m.id===request.requesterId),host=target?.members.find(m=>m.id===account(user));
    if(!mover||!host||Date.now()-mover.lastSeen>GRACE_MS||Date.now()-host.lastSeen>GRACE_MS||!host.seat||host.arrivesAt>Date.now())fail('Both students must be online and your table ready.');
    const same=String(source._id)===String(target._id);
    const {room}=await edit(target._id,(r,now)=>{
      const h=r.members.find(m=>m.id===account(user));if(!h?.seat||h.arrivesAt>now||now-h.lastSeen>GRACE_MS)fail('Your table is no longer available.');
      const table=tableForSeat(h.seat),free=SEATS.find(s=>s.tableId===table&&!r.members.some(m=>m.seat===s.id&&m.id!==mover.id));if(!free)fail('Your table is full.');
      if(!same&&r.members.length>=100)fail('The room is full.');
      const m=same?r.members.find(m=>m.id===mover.id):{...mover,seat:null};if(!m||m.arrivesAt>now)fail('Your friend is still moving.');
      const motion=seatMotion(same?m.seat:null,free.id,now+1800,false);
      motion.startedAt=now;motion.stages=motion.stages.map(s=>({...s,start:s.start+1800}));motion.stages.unshift({type:'greet',start:0,duration:1800,from:motion.points[0],to:motion.points[0],seated:same&&Boolean(m.seat),facing:same?(SEATS.find(s=>s.id===m.seat)?.facing??Math.PI):Math.PI});
      m.motion=motion;m.seat=free.id;m.arrivesAt=motion.endsAt;m.greeting={until:now+1800,target:h.id,text:'Hello!'};m.lastSeen=now;if(!same)r.members.push(m);
    });
    if(!same){try{await edit(source._id,r=>{r.members=r.members.filter(m=>m.id!==mover.id);});}catch(e){await edit(target._id,r=>{r.members=r.members.filter(m=>m.id!==mover.id);});throw e;}}
    await StudyJoinRequest.updateOne({_id:request._id},{$set:{status:'accepted'}});return {ok:true,roomId:String(room._id)};
  });}catch(e){await StudyJoinRequest.updateOne({_id:request._id},{$set:{status:'expired'}});throw e;}
}
export async function tableContext(user){const room=await existing(account(user)),me=room?.members.find(m=>m.id===account(user));if(!room||room.kind==='public')fail('Chat is available only in private study groups.',403);if(!me?.seat||Date.now()-me.lastSeen>=RELEASE_MS)fail('Sit at an active table to use chat.',403);return {room,me,tableId:tableForSeat(me.seat),sessionId:room.tableSessions?.[tableForSeat(me.seat)]||'legacy'};}
const view=(m,viewer)=>({id:String(m._id),senderId:m.senderId,senderName:m.senderName,senderAvatar:m.senderAvatar,body:m.body,read:m.readBy?.includes(viewer)||false,createdAt:m.createdAt,table:true});
async function liveMessageFilter(user,context) {
 const {room,tableId,sessionId}=context,now=Date.now(),own=await preferences(user);
 const members=room.members.filter(m=>tableForSeat(m.seat)===tableId&&now-m.lastSeen<RELEASE_MS&&!own.blocked.includes(m.id));
 const permitted=await Promise.all(members.map(async m=>({m,p:await preferences({_id:m.id})})));
 const generations=permitted.filter(({p})=>!p.blocked.includes(account(user))).map(({m})=>({senderId:m.id,membershipId:m.tableGeneration||{$in:['legacy',null]}}));
 return {roomId:String(room._id),tableId,sessionId,expiresAt:{$gt:new Date()},$or:generations.length?generations:[{senderId:'no-authorized-sender'}]};
}
export async function tableHistory(user){const context=await tableContext(user);const messages=await StudyTableMessage.find(await liveMessageFilter(user,context)).sort({createdAt:1,_id:1}).lean();return messages.map(m=>view(m,account(user)));}
export async function sendTableMessage(user,body){
 const context=await tableContext(user),{room,me,tableId,sessionId}=context;
 if(Date.now()-me.lastSeen>=GRACE_MS)fail('Reconnect to your table before sending.',409);
 if(me.arrivesAt>Date.now())fail('Wait until you reach your chair.');
 const text=messageText(body.body),membershipId=me.tableGeneration||'legacy';
 const m=await StudyTableMessage.create({roomId:String(room._id),tableId,sessionId,membershipId,senderId:me.id,senderName:me.name,senderAvatar:me.characterId,readBy:[me.id],body:text,expiresAt:new Date(Date.now()+86400000)});
 // A leave may win between validation and insertion. Revalidate generation;
 // readers also filter membership so that late writes can never leak history.
 const fresh=await existing(me.id),current=fresh?.members.find(p=>p.id===me.id);
 if(String(fresh?._id)!==String(room._id)||tableForSeat(current?.seat)!==tableId||(current?.tableGeneration||'legacy')!==membershipId){await StudyTableMessage.deleteOne({_id:m._id});fail('You have left this table.',403);}
 return {message:view(m,account(user))};
}
export async function tableNotifications(user){const pref=await preferences(user);if(pref.doNotDisturb||pref.tableChatMuted)return [];try{const context=await tableContext(user);const messages=await StudyTableMessage.find({...await liveMessageFilter(user,context),readBy:{$ne:account(user)}}).sort({createdAt:1}).limit(20).lean();return messages.map(m=>view(m,account(user)));}catch(e){if(e.status===403)return [];throw e;}}
export async function readTable(user,body){const {room,tableId,sessionId}=await tableContext(user);const ids=(body.ids||[]).filter(v=>/^[a-f\d]{24}$/i.test(v)).slice(0,20);await StudyTableMessage.updateMany({_id:{$in:ids},roomId:String(room._id),tableId,sessionId,},{$addToSet:{readBy:account(user)}});return {ok:true};}
