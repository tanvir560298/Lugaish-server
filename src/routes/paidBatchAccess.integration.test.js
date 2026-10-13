import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import routes from './lessons.js';
import { User } from '../models/User.js';
import config from '../config.js';

test('paid catalogue and direct lesson reject unenrolled and revoked students', {skip:process.env.RUN_PAID_ACCESS_TEST!=='1'},async()=>{
 const database=`lugaish_paid_access_test_${process.pid}_${Date.now()}`;
 let server;
 await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`,{serverSelectionTimeoutMS:5000});
 try{
  const publishedCourse=await Course.create({language:'paid_batch',title:'Isolated private course',status:'published'});
  await Lesson.create({courseGeneration:publishedCourse.generation,language:'paid_batch',day:2,title:'Isolated private lesson',publicationStatus:'published'});
  const app=express();app.use('/api/lessons',routes);server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
  const users=await User.create([
   {name:'Public learner',email:'public@access-test.invalid',role:'learner',enrolledPathways:['english']},
   {name:'Enrolled learner',email:'paid@access-test.invalid',role:'learner',privateBatchAccess:true,enrolledPathways:['paid_batch']},
   {name:'Revoked learner',email:'revoked@access-test.invalid',role:'learner',privateBatchAccess:true,privateBatchExplicitlyRevoked:true},
  ]);
  const request=async(user,path)=>fetch(`http://127.0.0.1:${server.address().port}/api/lessons/paid_batch/${path}`,{headers:{Authorization:`Bearer ${jwt.sign({userId:String(user._id)},config.JWT_SECRET,{expiresIn:'5m'})}`}});
  for(const path of ['day-modules','2']){
   assert.equal((await request(users[0],path)).status,403);
   assert.equal((await request(users[1],path)).status,200);
   assert.equal((await request(users[2],path)).status,403);
  }
 }finally{
  if(server)await new Promise(resolve=>server.close(resolve));
  if(mongoose.connection.name===database)await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
 }
});
