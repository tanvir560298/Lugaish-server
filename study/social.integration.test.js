import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../src/models/User.js';
import { StudyRoom, StudyMessage, StudyJoinRequest } from './models.js';
import * as social from './social.js';
import * as service from './service.js';
import * as collaboration from './collaboration.js';
import routes from './routes.js';
import config from '../src/config.js';

test('two authenticated sessions: private invitations, seat race, table chat, direct privacy, blocking and reconnect', {skip:process.env.RUN_STUDY_INTEGRATION!=='1'}, async()=>{
 const database=`lugaish_study_social_test_${process.pid}_${Date.now()}`;
 await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`,{serverSelectionTimeoutMS:5000});
 let server;
 try{
  const app=express();app.use(express.json());app.use('/api/study',routes);server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${server.address().port}/api/study`;
  const users=await User.create(Array.from({length:8},(_,i)=>({name:`Test Student ${i}`,email:`student${i}@study-test.invalid`}))),[a,b,c]=users;
  const request=async(user,path,body)=>{
   const token=jwt.sign({userId:String(user._id)},config.JWT_SECRET,{expiresIn:'10m'});
   const response=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,value:await response.json()};
  };
  assert.equal((await fetch(base+'/home')).status,401);
  assert.deepEqual(await social.searchFriend(a,b.email),await social.searchFriend(a,'missing@study-test.invalid'));
  const ra=await request(a,'/create',{client:'student-a-client'}),rb=await request(b,'/create',{client:'student-b-client'});assert.equal(ra.status,200);assert.equal(rb.status,200);
  const aid=ra.value.room.id,bid=rb.value.room.id;
  await request(b,`/${bid}/action`,{action:'seat',seat:'s1',direct:true,client:'student-b-client'});
  await request(b,`/${bid}/action`,{action:'heartbeat',characterId:'zain',client:'student-b-client'});
  assert.equal((await request(a,'/requests/join',{email:b.email})).value.message,collaboration.GENERIC);
  let inbox=(await request(b,'/home')).value.joinRequests;assert.equal(inbox.length,1);assert.equal(inbox[0].name,a.name);
  assert.equal((await request(c,'/requests/answer',{id:inbox[0].id,accept:true})).status,409);
  assert.equal((await request(b,'/requests/answer',{id:inbox[0].id,accept:true})).status,200);
  const home=(await request(a,'/home')).value;assert.equal(home.room.id,bid);assert.equal(home.room.members.length,2);
  const m=home.room.members.find(m=>m.id===String(a._id));assert.equal(m.motion.stages[0].type,'greet');assert.ok(m.motion.stages.some(s=>s.type==='walk'));assert.equal(m.motion.stages.at(-1).type,'sit');assert.equal(m.motion.stages[1].start,1800);
  assert.equal((await StudyRoom.findById(aid)).members.length,0);
  assert.equal((await request(b,'/requests/answer',{id:inbox[0].id,accept:true})).status,409);
  await StudyRoom.updateOne({_id:bid,'members.id':String(a._id)},{$set:{'members.$.arrivesAt':0}});
  let sent=await request(a,'/table/messages/send',{body:"Hi! Let's study together."});assert.equal(sent.status,200);
  const bhome=(await request(b,'/home')).value;assert.equal(bhome.tableMessages.length,1);assert.equal(bhome.notifications.length,1);
  assert.equal((await request(c,'/table/messages')).status,403);
  sent=await request(a,'/messages/send',{recipientId:String(b._id),body:'Private hello'});assert.equal(sent.status,200);
  assert.equal((await request(c,`/messages/${a._id}`)).status,403);
  await request(c,'/messages/read',{ids:[sent.value.message.id]});assert.equal((await StudyMessage.findById(sent.value.message.id)).readAt,null);
  await request(b,'/messages/read',{ids:[sent.value.message.id]});assert.ok((await StudyMessage.findById(sent.value.message.id)).readAt);
  assert.equal((await request(a,'/messages/send',{recipientId:String(c._id),body:'Forbidden'})).status,403);
  assert.equal((await request(a,'/table/messages/send',{body:'x'.repeat(501)})).status,400);
  assert.equal((await request(b,'/table/messages/send',{body:'Ready!'})).status,200);
  assert.equal((await request(a,'/home')).value.tableMessages.length,2);
  // Repeated snapshots/reconnect preserve persisted membership and message IDs.
  assert.deepEqual((await request(a,'/home')).value.tableMessages.map(m=>m.id),(await request(a,'/home')).value.tableMessages.map(m=>m.id));
  await request(b,'/preferences',{block:String(a._id)});
  assert.equal((await request(a,'/messages/send',{recipientId:String(b._id),body:'Blocked'})).status,403);
  await request(b,'/preferences',{unblock:String(a._id)});
  await request(b,'/preferences',{acceptInvitations:false});
  await StudyRoom.updateOne({_id:bid,'members.id':String(a._id)},{$set:{'members.$.lastInvite':0}});
  const generic=await request(a,`/${bid}/action`,{action:'invite',email:b.email,client:'student-a-client'});assert.equal(generic.value.message,collaboration.GENERIC);
  await request(b,'/preferences',{acceptInvitations:true});
  // Three invitations race for the last two seats; room revision serializes admissions.
  const candidates=[];
  for(const u of users.slice(2,6)){
   await StudyRoom.updateOne({_id:bid,'members.id':String(b._id)},{$set:{'members.$.lastInvite':0}});
   await service.act(b,bid,{action:'invite',email:u.email,client:'student-b-client'});
   const invitation=(await service.inbox(u))[0];assert.ok(invitation);candidates.push({u,invitation});
  }
  for(const {u,invitation}of candidates.slice(0,2))await service.accept(u,{roomId:bid,invitationId:invitation.id,client:`peer-client-${u._id}`,direct:true});
  const race=await Promise.allSettled(candidates.slice(2).map(({u,invitation})=>service.accept(u,{roomId:bid,invitationId:invitation.id,client:`peer-client-${u._id}`,direct:true})));
  assert.equal(race.filter(r=>r.status==='fulfilled').length,1);assert.equal(race.filter(r=>r.status==='rejected'&&r.reason.status===409).length,1);
  const full=await StudyRoom.findById(bid).lean();assert.equal(full.members.length,5);assert.equal(new Set(full.members.map(m=>m.seat)).size,5);
  await assert.rejects(()=>service.act(b,bid,{action:'invite',email:users[5].email,client:'student-b-client'}),e=>e.status===409);
  // Cross-table leakage and table-session turnover.
  const other=full.members.find(m=>m.id===String(c._id));await service.act(c,bid,{action:'seat',seat:'s6',direct:true,client:other.controller});
  assert.equal((await request(c,'/table/messages')).value.length,0);
  assert.equal((await request(c,'/messages/send',{recipientId:String(b._id),body:'Wrong table'})).status,403);
  const oldId=full.tableSessions['table-1'];assert.ok(oldId);
  // A real SSE connection for a separate authenticated session receives persisted state.
  const controller=new AbortController(),token=jwt.sign({userId:String(b._id)},config.JWT_SECRET,{expiresIn:'10m'});
  const stream=await fetch(base+'/events',{headers:{Authorization:`Bearer ${token}`},signal:controller.signal});assert.equal(stream.status,200);
  const reader=stream.body.getReader(),chunk=await reader.read();assert.ok(new TextDecoder().decode(chunk.value).includes('tableMessages'));controller.abort();
  // Opt-out, anonymous requests and decline.
  const d=users[5];await service.create(d,'student-d-client');await collaboration.updatePreferences(b,{identifyRequester:false});
  await collaboration.requestJoin(d,{email:b.email});inbox=await collaboration.joinInbox(b);assert.equal(inbox[0].name,'A student');assert.equal(inbox[0].requesterId,null);
  await collaboration.answerRequest(b,{id:inbox[0].id,accept:false});assert.equal((await collaboration.joinInbox(b)).length,0);
  assert.equal((await StudyJoinRequest.findById(inbox[0].id)).status,'declined');
 }finally{if(server)await new Promise(resolve=>server.close(resolve));if(mongoose.connection.name===database)await mongoose.connection.dropDatabase();await mongoose.disconnect();}
});
