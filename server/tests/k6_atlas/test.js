import http from 'k6/http';
import { check } from 'k6';
import { sleep, group } from 'k6';

// The number of virtual users to simulate
export let options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users in 1 minute
    { duration: '2m', target: 100 }, // Ramp up to 100 users in 2 minutes
    { duration: '3m', target: 1000 }, // Ramp up to 1000 users in 3 minutes
    { duration: '2m', target: 1000 }, // Hold 1000 users for 2 minutes
    { duration: '1m', target: 0 },  // Ramp down to 0 users in 1 minute
  ],
};

export default function () {
  // Define login credentials (replace with your actual login API endpoint and credentials)
  const url = 'https://your-app-url.com/api/login';
  const payload = JSON.stringify({
    email: 'user@example.com', // Replace with a test email
    password: 'password123',   // Replace with a test password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  group('Login Test', function () {
    // Send POST request to login API
    const res = http.post(url, payload, params);

    // Check if login was successful (status code 200)
    check(res, {
      'login successful': (r) => r.status === 200,
    });
  });

  // Wait for a short period to simulate realistic user behavior
  sleep(1);
}