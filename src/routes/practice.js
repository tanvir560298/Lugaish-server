import express from 'express';
import { createRateLimit } from '../middleware/rateLimit.js';
import { executeJavaCode, judgeJavaSubmission } from '../services/javaJudge.js';
import {
  getAllTopics,
  getTopicBySlug,
  getPublicProblemsByTopic,
  getPublicProblemBySlug,
  getInternalProblemForJudging
} from '../data/javaProblemsRegistry.js';

const router = express.Router();

// Rate limiters for Java execution to protect sandbox service and fair access
const runCodeLimiter = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30              // 30 runs per minute per IP
});

const submitLimiter = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20              // 20 submissions per minute per IP
});

/**
 * GET /api/practice/java/topics
 * Returns list of practice topics for Java (Topic 1: Basic Input, Output & Variables).
 */
router.get('/java/topics', (_req, res) => {
  try {
    const topics = getAllTopics();
    return res.json({ topics });
  } catch (err) {
    console.error('[Practice Route] Error fetching topics:', err);
    return res.status(500).json({ error: 'Failed to retrieve practice topics.' });
  }
});

/**
 * GET /api/practice/java/topics/:topicSlug
 * Returns metadata of the topic and all public problems belonging to it.
 */
router.get('/java/topics/:topicSlug', (req, res) => {
  try {
    const { topicSlug } = req.params;
    const topic = getTopicBySlug(topicSlug);
    if (!topic) {
      return res.status(404).json({ error: `Topic '${topicSlug}' not found.` });
    }

    const problems = getPublicProblemsByTopic(topicSlug);
    return res.json({ topic, problems });
  } catch (err) {
    console.error('[Practice Route] Error fetching topic problems:', err);
    return res.status(500).json({ error: 'Failed to retrieve problems for topic.' });
  }
});

/**
 * GET /api/practice/java/topics/:topicSlug/problems/:slug
 * Returns public problem details for solving.
 */
router.get('/java/topics/:topicSlug/problems/:slug', (req, res) => {
  try {
    const { topicSlug, slug } = req.params;
    const problem = getPublicProblemBySlug(topicSlug, slug);
    if (!problem) {
      return res.status(404).json({ error: `Problem '${slug}' not found under '${topicSlug}'.` });
    }
    return res.json({ problem });
  } catch (err) {
    console.error('[Practice Route] Error fetching problem:', err);
    return res.status(500).json({ error: 'Failed to retrieve problem details.' });
  }
});

/**
 * POST /api/practice/java/run
 * Compiles and runs Java code against custom input.
 * Does NOT judge against test cases or mark problem as solved.
 */
router.post('/java/run', runCodeLimiter, async (req, res) => {
  try {
    const { sourceCode, stdin = '', timeLimit, memoryLimit } = req.body || {};

    if (!sourceCode || typeof sourceCode !== 'string' || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        verdict: 'Compilation Error',
        compileOutput: 'Error: No Java source code provided.',
        stdout: '',
        stderr: ''
      });
    }

    const result = await executeJavaCode({
      sourceCode,
      stdin,
      timeLimit,
      memoryLimit
    });

    return res.json(result);
  } catch (err) {
    console.error('[Practice Route] Error executing Java code:', err);
    return res.status(500).json({
      success: false,
      verdict: 'Execution Service Unavailable',
      stderr: 'Failed to communicate with the Java execution environment.'
    });
  }
});

/**
 * POST /api/practice/java/submit
 * Compiles and judges Java code against all official test cases (sample + hidden).
 * Returns official verdict.
 */
router.post('/api/practice/java/submit', submitLimiter, async (req, res) => {
  try {
    const { topicSlug = 'basic-io-variables', problemId, sourceCode } = req.body || {};

    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required.' });
    }
    if (!sourceCode || typeof sourceCode !== 'string' || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        verdict: 'Compilation Error',
        compileOutput: 'Error: No Java source code provided.'
      });
    }

    const internalProblem = getInternalProblemForJudging(topicSlug, problemId);
    if (!internalProblem) {
      return res.status(404).json({ error: `Problem with ID '${problemId}' not found.` });
    }

    const result = await judgeJavaSubmission({
      problem: internalProblem,
      sourceCode
    });

    return res.json(result);
  } catch (err) {
    console.error('[Practice Route] Error judging Java submission:', err);
    return res.status(500).json({
      success: false,
      verdict: 'Execution Service Unavailable',
      message: 'Failed to process submission. Please retry shortly.'
    });
  }
});

// Also support submit without prefix if mounted under /api/practice
router.post('/java/submit', submitLimiter, async (req, res) => {
  try {
    const { topicSlug = 'basic-io-variables', problemId, sourceCode } = req.body || {};

    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required.' });
    }
    if (!sourceCode || typeof sourceCode !== 'string' || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        verdict: 'Compilation Error',
        compileOutput: 'Error: No Java source code provided.'
      });
    }

    const internalProblem = getInternalProblemForJudging(topicSlug, problemId);
    if (!internalProblem) {
      return res.status(404).json({ error: `Problem with ID '${problemId}' not found.` });
    }

    const result = await judgeJavaSubmission({
      problem: internalProblem,
      sourceCode
    });

    return res.json(result);
  } catch (err) {
    console.error('[Practice Route] Error judging Java submission:', err);
    return res.status(500).json({
      success: false,
      verdict: 'Execution Service Unavailable',
      message: 'Failed to process submission. Please retry shortly.'
    });
  }
});

export default router;

