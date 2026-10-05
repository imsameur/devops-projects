# Automated Linux Server Backup

A simple Bash and rsync project that creates timestamped backups, writes logs, removes expired backups, and supports scheduled runs with Cron.

## What it does

- Checks that the source directory exists.
- Copies files with `rsync` into a timestamped backup directory.
- Writes success and failure messages to a log.
- Removes timestamped backups older than the configured retention period.
- Supports a Cron schedule.

## Project files

- `backup.sh`: backup script
- `config.example`: source, destination, log, and retention settings
- `cron.example`: daily schedule
- `docs/restore-test.md`: restore instructions and result
- `docs/test-results.md`: test summary
- `docs/screenshots/`: project evidence

## Requirements

Amazon Linux 2023 or a compatible Linux system with Bash, rsync, Git, and Cronie installed.

## Lab setup

The example configuration uses these paths:

    ~/backup-lab/source
    ~/backup-lab/backups
    ~/backup-lab/logs

Create sample source files before running the script. Edit `config.example` to change the source, backup location, log file, or retention period.

## Run a backup manually

From this project directory:

    ./backup.sh

The script prints the result and appends it to the configured log file. Each successful run creates a directory named `backup_YYYYMMDD_HHMMSS`.

## Check a backup

List the files in a backup:

    find ~/backup-lab/backups/backup_YYYYMMDD_HHMMSS -type f

Compare it with the source. Replace the timestamp with a real backup directory name:

    diff -r ~/backup-lab/source ~/backup-lab/backups/backup_YYYYMMDD_HHMMSS

No output from `diff` means the files match.

## Restore files

Create a separate restore directory and copy the backup into it:

    mkdir -p ~/backup-lab/restore-test
    rsync -a ~/backup-lab/backups/backup_YYYYMMDD_HHMMSS/ ~/backup-lab/restore-test/

Compare the restored files with the source:

    diff -r ~/backup-lab/source ~/backup-lab/restore-test

## Schedule with Cron

The example schedule in `cron.example` runs daily at 02:00 Asia/Dhaka time. Cronie must be enabled:

    sudo systemctl enable --now crond

Review the current user's jobs before installing the example schedule:

    crontab -l

Install the example schedule:

    crontab cron.example

This replaces your crontab. Save existing jobs first.

## Tests

See `docs/test-results.md` for the test summary and `docs/restore-test.md` for restore verification.

## Limitation

This lab stores backups on the same server as the source. It demonstrates backup automation and restore testing, but it does not protect data from server or disk failure. Remote backup storage can be added as a future improvement.
