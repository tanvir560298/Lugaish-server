import express from 'express';
import { authMiddleware } from '../src/middleware/auth.js';
import { User } from '../src/models/User.js';
import { createRateLimit } from '../src/middleware/rateLimit.js';
import * as service from './service.js';
import * as social from './social.js';
import * as collaboration from './collaboration.js';
const router = express.Router();
router.use(authMiddleware);
router.use(async (req, res, next) => {
  try {
    req.studyUser = await User.findById(req.userId).select('name email').lean();
    if (!req.studyUser) return res.status(401).json({ error: 'Please sign in again.' });
    next();
  } catch (e) { next(e); }
});
const run = fn => async (req, res, next) => { try { res.json(await fn(req)); } catch (e) { next(e); } };
router.get('/preferences',run(req=>collaboration.preferences(req.studyUser)));
router.get('/table/messages',run(req=>collaboration.tableHistory(req.studyUser)));
router.get('/public/tables', createRateLimit({windowMs:60000,max:60,key:req=>req.userId}), run(() => service.publicTables()));
router.get('/home', run(req => service.snapshot(req.studyUser)));
router.get('/notifications', run(req => social.unreadMessages(req.studyUser)));
router.get('/messages/:friendId', run(req => social.conversation(req.studyUser,req.params.friendId)));
router.get('/invitations', run(req => service.inbox(req.studyUser)));
// Authenticated fetch streams: bearer tokens never appear in URLs or logs.
const streams = new Map();
router.get('/events', (req, res) => {
  const key = String(req.userId);
  if ((streams.get(key) || 0) >= 6) return res.status(429).json({ error: 'Too many open study tabs.' });
  streams.set(key, (streams.get(key) || 0) + 1);
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.flushHeaders();
  let closed = false, busy = false, messageScope = null, previousMessages = new Map();
  const send = async () => {
    if (closed || busy || res.writableLength > 64000) return;
    busy = true;
    try { const value = await service.snapshot(req.studyUser); const scope=`${value.room?.id||''}:${value.room?.members.find(m=>m.id===value.me)?.tableId||''}`;
      const next=new Map(value.tableMessages.map(m=>[m.id,m]));
      if(scope===messageScope){const append=value.tableMessages.filter(m=>!previousMessages.has(m.id)),remove=[...previousMessages.keys()].filter(id=>!next.has(id)),read=value.tableMessages.filter(m=>previousMessages.has(m.id)&&previousMessages.get(m.id).read!==m.read).map(m=>({id:m.id,read:m.read}));delete value.tableMessages;if(append.length||remove.length||read.length)value.tableMessageDelta={append,remove,read};}
      messageScope=scope;previousMessages=next; if (!closed) res.write(`data: ${JSON.stringify(value)}\n\n`); }
    catch { if (!closed) res.write('event: unavailable\ndata: {}\n\n'); }
    finally { busy = false; }
  };
  send();
  const timer = setInterval(send, 1000);
  // Periodic reconnect revalidates the bearer token rather than retaining an
  // indefinitely authenticated connection after JWT expiration.
  const expiry = setTimeout(() => res.end(), 5 * 60000);
  res.on('close', () => { closed = true; clearInterval(timer); clearTimeout(expiry); const count = (streams.get(key) || 1) - 1; if (count > 0) streams.set(key, count); else streams.delete(key); });
});
router.use(createRateLimit({ windowMs: 60000, max: 120, key: req => req.userId }));
router.post('/preferences',run(req=>collaboration.updatePreferences(req.studyUser,req.body)));
router.post('/requests/join',createRateLimit({windowMs:60000,max:6,key:req=>req.userId}),run(req=>collaboration.requestJoin(req.studyUser,req.body)));
router.post('/requests/answer',run(req=>collaboration.answerRequest(req.studyUser,req.body)));
router.post('/table/messages/send',createRateLimit({windowMs:60000,max:20,key:req=>req.userId}),run(req=>collaboration.sendTableMessage(req.studyUser,req.body)));
router.post('/table/messages/read',run(req=>collaboration.readTable(req.studyUser,req.body)));
router.post('/friends/search', createRateLimit({windowMs:60000,max:20,key:req=>req.userId}), run(req=>social.searchFriend(req.studyUser,req.body.email)));
router.post('/messages/send', createRateLimit({windowMs:60000,max:10,key:req=>req.userId}), run(req=>social.sendMessage(req.studyUser,req.body)));
router.post('/messages/read', run(req=>social.markRead(req.studyUser,req.body)));
router.post('/public/join', createRateLimit({windowMs:60000,max:6,key:req=>req.userId}), run(req => service.joinPublic(req.studyUser, req.body).then(() => service.snapshot(req.studyUser))));
router.post('/create', run(req => service.create(req.studyUser, req.body.client).then(() => service.snapshot(req.studyUser))));
router.post('/accept', run(req => service.accept(req.studyUser, req.body).then(() => service.snapshot(req.studyUser))));
router.post('/decline', run(req => service.decline(req.studyUser, req.body).then(() => ({ ok: true }))));
router.post('/:id/action', run(req => service.act(req.studyUser, req.params.id, req.body)));
router.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(error.status || 500).json({ error: error.status ? error.message : 'Study rooms are temporarily unavailable. Your personal study tools are still available.' });
});
export default router;
