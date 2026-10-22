export function aiConfiguration(env=process.env){
 const provider=(env.NOVYRA_AI_PROVIDER||'auto').toLowerCase();
 const providers=provider==='auto'?['gemini','openai']:[provider];
 const selected=providers.find(p=>p==='gemini'?!!env.GEMINI_API_KEY:p==='openai'?!!env.OPENAI_API_KEY:false);
 const missing=[];
 if(env.NOVYRA_PAID_ENABLED!=='true')missing.push('NOVYRA_PAID_ENABLED');
 if(!selected)missing.push('provider API key');
 if(!env.NOVYRA_MODEL_NAME)missing.push('NOVYRA_MODEL_NAME');
 for(const key of ['NOVYRA_DAILY_BUDGET_USD','NOVYRA_MONTHLY_BUDGET_USD','NOVYRA_INPUT_USD_PER_MILLION','NOVYRA_OUTPUT_USD_PER_MILLION'])if(!(Number.isFinite(Number(env[key]))&&Number(env[key])>0))missing.push(key);
 return{ready:!missing.length,provider:selected,model:env.NOVYRA_MODEL_NAME,missing};
}
