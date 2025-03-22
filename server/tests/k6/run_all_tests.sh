#!/usr/bin/env bash
set -x  # prints each command as it's executed for debugging

BASE_URL="http://localhost:5001"
echo "Using BASE_URL=$BASE_URL"

# Your loop or calls to k6
k6 run test.js -e BASE_URL="$BASE_URL"

# Arrays of test parameters
QUERIES=("batman" "spiderman" "superman")
PAGES=("1" "2")
CONCURRENCIES=("1" "10")

# We'll assume the server is on port 5001
BASE_URL="http://localhost:5001"

# Create a directory for JSON results
mkdir -p results

for query in "${QUERIES[@]}"; do
  for page in "${PAGES[@]}"; do
    for vus in "${CONCURRENCIES[@]}"; do
      
      echo "======================================================"
      echo " Running test for query=$query, page=$page, VUs=$vus"
      echo "======================================================"

      # Construct an output file name that describes the scenario
      outFile="results/${query}_page${page}_vus${vus}.json"

      # Run k6, passing environment variables
      k6 run test.js \
      
        -e BASE_URL="$BASE_URL" \
        -e QUERY="$query" \
        -e PAGE_NUMBER="$page" \
        --vus "$vus" \
        --duration "30s"

      # Sleep briefly to let the server catch its breath (optional)
      sleep 2

    done
  done
done
