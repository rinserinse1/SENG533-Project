import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
  scenarios: {
    // Base load: ramp from 1 to 10 concurrent users
    base_load: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 }, // ramp up to 10 VUs over 30 seconds
        { duration: '1m', target: 10 },  // sustain 10 VUs for 1 minute
        { duration: '30s', target: 0 },  // ramp down to 0 VUs over 30 seconds
      ],
      gracefulRampDown: '10s',
    },
    // Medium load: 50 constant concurrent users
    medium_load: {
      executor: 'constant-vus',
      vus: 50,
      duration: '1m',
      startTime: '2m', // start after base_load scenario completes
    },
    // High load: 100 constant concurrent users
    high_load: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      startTime: '3m30s', // start after medium_load scenario completes
    },
  },
};

// Directly set the access token (used only for check verification)
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTFlYTRmNGQ0NTgwOGYyNjkyYTkyMCIsImlhdCI6MTc0Mjg1ODg0NSwiZXhwIjoxNzQyODYwNjQ1fQ.FJ_ukmchkQaYmu4cEBJ9sWW1ytHB9HlFG0_DoIejGZU';

export default function () {
  const url = 'http://localhost:5001/api/auth/login';

  // Login payload (replace with your test credentials)
  const payload = JSON.stringify({
    email: 'testacc@gmail.com',
    password: 'Loblob999',
  });

  // Headers for JSON payload
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send the login request
  const res = http.post(url, payload, params);

  // Validate login response
  check(res, {
    'Login status is 200 (good)': (r) => r.status === 200,
    'Access Token is present': () => accessToken !== undefined,
  });

  // Simulate some wait time between requests
  sleep(1);
}

export function handleSummary(data) {
  // Return summary as a JSON file and print a human-readable summary to stdout
  return {
    'summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
