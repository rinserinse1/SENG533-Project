import http from 'k6/http';
import { sleep, check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
  scenarios: {
    // Page 1 – Base load (0 → 1.5 m)
    base_load_page1: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0  },
      ],
      gracefulRampDown: '10s',
      tags: { page: '1' },
    },

    // Page 2 – Base load (starts at 2 m)
    base_load_page2: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0  },
      ],
      gracefulRampDown: '10s',
      startTime: '2m',
      tags: { page: '2' },
    },

    // Page 1 – Medium load (starts at 4 m)
    medium_load_page1: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      startTime: '4m',
      tags: { page: '1' },
    },
    // Page 2 – Medium load (starts at 5 m)
    medium_load_page2: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      startTime: '5m',
      tags: { page: '2' },
    },

    // Page 1 – High load (starts at 6 m)
    high_load_page1: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      startTime: '6m',
      tags: { page: '1' },
    },
    // Page 2 – High load (starts at 7 m)
    high_load_page2: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      startTime: '7m',
      tags: { page: '2' },
    },

    // Page 1 – Very high load (starts at 8 m)
    very_high_load_page1: {
      executor: 'constant-vus',
      vus: 200,
      duration: '1m',
      startTime: '8m',
      tags: { page: '1' },
    },
    // Page 2 – Very high load (starts at 9 m)
    very_high_load_page2: {
      executor: 'constant-vus',
      vus: 200,
      duration: '1m',
      startTime: '9m',
      tags: { page: '2' },
    },
  },
};

export function setup() {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';

  // if you already have a token in env, use it
  if (__ENV.ACCESS_TOKEN) {
    console.log('Using provided ACCESS_TOKEN');
    return { token: __ENV.ACCESS_TOKEN };
  }

  // otherwise, log in to get one
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: __ENV.LOGIN_EMAIL  || 'testacc@gmail.com',
      password: __ENV.LOGIN_PASSWORD || 'Loblob999',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(loginRes, { 'login status 200': (r) => r.status === 200 });
  const token = loginRes.json().accessToken;
  console.log('Obtained token in setup:', token);
  return { token };
}

export default function (data) {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';

  const res = http.post(
    `${BASE_URL}/api/review/makereviewfaster`,
    JSON.stringify({
      movieID:     '950387',
      description: 'Lava Chicken!',
      stars:       5,
    }),
    {
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${data.token}`,
      },
    }
  );
  check(res, { 'addReview returned 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  const table = [];

  for (const [scenarioName, sc] of Object.entries(data.scenarios)) {
    const vusMetric = sc.vus_max;
    const reqsMetric = data.metrics[`http_reqs{scenario:${scenarioName}}`].count;
    const durMetric  = Number(data.metrics[`http_req_duration{scenario:${scenarioName}}`].avg.toFixed(2));
    const chkMetric  = Number(data.metrics[`checks{scenario:${scenarioName}}`].rate.toFixed(2));
    const pageNum    = Number(sc.tags.page);

    table.push({
      'Virtual Users':                vusMetric,
      'HTTP Req Count (Iteration)':   reqsMetric,
      'Avg Duration (ms)':            durMetric,
      'Check Rate (Success Rate)':    chkMetric,
      'Page Number':                  pageNum,
    });
  }

  return {
    'review-summary.json': JSON.stringify(table, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
