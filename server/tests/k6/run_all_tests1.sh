#!/usr/bin/env bash
set -x  # prints each command as it's executed for debugging

BASE_URL="http://localhost:5001"
echo "Using BASE_URL=$BASE_URL"

# Create a directory for JSON results
mkdir -p results

# -------------------------------
# Run Trending Tests First
# -------------------------------
PAGES=("1" "2")
CONCURRENCIES=("1" "10" "100")

for page in "${PAGES[@]}"; do
  for vus in "${CONCURRENCIES[@]}"; do
    
    echo "======================================================"
    echo " Running TRENDING test for page=$page, VUs=$vus"
    echo "======================================================"

    outFile="results/trending_page${page}_vus${vus}.json"

    k6 run test1.js \
      -e BASE_URL="$BASE_URL" \
      -e ENDPOINT="trending" \
      -e PAGE_NUMBER="$page" \
      --vus "$vus" \
      --duration "30s"\
      --summary-export "$outFile"

    sleep 2

  done
done

# -------------------------------
# Then Run Search Tests
# -------------------------------
QUERIES=("batman" "spiderman" "superman")

for query in "${QUERIES[@]}"; do
  for page in "${PAGES[@]}"; do
    for vus in "${CONCURRENCIES[@]}"; do
      
      echo "======================================================"
      echo " Running SEARCH test for query=$query, page=$page, VUs=$vus"
      echo "======================================================"

      outFile="results/${query}_page${page}_vus${vus}.json"

      k6 run test1.js \
        -e BASE_URL="$BASE_URL" \
        -e ENDPOINT="search" \
        -e QUERY="$query" \
        -e PAGE_NUMBER="$page" \
        --vus "$vus" \
        --duration "30s"\
        --summary-export "$outFile"

      sleep 2

    done
  done
done