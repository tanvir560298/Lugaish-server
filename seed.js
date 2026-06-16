import mongoose from 'mongoose';
import { Lesson } from './models/Lesson.js';
import config from './config.js';

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
    day: 1,
    language: 'arabic',
    title: 'The Arabic Alphabet',
    description: 'Learn to recognize and pronounce Arabic letters',
    videoUrl: 'https://example.com/arabic-lesson1.mp4',
    duration: 15,
    vocabulary: [
      { word: 'ألف', translation: 'Alif (ا)', pronunciation: 'alif', example: 'First letter of the alphabet' },
      { word: 'باء', translation: 'Ba (ب)', pronunciation: 'baa', example: 'Second letter' },
      { word: 'تاء', translation: 'Ta (ت)', pronunciation: 'taa', example: 'Third letter' },
      { word: 'ثاء', translation: 'Tha (ث)', pronunciation: 'thaa', example: 'Fourth letter' },
      { word: 'جيم', translation: 'Jim (ج)', pronunciation: 'jeem', example: 'Fifth letter' },
    ],
    grammar: {
      concept: 'Arabic Alphabet Basics',
      explanation: 'Arabic has 28 letters. Letters are written from right to left.',
      examples: ['ا', 'ب', 'ت', 'ث', 'ج'],
    },
    speakingTasks: [
      { prompt: 'Pronounce the first 5 Arabic letters', hint: 'alif, ba, ta, tha, jim' },
      { prompt: 'Listen and repeat Arabic vowels', hint: 'Fatha, Damma, Kasra' },
    ],
    quiz: [
      {
        question: 'What is the first letter of the Arabic alphabet?',
        options: ['باء', 'ألف', 'تاء', 'ثاء'],
        correctAnswer: 1,
        explanation: 'Alif (ا) is the first letter of the Arabic alphabet.',
      },
      {
        question: 'What direction is Arabic written?',
        options: ['Left to right', 'Right to left', 'Top to bottom', 'Bottom to top'],
        correctAnswer: 1,
        explanation: 'Arabic is written from right to left.',
      },
    ],
  },
  {
    day: 2,
    language: 'arabic',
    title: 'Common Greetings',
    description: 'Learn essential Arabic greetings',
    videoUrl: 'https://example.com/arabic-lesson2.mp4',
    duration: 12,
    vocabulary: [
      { word: 'السلام عليكم', translation: 'Assalamu alaikum', pronunciation: 'as-sah-lah-moo ah-lay-koom', example: 'Islamic greeting' },
      { word: 'مرحبا', translation: 'Marhaba', pronunciation: 'mar-hah-ba', example: 'Hello' },
      { word: 'كيف حالك', translation: 'Kayf halak?', pronunciation: 'kayf hah-lak', example: 'How are you?' (male)' },
      { word: 'أنا بخير', translation: 'Ana bi-khair', pronunciation: 'ana bi-khair', example: 'I am fine' },
      { word: 'شكراً', translation: 'Shukran', pronunciation: 'shoo-kran', example: 'Thank you' },
    ],
    grammar: {
      concept: 'Arabic Greetings',
      explanation: 'Arabic greetings are formal and respectful, especially in business contexts.',
      examples: ['السلام عليكم ورحمة الله وبركاته', 'مرحبا وأهلا', 'كيف حالك؟'],
    },
    speakingTasks: [
      { prompt: 'Greet someone with "As-salamu alaikum"', hint: 'as-sah-lah-moo ah-lay-koom' },
      { prompt: 'Ask "How are you?" in Arabic', hint: 'kayf halak' },
    ],
    quiz: [
      {
        question: 'What does "السلام عليكم" mean?',
        options: ['Goodbye', 'Peace be upon you', 'Thank you', 'I love you'],
        correctAnswer: 1,
        explanation: '"As-salamu alaikum" is an Islamic greeting meaning "Peace be upon you".',
      },
      {
        question: 'How do you say "I am fine" in Arabic?',
        options: ['أنا سيء', 'أنا بخير', 'أنا حزين', 'أنا متعب'],
        correctAnswer: 1,
        explanation: '"Ana bi-khair" (أنا بخير) means "I am fine".',
      },
    ],
  },
];

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
