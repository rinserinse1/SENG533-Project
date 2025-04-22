import http from 'k6/http';
import { sleep, check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Options for staging, concurrency, etc.
export const options = {
  vus: __ENV.VUS ? parseInt(__ENV.VUS) : 1,
  duration: __ENV.DURATION || '10s',
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';
  const ENDPOINT = __ENV.ENDPOINT || 'search'; // default to search
  const QUERY = __ENV.QUERY || 'batman';
  const PAGE_NUMBER = __ENV.PAGE_NUMBER || '1';
  
  let res;
  switch (ENDPOINT) {
    case 'search':
      res = http.get(`${BASE_URL}/api/movie/search?query=${QUERY}&pageNumber=${PAGE_NUMBER}`);
      check(res, { 'search returned 200': (r) => r.status === 200 });
      break;

    case 'trending':
      res = http.get(`${BASE_URL}/api/movie/trending?page=${PAGE_NUMBER}`);
      check(res, { 'trending returned 200': (r) => r.status === 200 });
      break;
    
  }
  sleep(1);
}

// handleSummary is called automatically at the end of the test
export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}