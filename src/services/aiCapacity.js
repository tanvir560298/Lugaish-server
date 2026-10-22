export function createAiCapacity(limit=4){
 const users=new Set();
 return user=>{if(users.has(user)||users.size>=limit)return null;users.add(user);let released=false;return()=>{if(!released){released=true;users.delete(user);}};};
}
