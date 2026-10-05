#!/bin/bash

# Linux Server Monitoring Script

echo "===== Linux Server Health ====="
echo "Hostname: $(hostname)"
echo "Checked at: $(date)"
echo "Uptime: $(uptime -p)"
echo "Total processes: $(ps -e --no-headers | wc -l)"

memory_usage=$(free | awk '/Mem:/ {printf "%.0f", ($2 - $7) / $2 * 100}')
echo "Memory usage: ${memory_usage}%"

disk_usage=$(df -P / | awk 'NR==2 {gsub("%", "", $5); print $5}')
echo "Root disk usage: ${disk_usage}%"

cpu_usage=$(top -bn1 | awk -F'[, ]+' '/Cpu\(s\)/ {for (i=1; i<=NF; i++) if ($i=="id") {printf "%.0f", 100-$(i-1); exit}}')
echo "CPU usage: ${cpu_usage}%"

echo ""
echo "Top 5 CPU-consuming processes:"
ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head -n 6

CPU_THRESHOLD=${CPU_THRESHOLD:-80}
MEMORY_THRESHOLD=${MEMORY_THRESHOLD:-80}
DISK_THRESHOLD=${DISK_THRESHOLD:-80}
warning=0

if (( cpu_usage >= CPU_THRESHOLD )); then
  echo "WARNING: CPU usage is ${cpu_usage}% (threshold: ${CPU_THRESHOLD}%)"
  warning=1
fi

if (( memory_usage >= MEMORY_THRESHOLD )); then
  echo "WARNING: Memory usage is ${memory_usage}% (threshold: ${MEMORY_THRESHOLD}%)"
  warning=1
fi

if (( disk_usage >= DISK_THRESHOLD )); then
  echo "WARNING: Disk usage is ${disk_usage}% (threshold: ${DISK_THRESHOLD}%)"
  warning=1
fi

if (( warning == 1 )); then
  echo "Overall status: WARNING"
  exit 1
fi

echo "Overall status: OK"
exit 0
