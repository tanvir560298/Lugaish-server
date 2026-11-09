// Java Real Code Execution & Judging Service for Lugaish
// Sandboxed execution via Judge0-compatible API (https://ce.judge0.com or custom instance)

const JUDGE0_BASE_URL = (process.env.JUDGE0_API_URL || 'https://ce.judge0.com').replace(/\/$/, '');
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || '';
const JAVA_LANGUAGE_ID = Number(process.env.JAVA_LANGUAGE_ID || 62); // 62 = Java (OpenJDK 13/14)
const DEFAULT_TIMEOUT_SECONDS = 3;
const DEFAULT_MEMORY_LIMIT_KB = 128000;
const MAX_SOURCE_CODE_BYTES = 64 * 1024; // 64 KB
const MAX_STDIN_BYTES = 64 * 1024; // 64 KB

/**
 * Normalizes output string for whitespace-insensitive judging:
 * - Replaces CRLF (\r\n) and CR (\r) with LF (\n)
 * - Trims trailing whitespace from each line
 * - Trims leading/trailing empty lines
 */
export function normalizeOutput(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Executes a Java source code snippet against optional stdin using sandboxed Judge0.
 * Never mark problem as solved in this function; strictly executes and returns output.
 */
export async function executeJavaCode({
  sourceCode,
  stdin = '',
  timeLimit = DEFAULT_TIMEOUT_SECONDS,
  memoryLimit = DEFAULT_MEMORY_LIMIT_KB
}) {
  if (!sourceCode || typeof sourceCode !== 'string') {
    return {
      success: false,
      verdict: 'Compilation Error',
      stdout: '',
      stderr: 'No Java source code provided.',
      compileOutput: 'Error: No source code provided.',
      time: 0,
      memory: 0
    };
  }

  if (Buffer.byteLength(sourceCode, 'utf8') > MAX_SOURCE_CODE_BYTES) {
    return {
      success: false,
      verdict: 'Compilation Error',
      stdout: '',
      stderr: 'Source code exceeds maximum allowed size (64KB).',
      compileOutput: 'Error: Source code too large.',
      time: 0,
      memory: 0
    };
  }

  const safeStdin = typeof stdin === 'string'
    ? stdin.slice(0, MAX_STDIN_BYTES)
    : '';

  const headers = {
    'Content-Type': 'application/json'
  };

  if (JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
    headers['X-Auth-Token'] = JUDGE0_API_KEY;
  }
  if (JUDGE0_API_HOST) {
    headers['X-RapidAPI-Host'] = JUDGE0_API_HOST;
  }

  const payload = {
    source_code: sourceCode,
    language_id: JAVA_LANGUAGE_ID,
    stdin: safeStdin,
    cpu_time_limit: Math.min(Math.max(Number(timeLimit) || DEFAULT_TIMEOUT_SECONDS, 1), 10),
    memory_limit: Math.min(Math.max(Number(memoryLimit) || DEFAULT_MEMORY_LIMIT_KB, 16000), 256000)
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), (payload.cpu_time_limit + 10) * 1000);

    const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(`[JavaJudge] Execution service responded with HTTP ${response.status}:`, errText);
      return {
        success: false,
        verdict: 'Execution Service Unavailable',
        stdout: '',
        stderr: 'Execution service responded with error. Please try again in a few moments.',
        compileOutput: '',
        time: 0,
        memory: 0
      };
    }

    const data = await response.json();
    const statusId = data?.status?.id ?? 0;
    const statusDesc = data?.status?.description ?? 'Unknown';

    // Map Judge0 status IDs:
    // 3: Accepted
    // 4: Wrong Answer
    // 5: Time Limit Exceeded
    // 6: Compilation Error
    // 7-12: Runtime Error (SIGSEGV, SIGXFSZ, SIGFPE, SIGABRT, NZEC, Other)
    // 13: Internal Error
    // 14: Exec Format Error
    let verdict = 'Accepted';
    if (statusId === 3) {
      verdict = 'Accepted';
    } else if (statusId === 4) {
      verdict = 'Wrong Answer';
    } else if (statusId === 5) {
      verdict = 'Time Limit Exceeded';
    } else if (statusId === 6) {
      verdict = 'Compilation Error';
    } else if (statusId >= 7 && statusId <= 12) {
      verdict = 'Runtime Error';
    } else if (statusId >= 13) {
      verdict = 'Execution Service Unavailable';
    } else {
      verdict = statusDesc;
    }

    return {
      success: verdict === 'Accepted',
      verdict,
      statusId,
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      compileOutput: data.compile_output || '',
      message: data.message || '',
      time: parseFloat(data.time) || 0,
      memory: parseInt(data.memory, 10) || 0
    };
  } catch (error) {
    console.error('[JavaJudge] Execution failed with exception:', error?.message || error);
    if (error?.name === 'AbortError') {
      return {
        success: false,
        verdict: 'Time Limit Exceeded',
        stdout: '',
        stderr: 'Execution timed out.',
        compileOutput: '',
        time: payload.cpu_time_limit,
        memory: 0
      };
    }
    return {
      success: false,
      verdict: 'Execution Service Unavailable',
      stdout: '',
      stderr: 'Could not connect to the sandboxed execution environment. Please retry shortly.',
      compileOutput: '',
      time: 0,
      memory: 0
    };
  }
}

