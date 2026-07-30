import { ARABIC_CONVERSATION_DAYS, ARABIC_DAY_ONE_VIDEO } from '../data/arabicConversationPractice.js';
import { Lesson } from '../models/Lesson.js';

export async function ensureArabicConversationPractice() {
  const dayOne = await Lesson.findOne({ language: 'arabic', day: 1 })
    .select('managedContentKey')
    .lean();
  if (dayOne?.managedContentKey !== ARABIC_DAY_ONE_VIDEO.managedContentKey) {
    await Lesson.findOneAndUpdate(
      { language: 'arabic', day: 1 },
      {
        $set: {
          language: 'arabic',
          day: ARABIC_DAY_ONE_VIDEO.day,
          title: ARABIC_DAY_ONE_VIDEO.title,
          description: ARABIC_DAY_ONE_VIDEO.description,
          moduleType: 'video',
          modulePublished: true,
          managedContentKey: ARABIC_DAY_ONE_VIDEO.managedContentKey,
          videos: [
            {
              youtubeId: ARABIC_DAY_ONE_VIDEO.youtubeId,
              title: ARABIC_DAY_ONE_VIDEO.videoTitle,
              durationMinutes: ARABIC_DAY_ONE_VIDEO.durationMinutes,
            },
          ],
        },
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }

  for (const content of ARABIC_CONVERSATION_DAYS) {
    const existing = await Lesson.findOne({ language: 'arabic', day: content.day })
      .select('managedContentKey')
      .lean();
    if (existing?.managedContentKey === content.managedContentKey) continue;

    await Lesson.findOneAndUpdate(
      { language: 'arabic', day: content.day },
      {
        $set: {
          ...content,
          language: 'arabic',
          moduleType: 'ai_practice',
          modulePublished: true,
          speakingPracticeEnabled: true,
          videos: [],
        },
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }
}
