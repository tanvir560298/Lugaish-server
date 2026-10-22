import test from 'node:test';import assert from 'node:assert/strict';import mongoose from 'mongoose';
import {reserveAiBudget,reservationMicros} from './aiBudget.js';import {NovyraBudget} from '../models/NovyraBudget.js';
test('parallel AI reservations cannot overshoot daily or monthly application budgets',{skip:process.env.RUN_CATALOG_INTEGRATION!=='1'},async()=>{
 const database=`tanu_budget_test_${process.pid}_${Date.now()}`;await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`,{serverSelectionTimeoutMS:5000});
 try{await NovyraBudget.init();const base={NOVYRA_INPUT_USD_PER_MILLION:'1',NOVYRA_OUTPUT_USD_PER_MILLION:'2'};const messages=[{content:'A real question'}],maxTokens=10,cost=reservationMicros(messages,'Tutor',maxTokens,base),now=new Date('2026-10-23T10:00:00Z');
 const env={...base,NOVYRA_DAILY_BUDGET_USD:String((cost*3+0.5)/1e6),NOVYRA_MONTHLY_BUDGET_USD:'1'};
 let result=await Promise.allSettled(Array.from({length:30},()=>reserveAiBudget({messages,systemPrompt:'Tutor',maxTokens,env,now})));assert.equal(result.filter(r=>r.status==='fulfilled').length,3);
 const stored=await NovyraBudget.findById('2026-10').lean();assert.equal(stored.monthlyMicros,cost*3);assert.equal(stored.dailyMicros['23'],cost*3);
 // A new day still shares the monthly ceiling.
 env.NOVYRA_DAILY_BUDGET_USD='1';env.NOVYRA_MONTHLY_BUDGET_USD=String((cost*4+0.5)/1e6);
 result=await Promise.allSettled(Array.from({length:15},()=>reserveAiBudget({messages,systemPrompt:'Tutor',maxTokens,env,now:new Date('2026-10-24T10:00:00Z')})));assert.equal(result.filter(r=>r.status==='fulfilled').length,1);
 }finally{await mongoose.connection.dropDatabase();await mongoose.disconnect();}
});
