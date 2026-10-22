import test from 'node:test';import assert from 'node:assert/strict';
import {aiConfiguration} from './aiConfig.js';import {createAiCapacity} from './aiCapacity.js';import {reservationMicros,reserveAiBudget} from './aiBudget.js';import {callOpenAiApi,callGeminiApi} from './aiProvider.js';
const env={NOVYRA_PAID_ENABLED:'true',NOVYRA_AI_PROVIDER:'openai',OPENAI_API_KEY:'fixture-key',NOVYRA_MODEL_NAME:'fixture-model',NOVYRA_DAILY_BUDGET_USD:'1',NOVYRA_MONTHLY_BUDGET_USD:'10',NOVYRA_INPUT_USD_PER_MILLION:'1',NOVYRA_OUTPUT_USD_PER_MILLION:'2'};
test('readiness requires matching provider credentials, explicit enablement, budgets and prices',()=>{
 assert.equal(aiConfiguration(env).ready,true);assert.equal(aiConfiguration({...env,NOVYRA_AI_PROVIDER:'gemini'}).ready,false);
 for(const key of ['OPENAI_API_KEY','NOVYRA_PAID_ENABLED','NOVYRA_MODEL_NAME','NOVYRA_DAILY_BUDGET_USD','NOVYRA_MONTHLY_BUDGET_USD','NOVYRA_INPUT_USD_PER_MILLION','NOVYRA_OUTPUT_USD_PER_MILLION'])assert.equal(aiConfiguration({...env,[key]:''}).ready,false);
 assert.equal(aiConfiguration({...env,NOVYRA_DAILY_BUDGET_USD:'Infinity'}).ready,false);
});
test('capacity rejects duplicate users and overload, then releases safely',()=>{
 const acquire=createAiCapacity(2),release=acquire('a');assert.equal(acquire('a'),null);const b=acquire('b');assert.equal(acquire('c'),null);release();release();assert.equal(typeof acquire('c'),'function');b();
});
test('budget reservations use a single conditional atomic update and fail closed',async()=>{
 const request={messages:[{content:'বাংলা'}],systemPrompt:'Tutor',maxTokens:100,env};let update;
 const model={updateOne:async()=>{},findOneAndUpdate:async(q,u)=>{update={q,u};return {};}};
 const cost=await reserveAiBudget({...request,now:new Date('2026-10-23T10:00:00Z'),model});assert.equal(cost,reservationMicros(request.messages,'Tutor',100,env));assert.equal(update.q._id,'2026-10');assert.equal(update.u.$inc.monthlyMicros,cost);assert.equal(update.u.$inc['dailyMicros.23'],cost);assert.equal(update.q.monthlyMicros.$lte,1e7-cost);
 await assert.rejects(reserveAiBudget({...request,model:{...model,findOneAndUpdate:async()=>null}}),/budget has been reached/);
 await assert.rejects(reserveAiBudget({...request,env:{...env,NOVYRA_DAILY_BUDGET_USD:'0.000001'},model}),/budget unavailable/);
});
function stream(events){return new Response(events.map(e=>'data: '+JSON.stringify(e)+'\n\n').join(''),{headers:{'Content-Type':'text/event-stream'}});}
test('OpenAI streams text with conversation roles, bounded output and usage',async()=>{
 const original=globalThis.fetch;let body;try{globalThis.fetch=async(url,options)=>{body=JSON.parse(options.body);return stream([{choices:[{delta:{content:'হ্যালো '}}]},{choices:[{delta:{content:'friend'},finish_reason:'stop'}]},{choices:[],usage:{prompt_tokens:8,completion_tokens:3}}]);};const parts=[];
 const result=await callOpenAiApi({messages:[{sender:'student',content:'hello'},{sender:'novyra',content:'Hi'},{sender:'student',content:'explain'}],systemPrompt:'Tutor',maxTokens:100,apiKey:'fixture',onDelta:t=>parts.push(t)});
 assert.equal(parts.join(''),'হ্যালো friend');assert.equal(result.completionTokens,3);assert.equal(body.stream,true);assert.equal(body.max_completion_tokens,100);assert.deepEqual(body.messages.map(m=>m.role),['system','user','assistant','user']);
 }finally{globalThis.fetch=original;}
});
test('Gemini streams visible text, hides thoughts, and sends keys in headers',async()=>{
 const original=globalThis.fetch;try{globalThis.fetch=async(url,options)=>{assert.ok(url.includes('streamGenerateContent?alt=sse'));assert.ok(!url.includes('fixture-secret'));assert.equal(options.headers['x-goog-api-key'],'fixture-secret');return stream([{candidates:[{content:{parts:[{text:'private',thought:true},{text:'Visible reply'}]},finishReason:'STOP'}],usageMetadata:{promptTokenCount:3,candidatesTokenCount:4,thoughtsTokenCount:2}}]);};const parts=[];
 const result=await callGeminiApi({messages:[{sender:'student',content:'hello'}],apiKey:'fixture-secret',onDelta:t=>parts.push(t)});assert.equal(parts.join(''),'Visible reply');assert.equal(result.completionTokens,6);
 }finally{globalThis.fetch=original;}
});
test('truncated provider replies fail instead of persisting partial output as complete',async()=>{
 const original=globalThis.fetch;try{globalThis.fetch=async()=>stream([{choices:[{delta:{content:'partial'}}]}]);await assert.rejects(callOpenAiApi({messages:[],apiKey:'fixture',onDelta:()=>{}}),/interrupted/);}finally{globalThis.fetch=original;}
});
