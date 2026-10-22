import {NovyraBudget} from '../models/NovyraBudget.js';
export function reservationMicros(messages,systemPrompt,maxTokens,env=process.env){
 // Reserve the upper input byte count plus framing overhead, and all output.
 // Reservations stay spent even on failure; this deliberately underuses a budget.
 const input=Buffer.byteLength(systemPrompt)+messages.reduce((sum,m)=>sum+Buffer.byteLength(m.content||'')+256,0)+1024;
 return Math.max(1,Math.ceil(input*Number(env.NOVYRA_INPUT_USD_PER_MILLION)+maxTokens*Number(env.NOVYRA_OUTPUT_USD_PER_MILLION)));
}
export async function reserveAiBudget({messages,systemPrompt,maxTokens,now=new Date(),env=process.env,model=NovyraBudget}){
 const month=now.toISOString().slice(0,7),day=now.getUTCDate().toString(),cost=reservationMicros(messages,systemPrompt,maxTokens,env);
 const daily=Math.floor(Number(env.NOVYRA_DAILY_BUDGET_USD)*1e6),monthly=Math.floor(Number(env.NOVYRA_MONTHLY_BUDGET_USD)*1e6);
 if(!Number.isFinite(cost)||cost>daily||cost>monthly)throw Error('AI budget unavailable. Please try again later.');
 try{await model.updateOne({_id:month},{$setOnInsert:{monthlyMicros:0,dailyMicros:{}}},{upsert:true});}catch(e){if(e.code!==11000)throw Error('AI budget could not be verified.');}
 const dailyField=`dailyMicros.${day}`;
 const reserved=await model.findOneAndUpdate({_id:month,monthlyMicros:{$lte:monthly-cost},$or:[{[dailyField]:{$lte:daily-cost}},{[dailyField]:{$exists:false}}]},{$inc:{monthlyMicros:cost,[dailyField]:cost}},{new:true});
 if(!reserved)throw Error('Tanu’s AI budget has been reached. Please return later.');
 return cost;
}
