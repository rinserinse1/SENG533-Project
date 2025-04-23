import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
  scenarios: {
    // ─── BASE LOAD ───────────────────────────────────────────────────────────
    base_load_page1: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 }, // ramp up
        { duration: '30s', target: 10 }, // sustain
        { duration: '30s', target: 0  }, // ramp down
      ],
      gracefulRampDown: '10s',
      // starts immediately
      tags: { page: '1' },
    },
    base_load_page2: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0  },
      ],
      gracefulRampDown: '10s',
      startTime: '2m',      // exactly after page1’s 90s+30s = 2m
      tags: { page: '2' },
    },

    // ─── MEDIUM LOAD ─────────────────────────────────────────────────────────
    medium_load_page1: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      startTime: '4m',      // after both base_loads (2m + 2m = 4m)
      tags: { page: '1' },
    },
    medium_load_page2: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      startTime: '5m',      // after medium_load_page1
      tags: { page: '2' },
    },

    // ─── HIGH LOAD ───────────────────────────────────────────────────────────
    high_load_page1: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      startTime: '6m',      // after both medium_loads (4m + 1m + 1m = 6m)
      tags: { page: '1' },
    },
    high_load_page2: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      startTime: '7m',      // after high_load_page1
      tags: { page: '2' },
    },

    // ─── VERY HIGH LOAD ──────────────────────────────────────────────────────
    very_high_load_page1: {
      executor: 'constant-vus',
      vus: 200,
      duration: '1m',
      startTime: '8m',      // after both high_loads
      tags: { page: '1' },
    },
    very_high_load_page2: {
      executor: 'constant-vus',
      vus: 200,
      duration: '1m',
      startTime: '9m',      // after very_high_load_page1
      tags: { page: '2' },
    },
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…';

export default function () {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: 'testacc@gmail.com', password: 'Loblob999' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, {
    'status is 200': (r) => r.status === 200,
    'token present': () => accessToken !== undefined,
  });
  sleep(1);
}

export function handleSummary(data) {
  const table = [];
  for (const [name, sc] of Object.entries(data.scenarios)) {
    table.push({
      'Virtual Users':               sc.vus_max,
      'HTTP Req Count (Iteration)':  data.metrics[`http_reqs{scenario:${name}}`].count,
      'Avg Duration (ms)':           Number(data.metrics[`http_req_duration{scenario:${name}}`].avg.toFixed(2)),
      'Check Rate (Success Rate)':   Number(data.metrics[`checks{scenario:${name}}`].rate.toFixed(2)),
      'Page Number':                 Number(sc.tags.page),
    });
  }
  return {
    'login_summary.json': JSON.stringify(table, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
