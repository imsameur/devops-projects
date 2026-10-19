#!/bin/bash

##########
# Script: archive-logs.sh
# Author: Sameur Rahman
# Version: 0.1.0
# Description: Uploads Jenkins build logs from EC2 to Amazon S3.
# Purpose: Archive CI/CD logs in S3 as a potential lower-cost alternative to ELK.
# Schedule: Intended daily at 03:00 Asia/Dhaka; cron is not configured yet.
##########


# Variables
JENKINS_HOME="/var/lib/jenkins"
S3_BUCKET="s3://finops-jenkins-logs-xd"
AWS_REGION="ap-southeast-1"
DATE="${DATE:-$(TZ=Asia/Dhaka date -d yesterday +%Y-%m-%d)}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed."
    exit 1
fi

matched=0
failed=0

# Iterate through all job directories
for job_dir in "$JENKINS_HOME"/jobs/*/; do
    [ -d "$job_dir" ] || continue
    job_name=$(basename "$job_dir")

    # Iterate through build directories for the job
    for build_dir in "$job_dir"builds/*/; do
        [ -d "$build_dir" ] || continue
        build_number=$(basename "$build_dir")
        [[ "$build_number" =~ ^[0-9]+$ ]] || continue
            log_file="${build_dir}log"

        # Check if log exists and was last modified on the target date
        if [ -f "$log_file" ] &&
           [ "$(TZ=Asia/Dhaka date -r "$log_file" +%Y-%m-%d)" = "$DATE" ]; then
            matched=$((matched + 1))

            # Upload under the IAM policy's allowed jenkins-logs/ prefix
        destination="$S3_BUCKET/jenkins-logs/$DATE/$job_name-$build_number.log"
        if aws s3 cp "$log_file" "$destination" \
                     --region "$AWS_REGION" --only-show-errors; then
                     echo "Uploaded: $job_name/$build_number to $destination"
                else
                     echo "Failed to upload: $job_name/$build_number" >&2
                     failed=$((failed + 1))
             fi
        fi
    done
done

echo "Matched: $matched, failed: $failed"
[ "$failed" -eq 0 ]
