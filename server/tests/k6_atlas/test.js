import http from 'k6/http';
import { check, sleep } from 'k6';

// Directly set the access token
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
    // data contains all end-of-test metrics
    // We can return an object mapping file names to their contents
  
    return {
      // Save a JSON with only the summary data
      'summary.json': JSON.stringify(data, null, 2),
  
      // Also produce a nice human-readable summary on the console
      stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
  }
  
  // We need this import at the bottom if we want the "textSummary" helper
  import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
  