import http from 'k6/http';
import { sleep, check } from 'k6';


// const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';
// const ENDPOINT = __ENV.ENDPOINT || 'search'; // default to search
// const QUERY = __ENV.QUERY || 'batman';
// const PAGE_NUMBER = __ENV.PAGE_NUMBER || '1';

export const options = {
  vus: parseInt(__ENV.VUS) || 1,
  duration: '30s',
};

export function setup() {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';
  // If ACCESS_TOKEN is already provided, use that
  if (__ENV.ACCESS_TOKEN) {
    console.log("Using provided ACCESS_TOKEN:", __ENV.ACCESS_TOKEN);
    return { token: __ENV.ACCESS_TOKEN };
  }

  const loginPayload = JSON.stringify({
    email: __ENV.LOGIN_EMAIL || 'test@test.com',
    password: __ENV.LOGIN_PASSWORD || 'Password123'
  });

  let res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'login returned 200': (r) => r.status === 200 });
  const token = res.json().accessToken;
  console.log("Setup login token:", token);
  return { token: token };
}

export default function(data) {
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

    case 'register':
      // Helper function to generate a random string of letters
      function getRandomLetters(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }
      
      // Generate a name with letters and a space (e.g., "User AbCdEf")
      const name = `User ${getRandomLetters(6)}`;
      // Generate an email (e.g., "userABCdef@test.com")
      const email = `user${getRandomLetters(6)}@test.com`;
      
      const registerPayload = JSON.stringify({
        name: name,
        email: email,
        password: 'Password123'
      });
      
      console.log("Name:", name);
      console.log("Email:", email);
      
      res = http.post(`${BASE_URL}/api/auth/register`, registerPayload, {
        headers: { 'Content-Type': 'application/json' }
      });
      check(res, { 'register returned 200': (r) => r.status === 200 });
      break;


    case 'login':
      const loginPayload = JSON.stringify({
        email: __ENV.LOGIN_EMAIL || 'test@test.com',
        password: __ENV.LOGIN_PASSWORD || 'Password123'
      });
      res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' }
      });
      check(res, { 'login returned 200': (r) => r.status === 200 });
      break;

    case 'addReview':
      // console.log("Access token for addReview:", data.token);
      const reviewPayload = JSON.stringify({
        movieID: '603692', // change this to a valid TMDB ID if needed
        description: 'Great movie!',
        stars: 4
      });
      res = http.post(`${BASE_URL}/api/review/makereview`, reviewPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`
        }
      });
      console.log("addReview response:", res.status, res.body);
      check(res, { 'review returned 200': (r) => r.status === 200 });
      break;


    case 'deleteReview':
      // Delete the review we added using the movieID
      const deletePayload = JSON.stringify({
        movieID: '603692'
      });
      res = http.post(`${BASE_URL}/api/review/deletereview`, deletePayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`
        }
      });
      console.log("deleteReview response:", res.status, res.body);
      check(res, { 'deleteReview returned 200': (r) => r.status === 200 });
      break;

    case 'watchlist':
      // Construct a payload that matches the UserSchema watchlist subdocument
      const wlPayload = JSON.stringify({
        movieID: 603692,  // numeric movieID (ensure it's valid)
        title: "John Wick: Chapter 4", 
        description: "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
        image: "https://image.tmdb.org/t/p/w500//vZloFAK7NmvMGKE7VkF5UHaz0I.jpg"
      });
      res = http.post(`${BASE_URL}/api/watchlist/addwatchlist`, wlPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`  // token obtained from setup()
        }
      });
      check(res, { 'watchlist returned 200': (r) => r.status === 200 });
      break;

    case 'getWatchlist':
      // New GET test to retrieve the user's watchlist.
      res = http.get(`${BASE_URL}/api/watchlist/getwatchlist`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`
        }
      });
      console.log("getWatchlist response:", res.status, res.body);
      check(res, { 'getWatchlist returned 200': (r) => r.status === 200 });
      break;

    default:
      console.error(`Unknown endpoint: ${ENDPOINT}`);
  }
  sleep(1);
}

export function handleSummary(data) {
  const name = `${__ENV.ENDPOINT || 'na'}_${__ENV.QUERY || 'na'}_${__ENV.PAGE_NUMBER || 'na'}_${options.vus}vus.json`;
  return {
    [`results/${name}`]: JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}


import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';