import { ARABIC_CONVERSATION_DAYS } from '../data/arabicConversationPractice.js';
import { DAY_ONE_VIDEOS } from '../data/dayOneVideos.js';
import { Lesson } from '../models/Lesson.js';

export async function ensureArabicConversationPractice() {
  for (const content of DAY_ONE_VIDEOS) {
    const existing = await Lesson.findOne({ language: content.language, day: content.day })
      .select('managedContentKey')
      .lean();
    if (existing?.managedContentKey === content.managedContentKey) continue;

    await Lesson.findOneAndUpdate(
      { language: content.language, day: content.day },
      {
        $set: {
          language: content.language,
          day: content.day,
          title: content.title,
          description: content.description,
          moduleType: 'video',
          modulePublished: true,
          managedContentKey: content.managedContentKey,
          videos: [
            {
              youtubeId: content.youtubeId,
              title: content.videoTitle,
              durationMinutes: content.durationMinutes,
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
