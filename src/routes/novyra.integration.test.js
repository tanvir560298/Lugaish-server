import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import routes from './novyra.js';
import {User} from '../models/User.js';
import {NovyraConversation} from '../models/NovyraConversation.js';
import {NovyraUsage} from '../models/NovyraUsage.js';

test('Novyra workspace chat persists, history is bounded and owner-isolated, deleted accounts and query injection denied',
  {skip:process.env.RUN_CATALOG_INTEGRATION !== '1'}, async () => {
  const database = `novyra_review_test_${process.pid}_${Date.now()}`;
  const oldProvider = process.env.NOVYRA_AI_PROVIDER;
  process.env.NOVYRA_AI_PROVIDER = 'offline';
  let server;
  await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`,{serverSelectionTimeoutMS:5000});
  try {
    await Promise.all([User.init(),NovyraConversation.init(),NovyraUsage.init()]);
    const [owner,other] = await User.create([{name:'Review fixture',email:'novyra-owner@fixture.invalid'}, {name:'Other fixture',email:'novyra-other@fixture.invalid'}]);
    const app = express(); app.use(express.json()); app.use('/api/novyra',routes);
    server = app.listen(0,'127.0.0.1'); await new Promise(resolve => server.once('listening',resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/novyra`;
    const request = (user,path,body) => fetch(url+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:`Bearer ${jwt.sign({userId:String(user._id)},config.JWT_SECRET,{algorithm:'HS256',expiresIn:'5m'})}`},...(body?{body:JSON.stringify(body)}:{})});
    const messages = Array.from({length:64},(_,index) => ({id:`fixture-${index}`,sender:'student',content:'Fixture',timestamp:new Date()}));
    await NovyraConversation.create({userId:owner._id,sessionId:'review',contextType:'workspace',messages});
    let response = await request(owner,'/chat',{sessionId:'review',contextType:'workspace',subject:'english',message:'hello'});
    assert.equal(response.status,200); assert.match((await response.json()).message.content,/Offline template mode/);
    response = await request(owner,'/chat/history?sessionId=review'); assert.equal((await response.json()).length,64);
    response = await request(other,'/chat/history?sessionId=review'); assert.deepEqual(await response.json(),[]);
    response = await request(owner,'/chat',{sessionId:{$ne:null},message:'hello'}); assert.equal(response.status,400);
    response = await request(owner,'/chat',{contextType:'invalid',message:'hello'}); assert.equal(response.status,400);
    response=await request(owner,'/chat',{sessionId:'stream-fixture',contextType:'workspace',subject:'web_dev',message:'What is h1?',stream:true});
    assert.equal(response.status,200);assert.match(response.headers.get('Content-Type'),/text\/event-stream/);
    const streamed=await response.text();assert.match(streamed,/event: done/);assert.match(streamed,/Offline template mode/);
    const stored=await NovyraConversation.findOne({userId:owner._id,sessionId:'stream-fixture'}).lean();assert.equal(stored.messages.length,2);assert.match(stored.messages[1].content,/h1/);
    await User.deleteOne({_id:other._id}); response = await request(other,'/usage'); assert.equal(response.status,401);
  } finally {
    if (server) await new Promise(resolve=>server.close(resolve));
    if(mongoose.connection.name===database) await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    if(oldProvider===undefined) delete process.env.NOVYRA_AI_PROVIDER; else process.env.NOVYRA_AI_PROVIDER=oldProvider;
  }
});
