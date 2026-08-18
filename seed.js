import mongoose from 'mongoose';
import { Lesson } from './src/models/Lesson.js';
import config from './src/config.js';

mongoose.connect(config.MONGODB_URI);

const englishLessons = [
  {
    day: 1,
    language: 'english',
    title: 'Greetings & Introductions',
    description: 'Learn how to greet and introduce yourself in English',
    videoUrl: 'https://example.com/lesson1.mp4',
    duration: 10,
    vocabulary: [
      { word: 'Hello', translation: 'مرحبا', pronunciation: 'hə-LOH', example: 'Hello, my name is Ahmed.' },
      { word: 'Hi', translation: 'أهلا', pronunciation: 'HY', example: 'Hi there!' },
      { word: 'Good morning', translation: 'صباح الخير', pronunciation: 'good MOR-ning', example: 'Good morning, everyone.' },
      { word: 'Goodbye', translation: 'وداعا', pronunciation: 'good-BYE', example: 'Goodbye, see you tomorrow.' },
      { word: 'Nice to meet you', translation: 'يسعدني التعرف عليك', pronunciation: 'nys too MEET yoo', example: 'Nice to meet you, Sara.' },
    ],
    grammar: {
      concept: 'Present Simple - Introductions',
      explanation: 'The present simple tense is used for facts, habits, and introductions.',
      examples: ['I am Ahmed.', 'She is a teacher.', 'They are students.'],
    },
    speakingTasks: [
      { prompt: 'Introduce yourself in English', hint: 'Start with "Hello, my name is..."' },
      { prompt: 'Greet someone and ask their name', hint: 'Use "Hi" and "What is your name?"' },
    ],
    quiz: [
      {
        question: 'How do you say "Hello" in English?',
        options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
        correctAnswer: 1,
        explanation: 'Hello is a common greeting.',
      },
      {
        question: 'What time of day do you say "Good morning"?',
        options: ['Evening', 'Afternoon', 'Morning', 'Night'],
        correctAnswer: 2,
        explanation: 'Good morning is used in the early hours of the day.',
      },
      {
        question: 'Complete: "Nice to ___ you"',
        options: ['see', 'know', 'meet', 'find'],
        correctAnswer: 2,
        explanation: 'The phrase is "Nice to meet you" when greeting someone.',
      },
    ],
  },
  {
    day: 2,
    language: 'english',
    title: 'Basic Conversation Starters',
    description: 'Master simple questions and answers',
    videoUrl: 'https://example.com/lesson2.mp4',
    duration: 12,
    vocabulary: [
      { word: 'How are you?', translation: 'كيف حالك؟', pronunciation: 'how ar YOO', example: 'How are you today?' },
      { word: 'I am fine', translation: 'أنا بخير', pronunciation: 'eye am FYN', example: 'I am fine, thank you.' },
      { word: 'Where are you from?', translation: 'من أين أنت؟', pronunciation: 'where ar yoo FROM', example: 'Where are you from?' },
      { word: 'What is your name?', translation: 'ما اسمك؟', pronunciation: 'what iz yor NAME', example: 'What is your name?' },
      { word: 'Thank you', translation: 'شكراً', pronunciation: 'thank YOO', example: 'Thank you very much.' },
    ],
    grammar: {
      concept: 'Question Formation',
      explanation: 'Use question words (What, Where, How) + auxiliary verbs (do, are).',
      examples: ['What is your name?', 'Where are you from?', 'How are you?'],
    },
    speakingTasks: [
      { prompt: 'Ask someone where they are from', hint: '"Where are you from?"' },
      { prompt: 'Respond to "How are you?"', hint: 'Say "I am fine, thank you"' },
    ],
    quiz: [
      {
        question: 'What question would you ask to learn someone\'s name?',
        options: ['Who are you?', 'What is your name?', 'Are you a person?', 'Do you exist?'],
        correctAnswer: 1,
        explanation: 'Use "What is your name?" to ask for someone\'s name.',
      },
      {
        question: 'How do you politely respond to "How are you?"',
        options: ['I don\'t know', 'I am fine, thank you', 'That\'s none of your business', 'I don\'t care'],
        correctAnswer: 1,
        explanation: '"I am fine, thank you" is a polite and common response.',
      },
    ],
  },
];

