import { JavaScore } from '../models/JavaScore.js';
import { User } from '../models/User.js';

export async function javaLeaders() {
  const rows = await JavaScore.find({ points: { $gt: 0 } })
    .sort({ points: -1, reachedAt: 1, _id: 1 }).limit(3).populate('_id', 'name').lean();
  return rows.filter(row => row._id).map((row, index) => ({
    userId: String(row._id._id), name: row._id.name || 'Learner',
    rank: index + 1, points: row.points, solved: row.problems.length
  }));
}

export async function awardJavaSolve(userId, topicSlug, problemId) {
  if (!await User.exists({ _id: userId })) return null;
  const before = await javaLeaders();
  // One document per account and an atomic membership check prevent duplicate awards.
  try {
    await JavaScore.updateOne({ _id: userId }, { $setOnInsert: { problems: [], points: 0 } }, { upsert: true });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  const key = `${topicSlug}:${problemId}`;
  const update = await JavaScore.updateOne({ _id: userId, problems: { $ne: key } }, {
    $addToSet: { problems: key }, $inc: { points: 5 }, $set: { reachedAt: new Date() }
  });
  const leaders = await javaLeaders();
  const oldRank = before.find(row => row.userId === userId)?.rank ?? 4;
  const rank = leaders.find(row => row.userId === userId)?.rank ?? null;
  const score = await JavaScore.findById(userId).lean();
  return { awarded: update.modifiedCount ? 5 : 0, points: score.points, rank,
    congratulations: Boolean(update.modifiedCount && rank && rank < oldRank) };
}
