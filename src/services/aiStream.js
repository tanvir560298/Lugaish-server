// SSE parser handles arbitrary network chunk boundaries and UTF-8 splits.
export async function readProviderEvents(body,onEvent){
 if(!body)throw Error('Provider returned no stream.');
 const reader=body.getReader(),decoder=new TextDecoder();let pending='';
 try{while(true){const {done,value}=await reader.read();pending+=done?decoder.decode():decoder.decode(value,{stream:true});pending=pending.replace(/\r\n/g,'\n');let split;
 while((split=pending.indexOf('\n\n'))>=0){const block=pending.slice(0,split);pending=pending.slice(split+2);const data=block.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trimStart()).join('\n');if(data&&data!=='[DONE]')await onEvent(JSON.parse(data));}
 if(pending.length>1024*1024)throw Error('Provider event too large.');if(done)break;
 }}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
