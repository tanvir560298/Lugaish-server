import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import { performance } from 'node:perf_hooks';
import { User } from '../src/models/User.js';
import { StudyRoom,StudyTableMessage } from './models.js';
import * as service from './service.js';
import * as chat from './collaboration.js';
import routes from './routes.js';
import config from '../src/config.js';

test('temporary table history survives membership, cleans departures and protects rejoin generations', {skip:process.env.RUN_TABLE_SESSION_TEST!=='1'}, async()=>{
 const database=`lugaish_table_session_test_${process.pid}_${Date.now()}`;
 await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`,{serverSelectionTimeoutMS:5000});
 let server;
 try{
  const app=express();app.use(express.json());app.use('/api/study',routes);server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}/api/study`,users=await User.create(Array.from({length:4},(_,i)=>({name:`Table Test ${i}`,email:`table${i}@test.invalid`}))),[a,b,c,d]=users;
  const request=async(u,path,body)=>{const response=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${jwt.sign({userId:String(u._id)},config.JWT_SECRET,{expiresIn:'10m'})}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,value:await response.json()};};
  const client=u=>`table-client-${u._id}`;
  const room=await service.create(a,client(a)),id=String(room._id);
  const action=(u,type,body={})=>request(u,`/${id}/action`,{client:client(u),action:type,direct:true,...body});
  await action(a,'seat',{seat:'s1'});
  const admit=async u=>{await StudyRoom.updateOne({_id:id,'members.id':String(a._id)},{$set:{'members.$.lastInvite':0}});await service.act(a,id,{action:'invite',email:u.email,client:client(a)});const invitation=(await service.inbox(u))[0];await service.accept(u,{roomId:id,invitationId:invitation.id,client:client(u),direct:true});};
  await admit(b);
  for(let i=0;i<10;i++)assert.equal((await request(a,'/table/messages/send',{body:`A ${i}`,senderId:String(d._id)})).status,200);
  for(let i=0;i<5;i++)assert.equal((await request(b,'/table/messages/send',{body:`B ${i}`})).status,200);
  assert.equal((await request(a,'/table/messages')).value.length,15);assert.deepEqual((await request(a,'/table/messages')).value,(await request(b,'/table/messages')).value.map(m=>({...m,read:m.senderId===String(a._id)})));
  assert.equal((await action(b,'remove',{target:String(a._id)})).status,403);
  await admit(c);assert.equal((await request(c,'/table/messages')).value.length,15);
  const legacyRoom=await StudyRoom.findById(id).lean(),legacySeat=legacyRoom.members.find(m=>m.id===String(c._id)).seat;
  await StudyRoom.updateOne({_id:id,'members.id':String(c._id)},{$unset:{'members.$.tableGeneration':1}});
  const legacyMessage=await StudyTableMessage.create({roomId:id,tableId:'table-1',sessionId:legacyRoom.tableSessions['table-1'],senderId:String(c._id),body:'Legacy active message',createdAt:new Date(),expiresAt:new Date(Date.now()+86400000)});
  assert.equal((await request(c,'/table/messages')).value.length,16);
  await action(c,'heartbeat');assert.ok((await StudyTableMessage.findById(legacyMessage._id)).membershipId);
  await action(c,'stand');await action(c,'seat',{seat:legacySeat});assert.equal((await request(c,'/table/messages')).value.length,15);
  assert.equal((await request(d,'/table/messages')).status,403);assert.equal((await request(d,'/table/messages/send',{body:'Forged',roomId:id,senderId:String(a._id)})).status,403);
  const old=(await StudyRoom.findById(id)).members.find(m=>m.id===String(a._id)).tableGeneration;
  assert.equal((await action(a,'stand')).status,200);
  assert.equal((await request(a,'/table/messages')).status,403);
  assert.equal((await request(b,'/table/messages')).value.length,5);
  assert.equal(await StudyTableMessage.countDocuments({senderId:String(a._id)}),0);
  // Rejoin creates a fresh generation. An old late insertion is hidden and
  // cleaned without touching the new generation's messages.
  await action(a,'seat',{seat:'s1'});
  const current=(await StudyRoom.findById(id)).members.find(m=>m.id===String(a._id)).tableGeneration;assert.notEqual(current,old);
  await chat.sendTableMessage(a,{body:'New generation'});
  const latest=(await StudyRoom.findById(id)).toObject();
  await StudyTableMessage.create({roomId:id,tableId:'table-1',sessionId:latest.tableSessions['table-1'],membershipId:old,senderId:String(a._id),body:'Stale insertion',createdAt:new Date(),expiresAt:new Date(Date.now()+86400000)});
  await service.reconcileTableMessages(latest,true);
  assert.equal((await request(a,'/table/messages')).value.length,6);
  assert.equal(await StudyTableMessage.countDocuments({membershipId:old}),0);
  // Failed switch keeps membership and all original messages.
  assert.equal((await action(a,'seat',{seat:'s2'})).status,409);assert.equal((await request(a,'/table/messages')).value.length,6);
  // Camera-only actions have no membership mutation: repeated home reads
  // preserve generation and history, without table cleanup by UI navigation.
  await request(a,'/home');assert.equal((await request(a,'/table/messages')).value.length,6);
  await action(a,'seat',{seat:'s6'});assert.equal((await request(b,'/table/messages')).value.length,5);assert.equal((await request(a,'/table/messages')).value.length,0);
  await chat.sendTableMessage(a,{body:'Other table'});
  // A brief network lapse retains messages, but authoritative expiry clears
  // them even when the expired user never sends a leave action.
  await StudyRoom.updateOne({_id:id,'members.id':String(a._id)},{$set:{'members.$.lastSeen':Date.now()-25000}});
  await service.sweepTableMessages();assert.equal(await StudyTableMessage.countDocuments({senderId:String(a._id)}),1);
  await StudyRoom.updateOne({_id:id,'members.id':String(a._id)},{$set:{'members.$.lastSeen':Date.now()-120001}});
  await service.sweepTableMessages();assert.equal(await StudyTableMessage.countDocuments({senderId:String(a._id)}),0);
  // Beyond the former 40-message truncation; all active history is retained.
  for(let i=0;i<100;i++)await chat.sendTableMessage(b,{body:`Retained ${i}`});
  const times=[];for(let i=0;i<10;i++){const start=performance.now();assert.equal((await request(c,'/table/messages')).value.length,105);times.push(performance.now()-start);}
  times.sort((x,y)=>x-y);console.log(`PROFILE: authenticated HTTP read of 105 retained messages p50=${times[5].toFixed(2)}ms p90=${times[9].toFixed(2)}ms`);
  const abort=new AbortController(),token=jwt.sign({userId:String(c._id)},config.JWT_SECRET,{expiresIn:'10m'});
  const stream=await fetch(base+'/events',{headers:{Authorization:`Bearer ${token}`},signal:abort.signal}),reader=stream.body.getReader();let buffer='',events=[];
  try{while(events.length<2){const chunk=await reader.read();buffer+=new TextDecoder().decode(chunk.value);let end;while((end=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,end);buffer=buffer.slice(end+2);events.push(JSON.parse(event.split('data: ')[1]));}}
   assert.equal(events[0].tableMessages.length,105);assert.equal(events[1].tableMessages,undefined);
   const before=Buffer.byteLength(JSON.stringify({...events[1],tableMessages:events[0].tableMessages})),after=Buffer.byteLength(JSON.stringify(events[1]));
   console.log(`PROFILE: unchanged authenticated SSE snapshot before=${before} bytes after=${after} bytes (${((1-after/before)*100).toFixed(1)}% less)`);
   await action(b,'leave');
   while(events.length<3){const chunk=await reader.read();buffer+=new TextDecoder().decode(chunk.value);let end;while((end=buffer.indexOf('\n\n'))>=0){const event=buffer.slice(0,end);buffer=buffer.slice(end+2);events.push(JSON.parse(event.split('data: ')[1]));}}
   assert.equal(events[2].tableMessageDelta.remove.length,105);
  }finally{abort.abort();await reader.cancel().catch(()=>{});}
  assert.equal((await request(c,'/table/messages')).value.length,0);assert.equal(await StudyTableMessage.countDocuments({senderId:String(b._id)}),0);
  await action(c,'leave');assert.equal(await StudyTableMessage.countDocuments({roomId:id,tableId:'table-1'}),0);
 }finally{if(server)await new Promise(r=>server.close(r));if(mongoose.connection.name===database)await mongoose.connection.dropDatabase();await mongoose.disconnect();}
});
