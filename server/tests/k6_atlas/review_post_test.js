/*import http from 'k6/http';
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

// Replace with a valid access token
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTFlYTRmNGQ0NTgwOGYyNjkyYTkyMCIsImlhdCI6MTc0Mjg3NTA0MiwiZXhwIjoxNzQyODc2ODQyfQ.2_h3hsqtmlU11HNp17PBgH3X24BZ5so7yyA9cJcb_gk';

export default function () {
  const url = 'http://localhost:5001/api/makereview'; // Your review endpoint

  // Payload for making a review (replace movieID and other fields as needed)
  const payload = JSON.stringify({
    movieID: '12345',
    description: 'Amazing movie! The plot twist blew my mind.',
    stars: 5,
  });

  // Headers for authorization and JSON payload
  const params = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  // Send the review request
  const res = http.post(url, payload, params);

  // Validate the response
  check(res, {
    'Review status is 200': (r) => r.status === 200,
    'Response is not empty': (r) => r.body.length > 0,
  });

  // Simulate wait time between requests
  sleep(1);
}

// Handle the test summary output
export function handleSummary(data) {
  return {
    'review-summary.json': JSON.stringify(data, null, 2), // Save as JSON
    stdout: textSummary(data, { indent: ' ', enableColors: true }), // Console summary
  };
}*/

import http from 'k6/http';
import { check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
  vus: 1, // 1 virtual user
  iterations: 1, // Only 1 iteration
};

// Replace with a valid access token
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTFlYTRmNGQ0NTgwOGYyNjkyYTkyMCIsImlhdCI6MTc0Mjg3Njg2OCwiZXhwIjoxNzQyODc4NjY4fQ.oeaBT9knThCvibAS_B104IQb42uhNWRRs2njD5s5eIA';

export default function () {
  const url = 'http://localhost:5001/api/review/makereview'; // Your review endpoint

  // Payload for making a review (replace movieID and other fields as needed)
  const payload = JSON.stringify({
    movieID: '12345',
    description: 'Amazing movie! The plot twist blew my mind.',
    stars: 5,
  });

  // Headers for authorization and JSON payload
  const params = {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  // Send the review request
  const res = http.post(url, payload, params);

  // Validate the response
  check(res, {
    'Review status is 200': (r) => r.status === 200,
    'Response is not empty': (r) => r.body.length > 0,
  });

  console.log('Response:', res.body);
}

// Handle the test summary output
/*export function handleSummary(data) {
  return {
    'review-summary.json': JSON.stringify(data, null, 2), // Save as JSON
    stdout: textSummary(data, { indent: ' ', enableColors: true }), // Console summary
  };
}*/