import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const url = 'http://localhost:5000/api/auth/login';

  // Login payload (replace with your test credentials)
  const payload = JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  });

  // Headers for JSON payload
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send the login request
  const res = http.post(url, payload, params);

  // Validate response
  check(res, {
    'Login status is 200': (r) => r.status === 200,
    'Access Token is present': (r) => JSON.parse(r.body).accessToken !== undefined,
  });

  // Optional: log the access token for debugging
  const accessToken = JSON.parse(res.body).accessToken;
  console.log('Access Token:', accessToken);

  // Simulate some wait time between requests
  sleep(1);
}