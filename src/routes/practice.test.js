import test from 'node:test';
import assert from 'node:assert/strict';
import practiceRoutes from './practice.js';
import {
  getAllTopics,
  getTopicBySlug,
  toPublicProblem,
  getInternalProblemForJudging,
  registerProblem,
  javaProblemsByTopic
} from '../data/javaProblemsRegistry.js';
import { normalizeOutput, decodeBase64 } from '../services/javaJudge.js';

test('decodeBase64 correctly decodes base64 strings and preserves plain text', () => {
  assert.equal(decodeBase64('SGVsbG8sIHdvcmxkIQo='), 'Hello, world!\n');
  assert.equal(decodeBase64('TWFpbi5qYXZhOjE6IGVycm9y'), 'Main.java:1: error');
  assert.equal(decodeBase64('Hello, world!\n'), 'Hello, world!\n');
  assert.equal(decodeBase64(''), '');
  assert.equal(decodeBase64(null), '');
});

test('normalizeOutput handles CRLF, trailing spaces, and empty lines', () => {
  assert.equal(normalizeOutput('Hello World  \r\n'), 'Hello World');
  assert.equal(normalizeOutput('Line 1   \nLine 2   \r\n'), 'Line 1\nLine 2');
  assert.equal(normalizeOutput('\n\n  Test  \n\n'), 'Test');
  assert.equal(normalizeOutput(null), '');
});

test('Topic metadata is accurately configured for Java practice topics', () => {
  const topics = getAllTopics();
  assert.ok(Array.isArray(topics));
  assert.ok(topics.length >= 3);

  const topic1 = getTopicBySlug('basic-io-variables');
  assert.ok(topic1);
  assert.equal(topic1.title, 'Basic Input, Output & Variables');
  assert.equal(topic1.language, 'Java');
  assert.equal(topic1.level, 'Beginner');
  assert.ok(topic1.description.includes('Begin your Java programming journey'));

  const topic2 = getTopicBySlug('operators-expressions');
  assert.ok(topic2);
  assert.equal(topic2.title, 'Operators & Expressions');
  assert.equal(topic2.problemCount, 16);

  const topic3 = getTopicBySlug('conditional-statements');
  assert.ok(topic3);
  assert.equal(topic3.title, 'Conditional Statements (if, else, switch)');
  assert.equal(topic3.problemCount, 12);

  const topic4 = getTopicBySlug('loops-iterations');
  assert.ok(topic4);
  assert.equal(topic4.title, 'Loops & Iterations');
  assert.equal(topic4.problemCount, 10);

  const topic5 = getTopicBySlug('nested-loops-pattern-printing');
  assert.ok(topic5);
  assert.equal(topic5.title, 'Nested Loops & Pattern Printing');
  assert.equal(topic5.problemCount, 2);

  const topic6 = getTopicBySlug('arrays');
  assert.ok(topic6);
  assert.equal(topic6.title, 'Arrays');
  assert.equal(topic6.problemCount, 15);

  const topic7 = getTopicBySlug('strings-manipulation');
  assert.ok(topic7);
  assert.equal(topic7.title, 'Strings & String Manipulation');
  assert.equal(topic7.problemCount, 8);

  const topic8 = getTopicBySlug('methods-functions');
  assert.ok(topic8);
  assert.equal(topic8.title, 'Methods & Functions');
  assert.equal(topic8.problemCount, 9);
});

test('toPublicProblem strictly hides private hidden test cases and credentials', () => {
  const rawProblem = {
    id: 'test-prob-01',
    number: '01',
    title: 'Print Numbers',
    slug: 'print-numbers',
    language: 'Java',
    categorySlug: 'basic-io-variables',
    difficulty: 'Easy',
    problemType: 'lugaish',
    description: 'Print numbers from 1 to 5',
    sampleTestCases: [{ input: '', expectedOutput: '1 2 3 4 5' }],
    hiddenTestCases: [{ input: '', expectedOutput: '1 2 3 4 5' }, { input: 'secret', expectedOutput: 'secret' }]
  };

  const publicProblem = toPublicProblem(rawProblem);
  assert.equal(publicProblem.id, 'test-prob-01');
  assert.equal(publicProblem.title, 'Print Numbers');
  assert.ok(publicProblem.sampleTestCases);
  assert.equal(publicProblem.hiddenTestCases, undefined);

  // External problem check
  const externalProb = {
    id: 'ext-prob-01',
    number: '02',
    title: 'Watermelon',
    slug: 'watermelon',
    categorySlug: 'basic-io-variables',
    difficulty: 'Easy',
    problemType: 'external',
    sourcePlatform: 'Codeforces',
    externalUrl: 'https://codeforces.com/problemset/problem/4/A'
  };
  const publicExternal = toPublicProblem(externalProb);
  assert.equal(publicExternal.problemType, 'external');
  assert.equal(publicExternal.externalUrl, 'https://codeforces.com/problemset/problem/4/A');
  assert.equal(publicExternal.sampleTestCases, undefined);
});

