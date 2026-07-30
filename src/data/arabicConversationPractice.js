const CORE_CONVERSATION = [
  {
    id: 'greeting',
    question: 'السَّلَامُ عَلَيْكُمْ',
    expectedKeywords: ['وعليكم السلام'],
    acceptedResponses: ['وعليكم السلام ورحمة الله وبركاته', 'وعليكم السلام ورحمة الله', 'وعليكم السلام', 'أهلا وسهلا', 'أهلا', 'مرحبا', 'صباح الخير', 'مساء الخير'],
    sampleAnswer: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    aiResponse: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ',
    scoringStrategy: 'greeting',
  },
  {
    id: 'name',
    question: 'مَا اسْمُكَ؟',
    expectedKeywords: ['اسمي', 'أنا'],
    acceptedResponses: ['اسمي أحمد', 'أنا أحمد'],
    sampleAnswer: 'اسْمِي أَحْمَدُ',
    aiResponse: 'اِسْمِي لُغَيْش، وَأَنَا مُسَاعِدُكَ فِي تَعَلُّمِ اللُّغَةِ العَرَبِيَّةِ.',
    scoringStrategy: 'name',
  },
  {
    id: 'wellbeing',
    question: 'كَيْفَ حَالُكَ؟',
    expectedKeywords: ['بخير', 'الحمد لله'],
    acceptedResponses: ['أنا بخير والحمد لله', 'بخير والحمد لله', 'بخير', 'الحمد لله', 'أنا جيد', 'أنا جيدة', 'تمام', 'ماشي الحال', 'على ما يرام', 'بصحة وعافية'],
    sampleAnswer: 'أَنَا بِخَيْرٍ وَالْحَمْدُ لِلَّهِ',
    aiResponse: 'أَنَا بِخَيْرٍ وَالْحَمْدُ لِلَّهِ، شُكْرًا لَكَ.',
    scoringStrategy: 'wellbeing',
  },
  {
    id: 'origin',
    question: 'مِنْ أَيْنَ أَنْتَ؟',
    expectedKeywords: ['من', 'بنغلاديش'],
    acceptedResponses: ['أنا من بنغلاديش', 'من بنغلاديش', 'بنغلاديش', 'أنا بنغلاديشي', 'أنا بنغلاديشية'],
    sampleAnswer: 'أَنَا مِنْ بَنْغْلَادِيش',
    aiResponse: 'أَنَا مُسَاعِدٌ رَقْمِيٌّ، وَأُسَاعِدُكَ مِنْ خِلَالِ مَنْصَّةِ لُغَيْش.',
    scoringStrategy: 'origin',
  },
  {
    id: 'nationality',
    question: 'مَا جِنْسِيَّتُكَ أَنْتَ؟',
    expectedKeywords: ['بنغلاديشي', 'بنغلاديشية'],
    acceptedResponses: ['جنسيتي بنغلاديشي', 'جنسيتي بنغلاديشية', 'أنا بنغلاديشي', 'أنا بنغلاديشية', 'بنغلاديشي', 'بنغلاديشية', 'أنا من بنغلاديش'],
    sampleAnswer: 'أَنَا بَنْغْلَادِيشِيٌّ',
    aiResponse: 'لَيْسَتْ لِي جِنْسِيَّةٌ، فَأَنَا مُسَاعِدٌ رَقْمِيٌّ لِتَعَلُّمِ اللُّغَةِ العَرَبِيَّةِ.',
    scoringStrategy: 'nationality',
  },
];

function buildQuestions(day, mode) {
  return CORE_CONVERSATION.map(item => ({
    ...item,
    id: `arabic-conversation-${item.id}-day-${day}`,
    language: 'arabic',
    maxMarks: 10,
    scoringStrategy: mode === 'ask' ? 'question_reading' : item.scoringStrategy,
  }));
}

export const ARABIC_CONVERSATION_DAYS = [
  {
    day: 2,
    managedContentKey: 'arabic-conversation-day-2-v1',
    title: 'Arabic Conversation: Listen and Respond',
    description: 'Listen to five everyday Arabic questions, answer by microphone, and receive phrase-based feedback.',
    moduleIntroTitle: 'Listen carefully, then answer in Arabic',
    moduleIntroText: 'The assistant will read each question aloud. Tap the microphone, answer naturally in Arabic, review the transcript, and retry when needed.',
    speakingPracticeMode: 'respond',
    speakingQuestions: buildQuestions(2, 'respond'),
  },
  {
    day: 3,
    managedContentKey: 'arabic-conversation-day-3-v1',
    title: 'Arabic Conversation: Ask the Assistant',
    description: 'Read five Arabic questions aloud. The assistant will recognize each question and answer it in Arabic.',
    moduleIntroTitle: 'Now you ask the questions',
    moduleIntroText: 'Read the Arabic question shown on screen, tap the microphone, and say it clearly. When it is recognized, the assistant will answer aloud in Arabic.',
    speakingPracticeMode: 'ask',
    speakingQuestions: buildQuestions(3, 'ask'),
  },
];
