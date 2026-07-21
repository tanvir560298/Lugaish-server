const SUPPORTED_LANGUAGES = new Set(['english', 'arabic']);
export const DAY_MODULE_TYPES = ['video', 'ai_practice', 'interview'];
const DAY_MODULE_TYPE_SET = new Set(DAY_MODULE_TYPES);

export const MAX_SPEAKING_QUESTIONS = 30;

export class SpeakingPracticeValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SpeakingPracticeValidationError';
  }
}

function normalizeText(value, fieldName, maxLength, { allowEmpty = false } = {}) {
  if (typeof value !== 'string') {
    throw new SpeakingPracticeValidationError(`${fieldName} must be text`);
  }

  const normalized = value.normalize('NFKC').replace(/\s+/gu, ' ').trim();
  if (!allowEmpty && !normalized) {
    throw new SpeakingPracticeValidationError(`${fieldName} is required`);
  }
  if (normalized.length > maxLength) {
    throw new SpeakingPracticeValidationError(`${fieldName} must be ${maxLength} characters or fewer`);
  }

  return normalized;
}

function normalizeAudioUrl(value, fieldName) {
  if (value === undefined || value === null || value === '') return undefined;

  const normalized = normalizeText(value, fieldName, 2048);
  let parsedUrl;
  try {
    parsedUrl = new URL(normalized);
  } catch {
    throw new SpeakingPracticeValidationError(`${fieldName} must be a valid URL`);
  }

  const isLocalHttp = parsedUrl.protocol === 'http:'
    && ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
  if (parsedUrl.protocol !== 'https:' && !isLocalHttp) {
    throw new SpeakingPracticeValidationError(`${fieldName} must use https (local development may use http on localhost)`);
  }

  return parsedUrl.toString();
}

function normalizeMaxMarks(value, fieldName) {
  const trimmedValue = typeof value === 'string' ? value.trim() : '';
  const normalized = /^\d+(?:\.\d+)?$/.test(trimmedValue) ? Number(trimmedValue) : value;
  if (typeof normalized !== 'number' || !Number.isFinite(normalized) || normalized <= 0 || normalized > 100) {
    throw new SpeakingPracticeValidationError(`${fieldName} must be a number greater than 0 and no more than 100`);
  }

  return Math.round(normalized * 100) / 100;
}

export function normalizeLessonScope(languageValue, dayValue) {
  const language = typeof languageValue === 'string' ? languageValue.trim().toLowerCase() : '';
  if (!SUPPORTED_LANGUAGES.has(language)) {
    throw new SpeakingPracticeValidationError('Language must be english or arabic');
  }

  if (typeof dayValue !== 'string' || !/^[1-9]\d*$/.test(dayValue)) {
    throw new SpeakingPracticeValidationError('Day must be a positive integer');
  }

  const day = Number(dayValue);
  if (!Number.isSafeInteger(day) || day > 10000) {
    throw new SpeakingPracticeValidationError('Day must be between 1 and 10000');
  }

  return { language, day };
}

