import { ARABIC_CONVERSATION_DAYS } from '../data/arabicConversationPractice.js';
import { Lesson } from '../models/Lesson.js';

export async function ensureArabicConversationPractice() {
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
