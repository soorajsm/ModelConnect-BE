import './config/env.js';
import { spawn } from 'child_process';

const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('.', import.meta.url).pathname,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: process.env.PORT || '5050' },
});

function waitForReady() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server did not start in time')), 30000);
    const onData = (chunk) => {
      const text = String(chunk);
      if (text.includes('Server listening on')) {
        clearTimeout(timer);
        resolve(undefined);
      }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    server.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Server exited early with code ${code}`));
    });
  });
}

async function run() {
  try {
    await waitForReady();
    const port = process.env.PORT || '5050';
    const base = `http://127.0.0.1:${port}/api`;

    const health = await fetch(`${base}/health`).then((r) => r.json());
    const login = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@modelconnect.com', password: 'password123' }),
    }).then((r) => r.json());

    if (!health.ok || !login.token) throw new Error('Verification failed');
    console.log('Verification passed');
    console.log(JSON.stringify({ health, user: login.user }, null, 2));
  } finally {
    server.kill('SIGTERM');
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