export function normalizeSpeakingQuestions(value, lessonLanguage) {
  if (!Array.isArray(value)) {
    throw new SpeakingPracticeValidationError('questions must be an array');
  }
  if (value.length > MAX_SPEAKING_QUESTIONS) {
    throw new SpeakingPracticeValidationError(`A lesson can have at most ${MAX_SPEAKING_QUESTIONS} speaking questions`);
  }

  const questionIds = new Set();

  return value.map((item, index) => {
    const fieldPrefix = `questions[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new SpeakingPracticeValidationError(`${fieldPrefix} must be an object`);
    }

    const id = normalizeText(item.id, `${fieldPrefix}.id`, 80);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) {
      throw new SpeakingPracticeValidationError(`${fieldPrefix}.id may only contain letters, numbers, underscores, and hyphens`);
    }
    const normalizedId = id.toLowerCase();
    if (questionIds.has(normalizedId)) {
      throw new SpeakingPracticeValidationError(`${fieldPrefix}.id must be unique within the lesson`);
    }
    questionIds.add(normalizedId);

    const language = normalizeText(item.language, `${fieldPrefix}.language`, 20).toLowerCase();
    if (!SUPPORTED_LANGUAGES.has(language)) {
      throw new SpeakingPracticeValidationError(`${fieldPrefix}.language must be english or arabic`);
    }
    if (language !== lessonLanguage) {
      throw new SpeakingPracticeValidationError(`${fieldPrefix}.language must match the lesson language`);
    }

    if (!Array.isArray(item.expectedKeywords) || item.expectedKeywords.length === 0) {
      throw new SpeakingPracticeValidationError(`${fieldPrefix}.expectedKeywords must contain at least one keyword`);
    }
    if (item.expectedKeywords.length > 30) {
      throw new SpeakingPracticeValidationError(`${fieldPrefix}.expectedKeywords can contain at most 30 keywords`);
    }

    const keywordKeys = new Set();
    const expectedKeywords = item.expectedKeywords.reduce((keywords, keyword, keywordIndex) => {
      const normalizedKeyword = normalizeText(
        keyword,
        `${fieldPrefix}.expectedKeywords[${keywordIndex}]`,
        100,
      );
      const keywordKey = normalizedKeyword.toLocaleLowerCase(language === 'arabic' ? 'ar' : 'en');
      if (!keywordKeys.has(keywordKey)) {
        keywordKeys.add(keywordKey);
        keywords.push(normalizedKeyword);
      }
      return keywords;
    }, []);

    const normalizedQuestion = {
      id,
      question: normalizeText(item.question, `${fieldPrefix}.question`, 500),
      language,
      expectedKeywords,
      sampleAnswer: normalizeText(item.sampleAnswer, `${fieldPrefix}.sampleAnswer`, 2000),
      maxMarks: normalizeMaxMarks(item.maxMarks, `${fieldPrefix}.maxMarks`),
    };

    const audioUrl = normalizeAudioUrl(item.audioUrl, `${fieldPrefix}.audioUrl`);
    if (audioUrl) normalizedQuestion.audioUrl = audioUrl;

    return normalizedQuestion;
  });
}

export function normalizeSpeakingPracticeEnabled(value) {
  if (typeof value !== 'boolean') {
    throw new SpeakingPracticeValidationError('enabled must be true or false');
  }

  return value;
}

function normalizeOptionalText(value, fieldName, maxLength) {
  if (value === undefined || value === null) return '';
  return normalizeText(value, fieldName, maxLength, { allowEmpty: true });
}

export function getDayModuleType(lesson) {
  return DAY_MODULE_TYPE_SET.has(lesson?.moduleType) ? lesson.moduleType : 'video';
}

export function isDayModulePublished(lesson) {
  // Existing documents predate this field and must remain available.
  return lesson?.modulePublished !== false;
}

export function normalizeDayModuleConfig(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new SpeakingPracticeValidationError('Day module settings must be an object');
  }

  const moduleType = normalizeText(value.moduleType, 'moduleType', 40).toLowerCase();
  if (!DAY_MODULE_TYPE_SET.has(moduleType)) {
    throw new SpeakingPracticeValidationError('moduleType must be video, ai_practice, or interview');
  }

  if (value.published !== undefined && typeof value.published !== 'boolean') {
    throw new SpeakingPracticeValidationError('published must be true or false');
  }

  return {
    moduleType,
    published: value.published ?? false,
    title: normalizeText(value.title, 'title', 160),
    description: normalizeOptionalText(value.description, 'description', 2000),
    introTitle: normalizeOptionalText(value.introTitle, 'introTitle', 160),
    introText: normalizeOptionalText(value.introText, 'introText', 2000),
  };
}

function extractYouTubeId(value) {
  const trimmedValue = value.trim();
  let sourceUrl = trimmedValue;

  // Course managers often copy the full YouTube embed snippet. Read only its
  // src attribute instead of accepting arbitrary HTML or a third-party iframe.
  if (/^<iframe\b/iu.test(trimmedValue)) {
    const srcMatch = trimmedValue.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/iu);
    sourceUrl = srcMatch?.[1] ?? srcMatch?.[2] ?? srcMatch?.[3] ?? '';
    if (!sourceUrl) {
      throw new SpeakingPracticeValidationError('youtubeUrl iframe must include a YouTube src attribute');
    }
  }

  if (sourceUrl.startsWith('//')) sourceUrl = `https:${sourceUrl}`;

  let parsedUrl;
  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    throw new SpeakingPracticeValidationError('youtubeUrl must be a valid URL');
  }

  if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
    throw new SpeakingPracticeValidationError('youtubeUrl must be an http or https YouTube link');
  }

  const host = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');
  let videoId = '';
  if (host === 'youtu.be') {
    videoId = parsedUrl.pathname.split('/').filter(Boolean)[0] ?? '';
  } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (parsedUrl.pathname === '/watch') videoId = parsedUrl.searchParams.get('v') ?? '';
    else if (['embed', 'shorts', 'live'].includes(pathParts[0])) videoId = pathParts[1] ?? '';
  }

  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    throw new SpeakingPracticeValidationError('youtubeUrl must be a valid YouTube video link');
  }

  return videoId;
}

export function normalizeLessonVideo(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new SpeakingPracticeValidationError('Video settings must be an object');
  }

  const durationValue = typeof value.durationMinutes === 'string'
    ? Number(value.durationMinutes.trim())
    : value.durationMinutes;
  if (!Number.isFinite(durationValue) || durationValue < 1 || durationValue > 600) {
    throw new SpeakingPracticeValidationError('durationMinutes must be between 1 and 600');
  }

  return {
    title: normalizeText(value.title, 'video title', 120),
    youtubeId: extractYouTubeId(normalizeText(value.youtubeUrl, 'youtubeUrl', 2048)),
    durationMinutes: Math.round(durationValue),
  };
}
