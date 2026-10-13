export function exactEmail(value) {
  const email=typeof value==='string'?value.trim().toLowerCase():'';
  if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Object.assign(new Error('Enter your friend’s full email address.'),{status:400});
  return email;
}
export function messageText(value) {
  const body=typeof value==='string'?value.trim():'';
  if(!body||body.length>500)throw Object.assign(new Error('Write a message between 1 and 500 characters.'),{status:400});
  return body;
}
export function publicMessage(message,viewer) {
  if(![message.senderId,message.recipientId].includes(String(viewer)))return null;
  return {id:String(message._id),senderId:message.senderId,recipientId:message.recipientId,senderName:message.senderName,body:message.body,createdAt:message.createdAt,readAt:message.readAt};
}
