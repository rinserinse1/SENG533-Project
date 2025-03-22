import http from 'k6/http';
import { sleep, check } from 'k6';

// Options for staging, concurrency, etc.
export const options = {
  vus: 1,
  duration: '10s',
};

// Normal test flow
export default function () {
  let res = http.get('https://test.k6.io');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

// handleSummary is called automatically at the end of the test
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
