import http from 'k6/http';
import { sleep, check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
  scenarios: {
    // Base load: ramp from 1 to 10 concurrent users
    base_load: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 }, // ramp up to 10 VUs over 30 seconds
        { duration: '30s', target: 10 },  // sustain 10 VUs for 1 minute
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
export function setup() {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';
  // Use provided token if available
  if (__ENV.ACCESS_TOKEN) {
    console.log("Using provided ACCESS_TOKEN:", __ENV.ACCESS_TOKEN);
    return { token: __ENV.ACCESS_TOKEN };
  }
  // Login to obtain token
  const loginPayload = JSON.stringify({
    email: __ENV.LOGIN_EMAIL || 'testacc@gmail.com',
    password: __ENV.LOGIN_PASSWORD || 'Loblob999'
  });
  const res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'login returned 200': (r) => r.status === 200 });
  const token = res.json().accessToken;
  console.log("Setup login token:", token);
  return { token: token };
}

export default function(data) {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';
  // addReview endpoint for movieID 822119
  const reviewPayload = JSON.stringify({
    movieID: '822119',
    description: 'Great movie!',
    stars: 4
  });
  const res = http.post(`${BASE_URL}/api/review/makereviewfaster`, reviewPayload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`
    }
  });
  check(res, { 'addReview returned 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'review-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
