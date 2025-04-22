#!/usr/bin/env python3
import glob
import json
import os
from tabulate import tabulate

# Folder where k6 summary files are stored (relative to this script)
results_dir = "results"

# List all JSON files, but exclude those containing "trending" in the filename
all_files = glob.glob(os.path.join(results_dir, "*.json"))
files = [f for f in all_files if "trending" not in os.path.basename(f)]

if not files:
    print(f"No search results files found in '{results_dir}' (excluding 'trending' files).")
    exit(1)

aggregated = []
total_http_reqs = 0
weighted_duration_sum = 0.0
total_iterations = 0

for filepath in files:
    with open(filepath, "r") as f:
        data = json.load(f)
    test_name = os.path.splitext(os.path.basename(filepath))[0]
    metrics = data.get("metrics", {})
    
    http_reqs = metrics.get("http_reqs", {}).get("count", 0)
    avg_duration = metrics.get("http_req_duration", {}).get("avg", 0)
    check_rate = metrics.get("checks", {}).get("value", 0)
    iterations = metrics.get("iterations", {}).get("count", 0)
    
    aggregated.append({
        "Test": test_name,
        "HTTP Req Count": http_reqs,
        "Avg Duration (ms)": round(avg_duration, 2),
        "Check Rate": check_rate,
        "Iterations": iterations
    })
    
    # For an overall weighted average duration across all runs:
    total_http_reqs += http_reqs
    weighted_duration_sum += avg_duration * http_reqs
    total_iterations += iterations

overall_avg_duration = weighted_duration_sum / total_http_reqs if total_http_reqs else 0

final_summary = {
    "total_files": len(files),
    "total_http_reqs": total_http_reqs,
    "total_iterations": total_iterations,
    "overall_avg_duration_ms": round(overall_avg_duration, 2),
    "individual_results": aggregated
}

# Print a table summary to the console
print(tabulate(aggregated, headers="keys", tablefmt="grid"))

# Print overall summary as JSON
print("\nOverall Aggregated Search Summary:")
print(json.dumps(final_summary, indent=2))

# Write final aggregated summary to file
final_summary_file = os.path.join(results_dir, "final_search_summary.json")
with open(final_summary_file, "w") as outfile:
    json.dump(final_summary, outfile, indent=2)

print(f"\nFinal search aggregated summary written to {final_summary_file}")