/**
 * Judges a student's solution against all official test cases for a problem.
 * Private hidden test cases are strictly verified server-side.
 */
export async function judgeJavaSubmission({
  problem,
  sourceCode
}) {
  if (!problem || !Array.isArray(problem.testCases) || problem.testCases.length === 0) {
    return {
      success: false,
      verdict: 'Execution Service Unavailable',
      testCasesPassed: 0,
      totalTestCases: 0,
      message: 'Problem test cases are not configured.'
    };
  }

  const allTestCases = problem.testCases;
  let maxTime = 0;
  let maxMemory = 0;

  for (let i = 0; i < allTestCases.length; i++) {
    const tc = allTestCases[i];
    const execResult = await executeJavaCode({
      sourceCode,
      stdin: tc.input || '',
      timeLimit: problem.timeLimit || DEFAULT_TIMEOUT_SECONDS,
      memoryLimit: problem.memoryLimit || DEFAULT_MEMORY_LIMIT_KB
    });

    maxTime = Math.max(maxTime, execResult.time || 0);
    maxMemory = Math.max(maxMemory, execResult.memory || 0);

    // If compilation error, runtime error, timeout, or service error, fail immediately
    if (execResult.verdict !== 'Accepted') {
      return {
        success: false,
        verdict: execResult.verdict,
        testCasesPassed: i,
        totalTestCases: allTestCases.length,
        failedTestCaseIndex: i + 1,
        isSampleTestCase: Boolean(tc.isSample),
        stdout: execResult.stdout,
        stderr: execResult.stderr,
        compileOutput: execResult.compileOutput,
        time: maxTime,
        memory: maxMemory
      };
    }

    // Compare normalized output
    const actual = normalizeOutput(execResult.stdout);
    const expected = normalizeOutput(tc.expectedOutput);

    if (actual !== expected) {
      return {
        success: false,
        verdict: 'Wrong Answer',
        testCasesPassed: i,
        totalTestCases: allTestCases.length,
        failedTestCaseIndex: i + 1,
        isSampleTestCase: Boolean(tc.isSample),
        // Expose actual output only for sample test cases; hidden test case details stay hidden
        actualOutput: tc.isSample ? execResult.stdout : undefined,
        expectedOutput: tc.isSample ? tc.expectedOutput : undefined,
        input: tc.isSample ? tc.input : undefined,
        time: maxTime,
        memory: maxMemory
      };
    }
  }

  // All test cases passed!
  return {
    success: true,
    verdict: 'Accepted',
    testCasesPassed: allTestCases.length,
    totalTestCases: allTestCases.length,
    time: maxTime,
    memory: maxMemory
  };
}