test('getInternalProblemForJudging prepares combined test cases with isSample flags', () => {
  const originalProblems = [...(javaProblemsByTopic['basic-io-variables'] || [])];

  const mockProblem = {
    id: 'judge-test-01',
    slug: 'judge-test-slug',
    title: 'Sum of Two',
    categorySlug: 'basic-io-variables',
    difficulty: 'Easy',
    problemType: 'lugaish',
    sampleTestCases: [{ input: '2 3', expectedOutput: '5' }],
    hiddenTestCases: [{ input: '10 20', expectedOutput: '30' }]
  };

  registerProblem('basic-io-variables', mockProblem);

  const internalProb = getInternalProblemForJudging('basic-io-variables', 'judge-test-01');
  assert.ok(internalProb);
  assert.equal(internalProb.testCases.length, 2);
  assert.equal(internalProb.testCases[0].isSample, true);
  assert.equal(internalProb.testCases[0].expectedOutput, '5');
  assert.equal(internalProb.testCases[1].isSample, false);
  assert.equal(internalProb.testCases[1].expectedOutput, '30');

  // External problems must never be judged by internal judge
  assert.equal(getInternalProblemForJudging('basic-io-variables', 'ext-bio-01'), null);

  // Restore original problems so registry remains clean
  javaProblemsByTopic['basic-io-variables'] = originalProblems;
});

test('practice router handlers respond with expected data and validation errors', async () => {
  // Helper to simulate request to an express route handler
  function createMockRes() {
    const res = {
      statusCode: 200,
      headers: {},
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      set(key, val) {
        this.headers[key] = val;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      }
    };
    return res;
  }

  // Find layer for GET /java/topics
  const topicsLayer = practiceRoutes.stack.find(s => s.route?.path === '/java/topics');
  assert.ok(topicsLayer);
  const topicsReq = { method: 'GET', ip: '127.0.0.1' };
  const topicsRes = createMockRes();
  topicsLayer.route.stack[0].handle(topicsReq, topicsRes);
  assert.equal(topicsRes.statusCode, 200);
  assert.ok(topicsRes.body.topics.length >= 8);
  assert.equal(topicsRes.body.topics[0].slug, 'basic-io-variables');
  assert.equal(topicsRes.body.topics[1].slug, 'operators-expressions');
  assert.equal(topicsRes.body.topics[2].slug, 'conditional-statements');
  assert.equal(topicsRes.body.topics[3].slug, 'loops-iterations');
  assert.equal(topicsRes.body.topics[4].slug, 'nested-loops-pattern-printing');
  assert.equal(topicsRes.body.topics[5].slug, 'arrays');
  assert.equal(topicsRes.body.topics[6].slug, 'strings-manipulation');
  assert.equal(topicsRes.body.topics[7].slug, 'methods-functions');

  // Find layer for GET /java/topics/:topicSlug
  const topicSlugLayer = practiceRoutes.stack.find(s => s.route?.path === '/java/topics/:topicSlug');
  assert.ok(topicSlugLayer);
  const topicSlugReq = { method: 'GET', params: { topicSlug: 'basic-io-variables' }, ip: '127.0.0.1' };
  const topicSlugRes = createMockRes();
  topicSlugLayer.route.stack[0].handle(topicSlugReq, topicSlugRes);
  assert.equal(topicSlugRes.statusCode, 200);
  assert.equal(topicSlugRes.body.topic.title, 'Basic Input, Output & Variables');
  assert.ok(Array.isArray(topicSlugRes.body.problems));

  // Find layer for POST /java/run with empty source code
  const runLayer = practiceRoutes.stack.find(s => s.route?.path === '/java/run');
  assert.ok(runLayer);
  const runReq = { method: 'POST', body: { sourceCode: '' }, ip: '127.0.0.1' };
  const runRes = createMockRes();
  // Second handler in stack (after rate limiter)
  const runHandler = runLayer.route.stack[runLayer.route.stack.length - 1].handle;
  await runHandler(runReq, runRes);
  assert.equal(runRes.statusCode, 400);
  assert.equal(runRes.body.verdict, 'Compilation Error');

  // Find layer for POST /java/submit with missing problemId
  const submitLayer = practiceRoutes.stack.find(s => s.route?.path === '/java/submit');
  assert.ok(submitLayer);
  const submitReq = { method: 'POST', body: { sourceCode: 'public class Main {}' }, ip: '127.0.0.1' };
  const submitRes = createMockRes();
  const submitHandler = submitLayer.route.stack[submitLayer.route.stack.length - 1].handle;
  await submitHandler(submitReq, submitRes);
  assert.equal(submitRes.statusCode, 400);
});
