

#!/usr/bin/env bash
set -x

BASE_URL="http://localhost:5001"
mkdir -p results

echo "Running Search Tests..."
# Search test: iterate over queries, pages, and concurrency levels
QUERIES=("batman" "spiderman" "superman")
PAGES=("1" "2")
CONCURRENCIES=("1" "10")
for query in "${QUERIES[@]}"; do
  for page in "${PAGES[@]}"; do
    for vus in "${CONCURRENCIES[@]}"; do
      k6 run test.js \
        -e BASE_URL="$BASE_URL" \
        -e ENDPOINT="search" \
        -e QUERY="$query" \
        -e PAGE_NUMBER="$page" \
        -e VUS="$vus"
      sleep 1
    done
  done
done

echo "Running Trending Tests..."
# Trending test: iterate over pages and VU counts
for page in "${PAGES[@]}"; do
  for vus in "${CONCURRENCIES[@]}"; do
    k6 run test.js \
      -e BASE_URL="$BASE_URL" \
      -e ENDPOINT="trending" \
      -e PAGE_NUMBER="$page" \
      -e VUS="$vus"
    sleep 1
  done
done

echo "Running Register Tests..."
# Register test: iterate over different VU counts
for vus in "${CONCURRENCIES[@]}"; do
  k6 run test.js \
    -e BASE_URL="$BASE_URL" \
    -e ENDPOINT="register" \
    -e VUS="$vus"
  sleep 1
done

echo "Running Login Tests..."
# Login test: iterate over different VU counts (requires an existing user)
for vus in "${CONCURRENCIES[@]}"; do
  k6 run test.js \
    -e BASE_URL="$BASE_URL" \
    -e ENDPOINT="login" \
    -e LOGIN_EMAIL="test@test.com" \
    -e LOGIN_PASSWORD="Password123" \
    -e VUS="$vus"
  sleep 1
done

# To run addReview and watchlist tests, an ACCESS_TOKEN must be provided
if [[ -n "$ACCESS_TOKEN" ]]; then
  echo "Running addReview Test..."
  k6 run test.js \
    -e BASE_URL="$BASE_URL" \
    -e ENDPOINT="addReview" \
    -e ACCESS_TOKEN="$ACCESS_TOKEN" \
    -e VUS="5"
  
  echo "Running Watchlist Test..."
  k6 run test.js \
    -e BASE_URL="$BASE_URL" \
    -e ENDPOINT="watchlist" \
    -e ACCESS_TOKEN="$ACCESS_TOKEN" \
    -e VUS="5"
fi
