import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problems: { type: [String], default: [] },
  points: { type: Number, default: 0 },
  reachedAt: { type: Date, default: Date.now }
});
export const JavaScore = mongoose.model('JavaScore', schema);
