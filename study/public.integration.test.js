import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../src/models/User.js';
import { StudyRoom } from './models.js';
import { SEATS } from './seating.js';
import routes from './routes.js';
import config from '../src/config.js';

test('authenticated public seating: atomic allocation, private isolation, recovery, full hall, release and DND', {skip:process.env.RUN_PUBLIC_STUDY_TEST!=='1'}, async()=>{
 const database=`lugaish_public_test_${process.pid}_${Date.now()}`;
 await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`,{serverSelectionTimeoutMS:5000});
 let server;
 try {
  await StudyRoom.init();
  const app=express();app.use(express.json());app.use('/api/study',routes);
  server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}/api/study`;
  const users=await User.create(Array.from({length:8},(_,i)=>({name:`Public Test ${i}`,email:`public${i}@test.invalid`}))),[a,b,c,d,e]=users;
  const request=async(u,path,body)=>{
   const token=jwt.sign({userId:String(u._id)},config.JWT_SECRET,{expiresIn:'10m'});
   const response=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
   return {status:response.status,value:await response.json()};
  };
  const join=u=>request(u,'/public/join',{client:`public-client-${u._id}`,characterId:'zain',direct:true});
  assert.equal((await fetch(base+'/public/tables')).status,401);
  assert.equal((await fetch(base+'/public/join',{method:'POST'})).status,401);
  const privateRoom=(await request(a,'/create',{client:'private-client-a'})).value.room;
  await request(a,`/${privateRoom.id}/action`,{client:'private-client-a',action:'seat',seat:'s1',direct:true});
  let discovery=(await request(b,'/public/tables')).value;
  assert.equal(discovery.tables.length,20);assert.equal(discovery.tables.reduce((n,t)=>n+t.available,0),100);
  assert.ok(!JSON.stringify(discovery).includes(privateRoom.id));assert.ok(!JSON.stringify(discovery).includes(a.name));
  assert.equal((await join(a)).status,409);
  const joined=await Promise.all([join(b),join(c),join(d)]);
  joined.forEach(r=>assert.equal(r.status,200));
  const hall=joined[0].value.room.id;
  const home=(await request(b,'/home')).value;
  for(const [path,body] of [['/table/messages/send',{body:'Public chat blocked'}],['/messages/send',{recipientId:String(c._id),body:'Public DM blocked'}],['/table/messages',null],[`/messages/${c._id}`,null],['/messages/read',{ids:[]}]])assert.equal((await request(b,path,body)).status,403);
  assert.deepEqual(home.tableMessages,[]);assert.deepEqual(home.notifications,[]);
  assert.equal(home.room.kind,'public');assert.equal(home.room.hostId,null);assert.equal(home.room.members.length,3);
  assert.equal(new Set(home.room.members.map(m=>m.seat)).size,3);
  assert.ok(home.room.members.every(m=>m.characterId==='zain'));
  assert.ok(!home.room.members.find(m=>m.id===String(c._id)).controller);
  const streamAbort=new AbortController();
  const stream=await fetch(base+'/events',{headers:{Authorization:`Bearer ${jwt.sign({userId:String(c._id)},config.JWT_SECRET,{expiresIn:'10m'})}`},signal:streamAbort.signal});
  assert.equal(stream.status,200);const reader=stream.body.getReader();
  try{const {value}=await reader.read();const snapshot=JSON.parse(new TextDecoder().decode(value).split('data: ')[1].split('\n')[0]);assert.equal(snapshot.room.id,hall);assert.equal(snapshot.room.members.length,3);}finally{streamAbort.abort();await reader.cancel().catch(()=>{});}
  const before=home.room.members.find(m=>m.id===String(b._id));
  const again=await request(b,'/public/join',{client:'different-tab-client'});
  const after=again.value.room.members.find(m=>m.id===String(b._id));
  assert.equal(after.seat,before.seat);assert.equal(after.controller,before.controller);
  assert.equal((await request(a,`/${hall}/action`,{action:'seat',seat:'s10',client:'private-client-a'})).status,403);
  assert.equal((await request(b,`/${privateRoom.id}/action`,{action:'seat',seat:'s10',client:`public-client-${b._id}`})).status,403);
  for(const action of ['remove','invite','call','answer'])assert.equal((await request(b,`/${hall}/action`,{action,target:String(c._id),email:a.email,client:`public-client-${b._id}`})).status,403);
  assert.equal((await request(b,`/${hall}/action`,{action:'wave',target:String(c._id),client:`public-client-${b._id}`})).status,403);
  assert.equal((await request(b,'/preferences',{doNotDisturb:true})).value.doNotDisturb,true);
  const bSeat=before.seat;
  await request(c,`/${hall}/action`,{action:'seat',seat:SEATS.find(s=>s.tableId===SEATS.find(s=>s.id===bSeat).tableId&&s.id!==bSeat&&s.id!==home.room.members.find(m=>m.id===String(d._id)).seat).id,direct:true,client:`public-client-${c._id}`});
  assert.equal((await request(c,'/messages/send',{recipientId:String(b._id),body:'DND test'})).status,403);
  assert.equal((await request(b,'/home')).value.notifications.length,0);
  await request(b,'/preferences',{doNotDisturb:false,block:String(c._id)});
  assert.equal((await request(c,'/messages/send',{recipientId:String(b._id),body:'Blocked test'})).status,403);
  assert.equal((await request(d,`/${hall}/action`,{action:'stand',direct:true,client:`public-client-${d._id}`})).status,200);
  assert.equal((await join(d)).status,200);
  assert.equal((await StudyRoom.findById(hall)).members.filter(m=>m.id===String(d._id)).length,1);
  // Fill only this disposable test database, then race two real authenticated
  // HTTP joins for its final free chair. No fabricated production membership.
  const now=Date.now(),reserved=SEATS.slice(0,99).map((s,i)=>({id:`test-fixture-${i}`,name:'Test fixture',seat:s.id,lastSeen:now,arrivesAt:now,phase:'paused',focusMs:0,focusUntil:now}));
  await StudyRoom.updateOne({_id:hall},{$set:{members:reserved,updatedAtMs:now},$inc:{revision:1}});
  const race=await Promise.all([join(e),join(users[5])]);
  assert.deepEqual(race.map(r=>r.status).sort(),[200,409]);
  const full=await StudyRoom.findById(hall).lean();assert.equal(full.members.length,100);assert.equal(new Set(full.members.map(m=>m.seat)).size,100);
  assert.equal((await join(users[6])).status,409);
  assert.equal((await request(a,'/home')).value.room.id,privateRoom.id);
  // Stale reservations expire after two minutes; admission releases them in
  // the same compare-and-swap transaction as the next allocation.
  await StudyRoom.updateOne({_id:hall},{$set:{'members.0.lastSeen':Date.now()-120001},$inc:{revision:1}});
  assert.equal((await join(users[6])).status,200);
  const id=String(users[6]._id),client=`public-client-${id}`;
  assert.equal((await request(users[6],`/${hall}/action`,{action:'leave',client})).status,200);
  assert.equal((await request(users[6],'/home')).value.room,null);
  assert.equal((await join(users[7])).status,200);
 } finally {if(server)await new Promise(r=>server.close(r));await mongoose.connection.dropDatabase();await mongoose.disconnect();}
});
