import mongoose from 'mongoose';
// A single shared month document makes daily and monthly reservations atomic.
const schema=new mongoose.Schema({_id:String,monthlyMicros:{type:Number,default:0},dailyMicros:{type:Map,of:Number,default:{}}},{timestamps:true});
export const NovyraBudget=mongoose.model('NovyraBudget',schema);
