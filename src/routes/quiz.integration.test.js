import { Course } from '../models/Course.js';
import test from 'node:test';import assert from 'node:assert/strict';import mongoose from 'mongoose';import express from 'express';import jwt from 'jsonwebtoken';
import routes from './quiz.js';import{User}from'../models/User.js';import{Lesson}from'../models/Lesson.js';import{Quiz}from'../models/Quiz.js';import config from'../config.js';
test('real quiz endpoints save complete answers, restore only owner results and reject incomplete or unenrolled submissions',{skip:process.env.RUN_QUIZ_INTEGRATION!=='1'},async()=>{
 const database=`lugaish_quiz_test_${process.pid}_${Date.now()}`;let server;await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`,{serverSelectionTimeoutMS:5000});
 try{const app=express();app.use(express.json());app.use('/api/quiz',routes);server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const users=await User.create([{name:'Quiz owner',email:'owner@quiz-test.invalid',role:'web_developer',enrolledPathways:['english']},{name:'Other student',email:'other@quiz-test.invalid',role:'web_developer',enrolledPathways:['english']},{name:'Unenrolled',email:'none@quiz-test.invalid',role:'learner',enrolledPathways:[]},{name:'Enrolled learner',email:'learner@quiz-test.invalid',role:'learner',enrolledPathways:['english']}]);
 const publishedCourse=await Course.create({language:'english',title:'Isolated published course',status:'published'});
 await Lesson.create({courseGeneration:publishedCourse.generation,publicationStatus:'published',language:'english',day:32,title:'Isolated integration fixture',quiz:[{question:'Choose A',options:['A','B','C','D'],correctAnswer:0},{question:'Choose B',options:['A','B','C','D'],correctAnswer:1}]});
 const request=(user,path,body)=>fetch(`http://127.0.0.1:${server.address().port}/api/quiz/${path}`,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(user?{Authorization:`Bearer ${jwt.sign({userId:String(user._id)},config.JWT_SECRET,{expiresIn:'5m'})}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
 assert.equal((await request(null,'result/english/32')).status,401);
 assert.equal((await request(users[0],'access/english/32')).status,200);
 assert.equal((await request(users[2],'access/english/32')).status,403);
 assert.equal((await request(users[3],'access/english/32')).status,403);
 await Lesson.updateOne({language:'english',day:32},{$set:{accessTier:'premium'}});
 assert.equal((await request(users[3],'submit',{language:'english',day:32,responses:[{selectedAnswer:0},{selectedAnswer:1}]})).status,403);
 await Lesson.updateOne({language:'english',day:32},{$set:{accessTier:'free'}});
 assert.equal((await request(users[2],'submit',{language:'english',day:32,responses:[{selectedAnswer:0},{selectedAnswer:1}]})).status,403);
 assert.equal((await request(users[0],'submit',{language:'english',day:32,responses:[{selectedAnswer:0}]})).status,400);assert.equal(await Quiz.countDocuments(),0);
 const result=await request(users[0],'submit',{language:'english',day:32,responses:[{selectedAnswer:0},{selectedAnswer:0}]});assert.equal(result.status,200);const saved=await result.json();assert.equal(saved.score,50);assert.equal(saved.correctAnswers,1);
 const restored=await(await request(users[0],'result/english/32')).json();assert.equal(restored.correctAnswers,1);assert.equal(restored.confirmed,true);
 assert.equal((await request(users[1],'result/english/32')).status,404);assert.equal((await request(users[0],'result/paid_batch/32')).status,400);
 const retry=await(await request(users[0],'submit',{language:'english',day:32,responses:[{selectedAnswer:0},{selectedAnswer:1}]})).json();assert.equal(retry.correctAnswers,2);assert.equal(retry.xpAwarded,0);
 }finally{if(server)await new Promise(r=>server.close(r));if(mongoose.connection.name===database)await mongoose.connection.dropDatabase();await mongoose.disconnect();}
});
