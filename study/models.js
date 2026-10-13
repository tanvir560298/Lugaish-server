import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  kind: { type: String, enum: ['private', 'public'], default: 'private' },
  publicKey: String,
  name: String, hostId: String, members: [mongoose.Schema.Types.Mixed], invitations: [mongoose.Schema.Types.Mixed],
  tableSessions:{type:mongoose.Schema.Types.Mixed,default:()=>({})},
  tableTogetherMs:{type:mongoose.Schema.Types.Mixed,default:()=>({})},
  revision: { type: Number, default: 0 }, togetherMs: Number, updatedAtMs: Number,
  expiresAt: { type: Date, index: { expires: 0 } },
});
schema.index({ publicKey: 1 }, { unique: true, sparse: true });
schema.index({ 'members.id': 1 });
schema.index({ 'invitations.email': 1 });
schema.index({ 'invitations.digest': 1 });
export const StudyRoom = mongoose.model('StudyRoom', schema);
// Serializes cross-room operations for one account even across API processes.
export const StudyLock = mongoose.model('StudyLock', new mongoose.Schema({ _id: String, until: Number, owner: String }));

const messageSchema=new mongoose.Schema({
  roomId:{type:String,index:true},
  senderId:{type:String,required:true,index:true},recipientId:{type:String,required:true,index:true},
  senderName:String,body:{type:String,required:true,maxlength:500},
  createdAt:{type:Date,default:Date.now},readAt:{type:Date,default:null},
  expiresAt:{type:Date,required:true,index:{expires:0}},
});
messageSchema.index({recipientId:1,readAt:1,createdAt:-1});
export const StudyMessage=mongoose.model('StudyMessage',messageSchema);

export const StudyPreferences=mongoose.model('StudyPreferences',new mongoose.Schema({
  _id:String,tableChatMuted:{type:Boolean,default:false},doNotDisturb:{type:Boolean,default:false},acceptInvitations:{type:Boolean,default:true},identifyRequester:{type:Boolean,default:true},blocked:{type:[String],default:[]},lastRequest:{type:Number,default:0},
}));
export const StudyJoinRequest=mongoose.model('StudyJoinRequest',new mongoose.Schema({
  requesterId:String,recipientId:String,requesterName:String,requesterAvatar:String,status:{type:String,default:'pending'},
  createdAt:{type:Date,default:Date.now},expiresAt:{type:Date,index:{expires:0}},
}));
export const StudyTableMessage=mongoose.model('StudyTableMessage',new mongoose.Schema({
  roomId:String,tableId:String,sessionId:String,membershipId:String,senderId:String,senderName:String,senderAvatar:String,
  audienceIds:[String],readBy:[String],body:{type:String,maxlength:500},createdAt:{type:Date,default:Date.now},expiresAt:{type:Date,index:{expires:0}},
}));

StudyTableMessage.schema.index({roomId:1,tableId:1,sessionId:1,createdAt:1});
