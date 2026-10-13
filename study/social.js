import { User } from '../src/models/User.js';
import { StudyRoom, StudyMessage } from './models.js';
import { exactEmail, messageText, publicMessage } from './socialValidation.js';
import { tableContext, allowed, preferences } from './collaboration.js';
import { tableForSeat } from './tableLayout.js';
import { GRACE_MS, RELEASE_MS } from './timing.js';
const account=user=>String(user._id);
const id=value=>{if(!/^[a-f\d]{24}$/i.test(String(value)))throw Object.assign(new Error('Choose a registered friend.'),{status:400});return String(value);};
export async function searchFriend(user,value) {
  exactEmail(value);
  return {message:'If this account accepts invitations, your request will be delivered.'};
}
export async function sendMessage(user,body) {
  const recipientId=id(body.recipientId),text=messageText(body.body);
  if(recipientId===account(user))throw Object.assign(new Error('Choose a friend to message.'),{status:400});
  const {room,me,tableId}=await tableContext(user);
  if(me.arrivesAt>Date.now()||!room.members.some(m=>m.id===recipientId&&tableForSeat(m.seat)===tableId&&Date.now()-m.lastSeen<GRACE_MS)||!await allowed(account(user),recipientId,false))throw Object.assign(new Error('Choose an available member at your table.'),{status:403});
  if(!await User.exists({_id:recipientId}))throw Object.assign(new Error('That friend is no longer available.'),{status:404});
  const now=Date.now();
  const message=await StudyMessage.create({roomId:String(room._id),senderId:account(user),recipientId,senderName:user.name,body:text,createdAt:new Date(now),expiresAt:new Date(now+86400000)});
  return {message:publicMessage(message.toObject(),account(user))};
}
async function privatePeers(user) {
  const context=await tableContext(user),now=Date.now();
  const peers=context.room.members.filter(m=>m.id!==account(user)&&tableForSeat(m.seat)===context.tableId&&now-m.lastSeen<GRACE_MS);
  const permitted=await Promise.all(peers.map(async m=>await allowed(m.id,account(user),false)?m.id:null));
  return {...context,peerIds:permitted.filter(Boolean)};
}
export async function unreadMessages(user) {
  if ((await preferences(user)).doNotDisturb) return [];
  let context;try{context=await privatePeers(user);}catch(e){if(e.status===403)return [];throw e;}
  const messages=await StudyMessage.find({roomId:String(context.room._id),senderId:{$in:context.peerIds},recipientId:account(user),readAt:null,expiresAt:{$gt:new Date()}}).sort({createdAt:-1}).limit(20).lean();
  return messages.reverse().map(m=>publicMessage(m,account(user)));
}
export async function conversation(user,friendId) {
  const friend=id(friendId),me=account(user),context=await privatePeers(user);
  if(!context.peerIds.includes(friend))throw Object.assign(new Error('Choose an available member of your private group table.'),{status:403});
  const messages=await StudyMessage.find({roomId:String(context.room._id),$or:[{senderId:me,recipientId:friend},{senderId:friend,recipientId:me}],expiresAt:{$gt:new Date()}}).sort({createdAt:-1}).limit(30).lean();
  return messages.reverse().map(m=>publicMessage(m,me));
}
export async function markRead(user,body) {
  const context=await privatePeers(user);
  const ids=Array.isArray(body.ids)?body.ids.filter(v=>/^[a-f\d]{24}$/i.test(String(v))).slice(0,20):[];
  await StudyMessage.updateMany({_id:{$in:ids},roomId:String(context.room._id),senderId:{$in:context.peerIds},recipientId:account(user),readAt:null},{$set:{readAt:new Date()}});
  return {ok:true};
}
