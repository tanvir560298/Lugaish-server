// Java Programming Practice Problem Registry for Lugaish
// Stores practice topics, problem metadata, and server-side private test cases.

export const JAVA_PRACTICE_TOPICS = [
  {
    id: 'topic-01',
    slug: 'basic-io-variables',
    title: 'Basic Input, Output & Variables',
    language: 'Java',
    level: 'Beginner',
    description:
      'Begin your Java programming journey by practicing printing output, working with variables, and taking user input. Strengthen your fundamentals through practical coding challenges.',
    icon: 'Terminal',
    active: true
  }
];

export const DEFAULT_JAVA_STARTER = `public class Main {
    public static void main(String[] args) {

    }
}
`;

/**
 * In-memory / file registry of practice problems for Topic 1: Basic Input, Output & Variables.
 * As new problems are provided, add them directly to this array.
 *
 * Each problem structure:
 * {
 *   id: string,               // Unique ID, e.g. "java-bio-01"
 *   number: string,           // Problem number, e.g. "01"
 *   title: string,            // Problem title
 *   slug: string,             // URL slug
 *   language: "Java",
 *   categorySlug: "basic-io-variables",
 *   difficulty: "Easy" | "Medium" | "Hard",
 *   problemType: "lugaish" | "external",
 *   sourcePlatform: "Lugaish" | "Codeforces" | "CodeChef" | "beecrowd" | "HackerRank" | ...,
 *   externalUrl?: string,     // Mandatory for external problems
 *   description?: string,     // Problem statement for Lugaish problems
 *   inputFormat?: string,     // Input format description
 *   outputFormat?: string,    // Output format description
 *   constraints?: string,     // Constraints description
 *   sampleTestCases?: [       // Public sample test cases
 *     { input: string, expectedOutput: string, explanation?: string }
 *   ],
 *   hiddenTestCases?: [       // PRIVATE: Strictly kept server-side
 *     { input: string, expectedOutput: string }
 *   ],
 *   starterCode?: string,     // Default starter code
 *   timeLimit?: number,       // in seconds (default 3)
 *   memoryLimit?: number      // in KB (default 128000)
 * }
 */
export const javaProblemsByTopic = {
  'basic-io-variables': [
    // Problems will be added here one by one as provided by user.
  ]
};

/**
 * Returns metadata of all supported Java practice topics.
 */
export function getAllTopics() {
  return JAVA_PRACTICE_TOPICS.map(topic => ({
    ...topic,
    problemCount: (javaProblemsByTopic[topic.slug] || []).length
  }));
}

/**
 * Returns a specific topic metadata by slug.
 */
export function getTopicBySlug(topicSlug = 'basic-io-variables') {
  const topic = JAVA_PRACTICE_TOPICS.find(t => t.slug === topicSlug);
  if (!topic) return null;
  return {
    ...topic,
    problemCount: (javaProblemsByTopic[topic.slug] || []).length
  };
}

/**
 * Strips private server-side test cases from problem object.
 * Guaranteed safe to send to public frontend bundles or API consumers.
 */
export function toPublicProblem(problem) {
  if (!problem) return null;

  if (problem.problemType === 'external') {
    return {
      id: problem.id,
      number: problem.number,
      title: problem.title,
      slug: problem.slug,
      language: problem.language || 'Java',
      categorySlug: problem.categorySlug,
      difficulty: problem.difficulty,
      problemType: 'external',
      sourcePlatform: problem.sourcePlatform || 'External',
      externalUrl: problem.externalUrl || ''
    };
  }

  return {
    id: problem.id,
    number: problem.number,
    title: problem.title,
    slug: problem.slug,
    language: problem.language || 'Java',
    categorySlug: problem.categorySlug,
    difficulty: problem.difficulty,
    problemType: 'lugaish',
    sourcePlatform: problem.sourcePlatform || 'Lugaish',
    description: problem.description || '',
    inputFormat: problem.inputFormat || '',
    outputFormat: problem.outputFormat || '',
    constraints: problem.constraints || '',
    sampleTestCases: Array.isArray(problem.sampleTestCases) ? problem.sampleTestCases : [],
    starterCode: problem.starterCode || DEFAULT_JAVA_STARTER,
    timeLimit: problem.timeLimit || 3,
    memoryLimit: problem.memoryLimit || 128000,
    notes: problem.notes || ''
  };
}

/**
 * Returns all public problems for a given topic slug.
 */
export function getPublicProblemsByTopic(topicSlug = 'basic-io-variables') {
  const problems = javaProblemsByTopic[topicSlug] || [];
  return problems.map(toPublicProblem);
}

/**
 * Returns a single public problem by topic slug and problem slug.
 */
export function getPublicProblemBySlug(topicSlug = 'basic-io-variables', slug) {
  const problems = javaProblemsByTopic[topicSlug] || [];
  const found = problems.find(p => p.slug === slug || p.id === slug);
  return found ? toPublicProblem(found) : null;
}

/**
 * Internal function for judging: returns the problem with all test cases (samples + hidden).
 * NEVER return this to the client!
 */
export function getInternalProblemForJudging(topicSlug = 'basic-io-variables', problemId) {
  const problems = javaProblemsByTopic[topicSlug] || [];
  const problem = problems.find(p => p.id === problemId || p.slug === problemId);
  if (!problem) return null;

  const sampleCases = (problem.sampleTestCases || []).map(tc => ({
    input: tc.input || '',
    expectedOutput: tc.expectedOutput || '',
    isSample: true
  }));

  const hiddenCases = (problem.hiddenTestCases || []).map(tc => ({
    input: tc.input || '',
    expectedOutput: tc.expectedOutput || '',
    isSample: false
  }));

  const combinedTestCases = [...sampleCases, ...hiddenCases];

  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    timeLimit: problem.timeLimit || 3,
    memoryLimit: problem.memoryLimit || 128000,
    testCases: combinedTestCases
  };
}

/**
 * Registers a new problem into a topic (for runtime or programmatic additions).
 */
export function registerProblem(topicSlug, problem) {
  if (!javaProblemsByTopic[topicSlug]) {
    javaProblemsByTopic[topicSlug] = [];
  }
  const idx = javaProblemsByTopic[topicSlug].findIndex(p => p.id === problem.id);
  if (idx >= 0) {
    javaProblemsByTopic[topicSlug][idx] = problem;
  } else {
    javaProblemsByTopic[topicSlug].push(problem);
  }
  return problem;
}