const arabicLessons = [
  {
    "day": 1,
    "language": "arabic",
    "title": "Lesson 1: Leadership Words",
    "description": "Learn four useful Arabic leadership words with simple English support.",
    "videoUrl": "https://example.com/arabic-lesson1.mp4",
    "duration": 15,
    "vocabulary": [
      {
        "word": "Leadership",
        "translation": "Qiyadah",
        "pronunciation": "",
        "example": "Use it when talking about leading a team or project."
      },
      {
        "word": "Integrity",
        "translation": "Nazahah",
        "pronunciation": "",
        "example": "Use it when describing someone trustworthy."
      },
      {
        "word": "Influence",
        "translation": "Taathir",
        "pronunciation": "",
        "example": "Use it when a leader inspires others to act."
      },
      {
        "word": "Responsibility",
        "translation": "Masuliyyah",
        "pronunciation": "",
        "example": "Use it when talking about commitment and ownership."
      }
    ],
    "grammar": {
      "concept": "Arabic Day 1",
      "explanation": "Arabic Day 1 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 2,
    "language": "arabic",
    "title": "Lesson 2: Speaking With Impact",
    "description": "Practice simple Arabic-linked words for speaking, delivery, and persuasion.",
    "videoUrl": "https://example.com/arabic-lesson2.mp4",
    "duration": 15,
    "vocabulary": [
      {
        "word": "Eloquence",
        "translation": "Balaghah",
        "pronunciation": "",
        "example": "Use it when speech sounds graceful and convincing."
      },
      {
        "word": "Persuasion",
        "translation": "Iqna",
        "pronunciation": "",
        "example": "Use it when presenting an argument or proposal."
      },
      {
        "word": "Delivery",
        "translation": "Ilqa",
        "pronunciation": "",
        "example": "Use it when practicing speeches or presentations."
      }
    ],
    "grammar": {
      "concept": "Arabic Day 2",
      "explanation": "Arabic Day 2 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "“هٰذَا” (Hadha) শব্দের সঠিক বাংলা অর্থ কোনটি?",
        "options": [
          "সে / তিনি",
          "এটি / এই",
          "তারা",
          "তুমি"
        ],
        "correctAnswer": 1,
        "explanation": "“هٰذَا” (Hadha) শব্দের অর্থ হলো “এটি” বা “এই”।"
      },
      {
        "question": "“একটি বাড়ি” এর সঠিক আরবি প্রতিশব্দ কোনটি?",
        "options": [
          "مَسْجِدٌ (Masjidun)",
          "بَابٌ (Baabun)",
          "كِتَابٌ (Kitaabun)",
          "بَيْتٌ (Baytun)"
        ],
        "correctAnswer": 3,
        "explanation": "“بَيْتٌ” (Baytun) অর্থ হলো একটি বাড়ি।"
      },
      {
        "question": "“এটি একটি মসজিদ” এর সঠিক আরবি অনুবাদ কী হবে?",
        "options": [
          "هٰذَا بَيْتٌ (Hadha baytun)",
          "هٰذَا مَسْجِدٌ (Hadha masjidun)",
          "هٰذَا بَابٌ (Hadha baabun)",
          "مَا هٰذَا؟ (Ma hadha?)"
        ],
        "correctAnswer": 1,
        "explanation": "“هٰذَا َمْسِجٌد” (Hadha masjidun) অর্থ হলো “এটি একটি মসজিদ।”"
      },
      {
        "question": "“مَا هٰذَا؟” (Ma hadha?) প্রশ্নটির সঠিক অর্থ কী?",
        "options": [
          "এটি কী?",
          "তুমি কে?",
          "কেমন আছো?",
          "তোমার নাম কী?"
        ],
        "correctAnswer": 0,
        "explanation": "“مَا” (Ma) অর্থ কী এবং “هٰذَا” (Hadha) অর্থ এটি। অর্থাৎ “مَا هٰذَا؟” অর্থ “এটি কী?”।"
      },
      {
        "question": "“এটি একটি চাবি” - এর সঠিক আরবি অনুবাদ কোনটি?",
        "options": [
          "هٰذَا قَلَمٌ",
          "هٰذَا كِتَابٌ",
          "هٰذَا مِفْتَاحٌ",
          "هٰذَا بَابٌ"
        ],
        "correctAnswer": 2,
        "explanation": "“مِفْتَاحٌ” (Miftaahun) অর্থ চাবি। তাই “هٰذَا مِفْتَاحٌ” অর্থ “এটি একটি চাবি।”"
      },
      {
        "question": "কেউ যদি প্রশ্ন করে “مَا اسْمُكَ؟” (Maa ismuka?), তবে এর উত্তর সাধারণত কীভাবে শুরু করতে হবে?",
        "options": [
          "بِخَيْرٍ (Bi-khayrin)",
          "كَيْفَ (Kayfa)",
          "اِسْمِي... (Ismii...)",
          "هٰذَا... (Hadha...)"
        ],
        "correctAnswer": 2,
        "explanation": "“مَا اسْمُكَ؟” মানে “তোমার নাম কী?”। এর উত্তরে নিজের নাম বলতে “اِسْمِي...” (আমার নাম...) ব্যবহার করতে হয়।"
      },
      {
        "question": "“كَيْفَ حَالُكَ؟” (Kayfa haaluka?) বাক্যটি দ্বারা কী বোঝানো হয়?",
        "options": [
          "তোমার নাম কী?",
          "তুমি কোথা থেকে এসেছ?",
          "এটি কি একটি বাড়ি?",
          "তুমি কেমন আছো?"
        ],
        "correctAnswer": 3,
        "explanation": "“كَيْفَ حَالُكَ؟” অর্থ হলো “তুমি কেমন আছো?”।"
      },
      {
        "question": "“كَيْفَ حَالُكَ؟” (তুমি কেমন আছো?) প্রশ্নের জবাবে সাধারণত কী বলা হয়?",
        "options": [
          "اِسْمِي خَالِدٌ",
          "بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ",
          "هٰذَا بَيْتٌ",
          "نَعَمْ، هٰذَا مَسْجِدٌ"
        ],
        "correctAnswer": 1,
        "explanation": "কুশল জিজ্ঞাসার জবাবে বলতে হয় “بِخَيْرٍ، وَالْحَمْدُ لِلَّهِ” (ভালো আছি, আলহামদুলিল্লাহ)।"
      },
      {
        "question": "ছবিতে একটি কলম দেখিয়ে যদি প্রশ্ন করা হয় “مَا هٰذَا؟” (এটি কী?), তবে সঠিক উত্তর কোনটি হবে?",
        "options": [
          "هٰذَا كِتَابٌ",
          "هٰذَا قَلَمٌ",
          "هٰذَا بَابٌ",
          "هٰذَا بَيْتٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“قَلَمٌ” (Qalamun) অর্থ হলো কলম। তাই সঠিক উত্তর “هٰذَا قَلَمٌ” (এটি একটি কলম)।"
      },
      {
        "question": "“أَهٰذَا بَيْتٌ؟” (A-hadha baytun?) এর অর্থ কী এবং এর সঠিক উত্তর নিচের কোনটি?",
        "options": [
          "এটি কি একটি মসজিদ? - نَعَمْ، هٰذَا مَسْجِدٌ",
          "এটি কি একটি বাড়ি? - نَعَمْ، هٰذَا بَيْتٌ",
          "এটি কি একটি দরজা? - هٰذَا بَابٌ",
          "এটি কি একটি বই? - هٰذَا كِتَابٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“أَهٰذَا بَيْتٌ؟” অর্থ “এটি কি একটি বাড়ি?” এবং এর উত্তর হলো “نَعَمْ، هٰذَا بَيْتٌ” (হ্যাঁ, এটি একটি বাড়ি)।"
      }
    ]
  },
  {
    "day": 3,
    "language": "arabic",
    "title": "Lesson 3: Arabic Reading Practice (PDF 02)",
    "description": "Continue your Arabic learning with this Day 3 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson3.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 3",
      "explanation": "Arabic Day 3 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 4,
    "language": "arabic",
    "title": "Lesson 4: MCQ Quiz Practice",
    "description": "Practice Arabic greetings and leadership vocabulary.",
    "videoUrl": "https://example.com/arabic-lesson4.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 4",
      "explanation": "Arabic Day 4 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরবী ভাষায় “কে?” (মানুষের ক্ষেত্রে) জিজ্ঞাসার জন্য সঠিক শব্দ কোনটি?",
        "options": [
          "مَا (Maa)",
          "مَنْ (Man)",
          "أَيْنَ (Ayna)",
          "مِنْ (Min)"
        ],
        "correctAnswer": 1,
        "explanation": "আরবী ভাষায় মানুষের পরিচয় জানতে “مَنْ” (Man) ব্যবহার করা হয়।"
      },
      {
        "question": "“ذٰلِكَ” (Dhaalika) শব্দটির সঠিক বাংলা অর্থ কোনটি?",
        "options": [
          "এটি / এই (কাছের)",
          "সে / তিনি (অনুপস্থিত)",
          "ওইটি / ওই (দূরের)",
          "তুমি (উপস্থিত)"
        ],
        "correctAnswer": 2,
        "explanation": "“ذٰلِكَ” (Dhaalika) অর্থ হলো “ওইটি” বা “ওই”, যা দূরের কোনো পুরুষবাচক বস্তুকে নির্দেশ করতে ব্যবহৃত হয়।"
      },
      {
        "question": "“ইনি একজন ডাক্তার।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "هٰذَا مُدَرِّسٌ",
          "هٰذَا طَبِيبٌ",
          "هٰذَا تَاجِرٌ",
          "هٰذَا إِمَامٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“طَبِيبٌ” (Tabiibun) অর্থ ডাক্তার। তাই সঠিক বাক্যটি হলো “هٰذَا طَبِيبٌ”।"
      },
      {
        "question": "“مَا ذٰلِكَ؟” (Maa dhaalika?) প্রশ্নটির সঠিক বাংলা অর্থ কী?",
        "options": [
          "ইনি কে?",
          "এটি কী?",
          "ওইটি কী?",
          "তুমি কে?"
        ],
        "correctAnswer": 2,
        "explanation": "“مَا” অর্থ কী এবং “ذٰلِكَ” অর্থ ওইটি। তাই “مَا ذٰلِكَ؟” অর্থ “ওইটি কী?”।"
      },
      {
        "question": "দূরে একটি তারা (Star - نَجْمٌ) দেখিয়ে যদি প্রশ্ন করা হয় “مَا ذٰلِكَ؟” (ওইটি কী?), তবে সঠিক উত্তর কোনটি হবে?",
        "options": [
          "ذٰلِكَ بَيْتٌ",
          "ذٰلِكَ نَجْمٌ",
          "هٰذَا نَجْمٌ",
          "ذٰلِكَ مَسْجِدٌ"
        ],
        "correctAnswer": 1,
        "explanation": "“نَجْمٌ” (Najmun) অর্থ তারা। দূরের জিনিস বোঝাতে “ذٰلِكَ” ব্যবহার করা হয়েছে। তাই সঠিক উত্তর “ذٰلِكَ نَجْمٌ” (ওইটি একটি তারা)।"
      },
      {
        "question": "“مِنْ أَيْنَ أَنْتَ؟” (Min ayna anta?) বাক্যটি দ্বারা কী জানতে চাওয়া হয়?",
        "options": [
          "তোমার নাম কী?",
          "তুমি কেমন আছো?",
          "তুমি কোথা থেকে এসেছ?",
          "তোমার পেশা কী?"
        ],
        "correctAnswer": 2,
        "explanation": "“مِنْ أَيْنَ أَنْتَ؟” অর্থ হলো “তুমি কোথা থেকে এসেছ?”।"
      },
      {
        "question": "“আমি পাকিস্তান থেকে এসেছি।” এর সঠিক আরবী অনুবাদ কোনটি?",
        "options": [
          "أَنَا بَاكِسْتَانِيٌّ",
          "أَنَا مِنْ بَاكِسْتَانَ",
          "أَنَا مِنْ تُرْكِيَا",
          "أَنَا تُرْكِيٌّ"
        ],
        "correctAnswer": 1,
        "explanation": "“أَنَا مِنْ بَاكِسْتَانَ” (Anaa min Baakistaan) অর্থ “আমি পাকিস্তান থেকে এসেছি।”"
      },
      {
        "question": "“َهْل أَنْتَ بَاكِسْتَانِيٌّ؟” (তুমি কি একজন পাকিস্তানি?) এর জবাবে হ্যাঁ-সূচক উত্তরটি কী হবে?",
        "options": [
          "لاَ، أَنَا تُرْكِيٌّ",
          "نَعَمْ، أَنَا بَاكِسْتَانِيٌّ",
          "نَعَمْ، أَنَا مِنْ بَاكِسْتَانَ",
          "اِسْمِي شَرِيفٌ"
        ],
        "correctAnswer": 1,
        "explanation": "জাতীয়তাবাচক প্রশ্ন “َهْل أَنْتَ بَاكِسْتَانِيٌّ؟” এর হ্যাঁ-সূচক জবাব হলো “نَعَمْ، أَنَا بَاكِسْتَانِيٌّ” (হ্যাঁ, আমি পাকিস্তানি)।"
      },
      {
        "question": "“আমি তুর্কি (Turkiyyun)।” এর সঠিক আরবী বাক্য কোনটি?",
        "options": [
          "أَنَا تُرْكِيٌّ",
          "أَنَا مِنْ تُرْكِيَا",
          "أَنَا بَاكِسْتَانِيٌّ",
          "أَنَا مِنْ بَاكِسْتَانَ"
        ],
        "correctAnswer": 0,
        "explanation": "“أَنَا تُرْكِيٌّ” (Anaa Turkiyyun) অর্থ “আমি তুর্কি।” (জাতীয়তা নির্দেশক)।"
      },
      {
        "question": "একজন শিক্ষককে দেখিয়ে যদি প্রশ্ন করা হয় “َمْن هٰذَا؟” (ইনি কে?), তবে সঠিক আরবী উত্তর কোনটি?",
        "options": [
          "هٰذَا تَاجِرٌ",
          "هٰذَا طَبِيبٌ",
          "هٰذَا مُدَرِّسٌ",
          "هٰذَا إِمَامٌ"
        ],
        "correctAnswer": 2,
        "explanation": "“مُدَرِّسٌ” (Mudarrisun) অর্থ শিক্ষক। তাই সঠিক উত্তর হলো “هٰذَا مُدَرِّسٌ” (ইনি একজন শিক্ষক)।"
      }
    ]
  },
  {
    "day": 5,
    "language": "arabic",
    "title": "Lesson 5: Arabic Reading Practice (PDF 03)",
    "description": "Strengthen your Arabic skills with this Day 5 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson5.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 5",
      "explanation": "Arabic Day 5 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 6,
    "language": "arabic",
    "title": "Lesson 6: MCQ Quiz Practice",
    "description": "Practice Arabic leadership terms and meanings.",
    "videoUrl": "https://example.com/arabic-lesson6.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 6",
      "explanation": "Arabic Day 6 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "Taathir (تأثير) শব্দের অর্থ কী?",
        "options": [
          "সততা",
          "প্রভাব",
          "নেতৃত্ব",
          "দায়িত্ব"
        ],
        "correctAnswer": 1,
        "explanation": "Taathir (تأثير) অর্থ হলো প্রভাব।"
      },
      {
        "question": "Masuliyyah (مسؤولية) শব্দের সঠিক অর্থ কোনটি?",
        "options": [
          "সততা",
          "প্রভাব",
          "নেতৃত্ব",
          "দায়িত্ব"
        ],
        "correctAnswer": 3,
        "explanation": "Masuliyyah (مسؤولية) অর্থ হলো দায়িত্ব।"
      }
    ]
  },
  {
    "day": 7,
    "language": "arabic",
    "title": "Lesson 7: Arabic Reading Practice (PDF 04)",
    "description": "Build on your progress with this Day 7 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson7.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 7",
      "explanation": "Arabic Day 7 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 8,
    "language": "arabic",
    "title": "Lesson 8: MCQ Quiz Practice",
    "description": "Practice Arabic public speaking and rhetoric vocabulary.",
    "videoUrl": "https://example.com/arabic-lesson8.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 8",
      "explanation": "Arabic Day 8 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "Balaghah (بلاغة) শব্দের অর্থ কী?",
        "options": [
          "উপস্থাপন",
          "প্ররোচনা",
          "বাগ্মিতা",
          "সততা"
        ],
        "correctAnswer": 2,
        "explanation": "Balaghah (بلاغة) অর্থ হলো বাগ্মিতা (Eloquence)."
      },
      {
        "question": "Iqna (إقناع) বলতে কী বোঝায়?",
        "options": [
          "উপস্থাপন",
          "প্ররোচনা/প্রভাবিত করা",
          "বাগ্মিতা",
          "সততা"
        ],
        "correctAnswer": 1,
        "explanation": "Iqna (إقناع) বলতে প্ররোচনা বা প্রভাবিত করা (Persuasion) বোঝায়।"
      }
    ]
  },
  {
    "day": 9,
    "language": "arabic",
    "title": "Lesson 9: Arabic Reading Practice (PDF 05)",
    "description": "Keep improving with this Day 9 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson9.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 9",
      "explanation": "Arabic Day 9 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 10,
    "language": "arabic",
    "title": "Lesson 10: MCQ Quiz Practice",
    "description": "Practice public speaking and core leadership vocabulary.",
    "videoUrl": "https://example.com/arabic-lesson10.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 10",
      "explanation": "Arabic Day 10 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "Ilqa (إلقاء) শব্দের অর্থ কী?",
        "options": [
          "বাগ্মিতা",
          "প্ররোচনা",
          "উপস্থাপন/বক্তৃতা প্রদান",
          "দায়িত্ব"
        ],
        "correctAnswer": 2,
        "explanation": "Ilqa (إلقاء) শব্দের অর্থ হলো উপস্থাপন বা বক্তৃতা প্রদান (Delivery)."
      },
      {
        "question": "নেতৃত্ব বোঝাতে নিচের কোন আরবি শব্দটি সঠিক?",
        "options": [
          "Nazahah",
          "Qiyadah",
          "Taathir",
          "Ilqa"
        ],
        "correctAnswer": 1,
        "explanation": "নেতৃত্ব বোঝাতে সঠিক আরবি শব্দ হলো Qiyadah (قيادة)।"
      }
    ]
  },
  {
    "day": 11,
    "language": "arabic",
    "title": "Lesson 11: Arabic Reading Practice (PDF 06)",
    "description": "Expand your learning with this Day 11 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson11.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 11",
      "explanation": "Arabic Day 11 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 12,
    "language": "arabic",
    "title": "Lesson 12: MCQ Quiz Practice",
    "description": "Review integrity and influence terms in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson12.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 12",
      "explanation": "Arabic Day 12 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "সততা বোঝাতে নিচের কোন আরবি শব্দটি ব্যবহার করা হয়?",
        "options": [
          "Nazahah",
          "Qiyadah",
          "Iqna",
          "Balaghah"
        ],
        "correctAnswer": 0,
        "explanation": "সততা বোঝাতে Nazahah (نزاهة) শব্দটি ব্যবহৃত হয়।"
      },
      {
        "question": "প্রভাব বা Influence বোঝাতে কোন শব্দটি ব্যবহৃত হয়?",
        "options": [
          "Ilqa",
          "Taathir",
          "Masuliyyah",
          "Nazahah"
        ],
        "correctAnswer": 1,
        "explanation": "প্রভাব বোঝাতে Taathir (تأثير) ব্যবহৃত হয়।"
      }
    ]
  },
  {
    "day": 13,
    "language": "arabic",
    "title": "Lesson 13: Arabic Reading Practice (PDF 07)",
    "description": "Deepen your Arabic practice with this Day 13 learning resource.",
    "videoUrl": "https://example.com/arabic-lesson13.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 13",
      "explanation": "Arabic Day 13 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 14,
    "language": "arabic",
    "title": "Lesson 14: MCQ Quiz Practice",
    "description": "Practice Arabic responsibility and eloquence terms.",
    "videoUrl": "https://example.com/arabic-lesson14.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 14",
      "explanation": "Arabic Day 14 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "দায়িত্ব বা Responsibility বোঝাতে সঠিক আরবি শব্দ কোনটি?",
        "options": [
          "Qiyadah",
          "Nazahah",
          "Masuliyyah",
          "Iqna"
        ],
        "correctAnswer": 2,
        "explanation": "দায়িত্ব বোঝাতে Masuliyyah (مسؤولية) শব্দটি সঠিক।"
      },
      {
        "question": "বাগ্মিতা বা Eloquence বোঝাতে সঠিক আরবি শব্দ কোনটি?",
        "options": [
          "Balaghah",
          "Ilqa",
          "Taathir",
          "Nazahah"
        ],
        "correctAnswer": 0,
        "explanation": "বাগ্মিতা বোঝাতে Balaghah (بلاغة) সঠিক।"
      }
    ]
  },
  {
    "day": 15,
    "language": "arabic",
    "title": "Lesson 15: Arabic Reading Practice (PDF 08)",
    "description": "Continue building confidence with this Day 15 Arabic learning resource.",
    "videoUrl": "https://example.com/arabic-lesson15.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 15",
      "explanation": "Arabic Day 15 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 16,
    "language": "arabic",
    "title": "Lesson 16: MCQ Quiz Practice",
    "description": "Practice Arabic speech delivery and persuasion.",
    "videoUrl": "https://example.com/arabic-lesson16.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 16",
      "explanation": "Arabic Day 16 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "প্ররোচনা বা Persuasion বোঝাতে কোন আরবি শব্দটি সঠিক?",
        "options": [
          "Qiyadah",
          "Iqna",
          "Ilqa",
          "Nazahah"
        ],
        "correctAnswer": 1,
        "explanation": "প্ররোচনা বোঝাতে Iqna (إقناع) সঠিক।"
      },
      {
        "question": "বক্তৃতা উপস্থাপন বা Delivery বোঝাতে নিচের কোনটি সঠিক?",
        "options": [
          "Ilqa",
          "Balaghah",
          "Taathir",
          "Masuliyyah"
        ],
        "correctAnswer": 0,
        "explanation": "উপস্থাপন বোঝাতে Ilqa (إلقاء) সঠিক।"
      }
    ]
  },
  {
    "day": 17,
    "language": "arabic",
    "title": "Lesson 17: Arabic Reading Practice (PDF 09)",
    "description": "Advance your Arabic learning with this Day 17 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson17.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 17",
      "explanation": "Arabic Day 17 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 18,
    "language": "arabic",
    "title": "Lesson 18: MCQ Quiz Practice",
    "description": "Review common Arabic greetings and expressions.",
    "videoUrl": "https://example.com/arabic-lesson18.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 18",
      "explanation": "Arabic Day 18 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আরби ভাষায় কুশল জিজ্ঞেস করতে নিচের কোন বাক্যটি সঠিক?",
        "options": [
          "মিন আইনা আন্তা?",
          "কাইফা হালুকা?",
          "মা ইসমুকা?",
          "আহলান ওয়া সাহলান"
        ],
        "correctAnswer": 1,
        "explanation": "কুশল বা কেমন আছো তা জিজ্ঞাসা করতে “কাইফা হালুকা?” ব্যবহৃত হয়।"
      },
      {
        "question": "পুরুষবাচক সম্বোধনে \"কেমন আছো?\" জিজ্ঞেস করতে কোনটি সঠিক?",
        "options": [
          "কাইফা হালুকা?",
          "কাইফা হালুকি?",
          "মা ইসমুকা?",
          "আনা মিনাল মাগরিব"
        ],
        "correctAnswer": 0,
        "explanation": "পুরুষের ক্ষেত্রে “কাইফা হালুকা?” ব্যবহার করা হয়।"
      }
    ]
  },
  {
    "day": 19,
    "language": "arabic",
    "title": "Lesson 19: Arabic Reading Practice (PDF 10)",
    "description": "Keep progressing with this Day 19 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson19.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 19",
      "explanation": "Arabic Day 19 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 20,
    "language": "arabic",
    "title": "Lesson 20: MCQ Quiz Practice",
    "description": "Review female greetings and answers in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson20.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 20",
      "explanation": "Arabic Day 20 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "নারীবাচক সম্বোধনে \"কেমন আছো?\" জিজ্ঞেস করতে কোনটি সঠিক?",
        "options": [
          "কাইফা হালুকা?",
          "কাইফা হালুকি?",
          "মা ইসমুকা?",
          "আনা বাংলাদেশিয়্যাতুন"
        ],
        "correctAnswer": 1,
        "explanation": "নারীদের ক্ষেত্রে “কাইফা হালুকি?” সঠিক বাক্য।"
      },
      {
        "question": "কেউ জিজ্ঞেস করল 'কাইফা হালুকা?', সঠিক উত্তর কী হবে?",
        "options": [
          "ইসমি আহমাদ",
          "আনা মিনাল উরদুন",
          "বিখাইরিন, আলহামদুলিল্লাহ",
          "আনা তালিবুন"
        ],
        "correctAnswer": 2,
        "explanation": "কেমন আছো প্রশ্নের উত্তর সাধারণত “বিখাইরিন, আলহামদুলিল্লাহ” (ভালো আছি, আলহামদুলিল্লাহ) হয়।"
      }
    ]
  },
  {
    "day": 21,
    "language": "arabic",
    "title": "Lesson 21: Arabic Reading Practice (PDF 11)",
    "description": "Reinforce your progress with this Day 21 Arabic reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson21.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 21",
      "explanation": "Arabic Day 21 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 22,
    "language": "arabic",
    "title": "Lesson 22: MCQ Quiz Practice",
    "description": "Practice introducing names in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson22.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 22",
      "explanation": "Arabic Day 22 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "কারও নাম জিজ্ঞাসা করতে কোন বাক্যটি ব্যবহার করা হয়?",
        "options": [
          "মিন আইনা আন্তা?",
          "মা ইসমুকা?",
          "কাইফা হালুকা?",
          "আহলান ওয়া সাহলান"
        ],
        "correctAnswer": 1,
        "explanation": "কারও নাম জানতে চাইলে “মা ইসমুকা?” (আপনার নাম কী?) বলা হয়।"
      },
      {
        "question": "Educator জিজ্ঞেস করলেন 'মা ইসমুকা?', সঠিক উত্তর কোনটি?",
        "options": [
          "ইসমি আহমাদ",
          "আনা বিখাইরিন",
          "আনা মিনাল উরদুন",
          "আনা তালিবুন"
        ],
        "correctAnswer": 0,
        "explanation": "নামের উত্তরে “ইসমি [নাম]” (আমার নাম [নাম]) বলা হয়।"
      }
    ]
  },
  {
    "day": 23,
    "language": "arabic",
    "title": "Lesson 23: Arabic Reading Practice (PDF 12)",
    "description": "Broaden your Arabic knowledge with this Day 23 reading and practice resource.",
    "videoUrl": "https://example.com/arabic-lesson23.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 23",
      "explanation": "Arabic Day 23 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 24,
    "language": "arabic",
    "title": "Lesson 24: MCQ Quiz Practice",
    "description": "Practice identifying countries and origins in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson24.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 24",
      "explanation": "Arabic Day 24 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "আপনি কোথা থেকে এসেছেন তা জানতে কোন প্রশ্নটি করা হয়?",
        "options": [
          "মা ইসমুকা?",
          "মিন আইনা আন্তা?",
          "কাইফা হালুকা?",
          "আহলান ওয়া সাহলান"
        ],
        "correctAnswer": 1,
        "explanation": "কোথা থেকে এসেছেন তা জানতে “মিন আইনা আন্তা?” (তুমি কোথা থেকে এসেছ?) ব্যবহৃত হয়।"
      },
      {
        "question": "কেউ জিজ্ঞেস করল 'মিন আইনা আন্তা?', সঠিক উত্তর কোনটি?",
        "options": [
          "আনা মিসর",
          "আনা মিন মিসর",
          "আনা মিসরিউন",
          "জিনসিয়াতি মিসর"
        ],
        "correctAnswer": 1,
        "explanation": "“আনা মিন মিসর” এর অর্থ “আমি মিশর থেকে এসেছি।”"
      }
    ]
  },
  {
    "day": 25,
    "language": "arabic",
    "title": "Lesson 25: Arabic Reading Practice (PDF 13)",
    "description": "Develop your Arabic skills further with this Day 25 learning resource.",
    "videoUrl": "https://example.com/arabic-lesson25.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 25",
      "explanation": "Arabic Day 25 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": []
  },
  {
    "day": 26,
    "language": "arabic",
    "title": "Lesson 26: MCQ Quiz Practice",
    "description": "Practice nationalities in Arabic.",
    "videoUrl": "https://example.com/arabic-lesson26.mp4",
    "duration": 15,
    "vocabulary": [],
    "grammar": {
      "concept": "Arabic Day 26",
      "explanation": "Arabic Day 26 grammar concept",
      "examples": []
    },
    "speakingTasks": [],
    "moduleType": "video",
    "modulePublished": true,
    "quiz": [
      {
        "question": "জাতীয়তা জানতে পুরুষবাচক সম্বোধনে কোনটি সঠিক?",
        "options": [
          "মিন আইনা আন্তা?",
          "মা জিনসিয়্যাতুকা আন্তা?",
          "কাইফা হালুকা?",
          "মা ইসমুকা?"
        ],
        "correctAnswer": 1,
        "explanation": "জাতীয়তা জানতে পুরুষ সম্বোধনে “মা জিনসিয়্যাতুকা আন্তা?” ব্যবহৃত হয়।"
      },
      {
        "question": "কোনো ছাত্রী বাংলাদেশি হলে তার সঠিক জাতীয়তা প্রকাশ কোনটি?",
        "options": [
          "আনা বাংলাদেশ",
          "আনা মিন বাংলাদেশিয়্যাহ",
          "আনা বাংলাদেশিয়্যাতুন",
          "আনা বাংলাদেশিয়্যুন"
        ],
        "correctAnswer": 2,
        "explanation": "ছাত্রী (স্ত্রীলিঙ্গ) এর জাতীয়তা প্রকাশে “আনা বাংলাদেশিয়্যাতুন” সঠিক বাক্য।"
      }
    ]
  }
];
;
;
;
;

async function seedLessons() {
  try {
    // Clear existing lessons
    await Lesson.deleteMany({});

    // Seed English lessons
    await Lesson.insertMany(englishLessons);
    console.log('✅ English lessons seeded');

    // Seed Arabic lessons
    await Lesson.insertMany(arabicLessons);
    console.log('✅ Arabic lessons seeded');

    mongoose.connection.close();
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    mongoose.connection.close();
  }
}

seedLessons();
