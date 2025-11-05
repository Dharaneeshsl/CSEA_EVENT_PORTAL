// Simple Judge0 client (CE free endpoint)
// Docs: https://ce.judge0.com/

const JUDGE0_BASE_URL = 'https://ce.judge0.com';

// Map language label to Judge0 language_id
// Ref: https://ce.judge0.com/languages
const LANGUAGE_IDS = {
  python: 71, // Python (3.8.1)
  c: 50 // C (GCC 9.2.0)
};

export async function submitCode({ source, language }) {
  const languageId = LANGUAGE_IDS[language.toLowerCase()];
  if (!languageId) throw new Error('Unsupported language for Judge0');

  const res = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: source,
      language_id: languageId,
      stdin: '',
      redirect_stderr_to_stdout: true
    })
  });
  if (!res.ok) throw new Error('Failed to submit code');
  const data = await res.json();
  return data.token;
}

export async function getResult(token) {
  const res = await fetch(`${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=false`);
  if (!res.ok) throw new Error('Failed to get result');
  const data = await res.json();
  return data;
}

export async function waitForResult(token, { timeoutMs = 15000, intervalMs = 800 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const data = await getResult(token);
    // status: { id, description }
    if (data.status && data.status.id >= 3) return data; // done
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error('Judge0 execution timed out');
}

// Run code and return stdout/stderr/compile info
export async function runCode({ source, language }) {
  const token = await submitCode({ source, language });
  const result = await waitForResult(token);
  return result; // contains stdout, stderr, compile_output, status
}


