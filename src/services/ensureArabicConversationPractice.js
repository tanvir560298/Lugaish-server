import { CONVERSATION_DAYS } from '../data/arabicConversationPractice.js';
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

  // Idempotent creation: only create or publish missing practice days.
  for (const content of CONVERSATION_DAYS) {
    const existing = await Lesson.findOne({ language: content.language, day: content.day })
      .select('managedContentKey modulePublished speakingQuestions')
      .lean();

    // If the exact managedContentKey already exists, nothing to do.
    if (existing?.managedContentKey === content.managedContentKey) continue;

    if (!existing) {
      // Create the lesson as AI practice and publish it.
      await Lesson.findOneAndUpdate(
        { language: content.language, day: content.day },
        {
          $set: {
            ...content,
            moduleType: 'ai_practice',
            modulePublished: true,
            speakingPracticeEnabled: true,
            videos: [],
          },
        },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
      continue;
    }

    // If lesson exists but is not published as AI practice, publish and set questions if present.
    const needsPublish = !existing.modulePublished;
    const update = {};
    if (needsPublish) {
      update.moduleType = 'ai_practice';
      update.modulePublished = true;
      update.speakingPracticeEnabled = true;
    }

    // If existing has no speaking questions but content provides them, set them.
    if ((!existing.speakingQuestions || existing.speakingQuestions.length === 0) && Array.isArray(content.speakingQuestions) && content.speakingQuestions.length > 0) {
      update.speakingQuestions = content.speakingQuestions;
      update.speakingPracticeEnabled = true;
    }

    // Only apply an update when something changed.
    if (Object.keys(update).length > 0) {
      await Lesson.findOneAndUpdate(
        { language: content.language, day: content.day },
        { $set: update },
        { runValidators: true, setDefaultsOnInsert: true },
      );
    }
  }
}
