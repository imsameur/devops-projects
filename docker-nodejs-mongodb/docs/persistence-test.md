# MongoDB Persistence and Recovery Tests

Test date: 2026-09-28
Environment: AWS EC2, Amazon Linux 2023, Docker Compose
Application image: mini-shop-notes:1.1.0
Database image: mongo:8.0

## 1. Create and read a note

```bash
curl -i -X POST http://localhost:3000/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"text":"Project 05: MongoDB persistence test"}'

curl -i http://localhost:3000/api/notes
```

Observed results:
- POST returned HTTP 201 Created.
- GET returned HTTP 200 OK with the saved note.

Recorded document:

```json
{
  "_id": "6aba7d61ad3f1a8671afd5b5",
  "text": "Project 05: MongoDB persistence test",
  "createdAt": "2026-09-28T14:44:49.215Z"
}
```

## 2. Recreate containers while preserving data

```bash
docker compose down
docker volume ls --filter name=mini-shop-project05_mongo_data
docker compose up -d --wait --wait-timeout 180
docker compose ps
curl -sS -w '\n' http://localhost:3000/api/notes
```

Observed results:
- Application and database containers were removed.
- The named volume mini-shop-project05_mongo_data remained.
- New containers started and became healthy.
- The same note ID, text and creation timestamp were returned.

Result: PASS. The note survived container removal and recreation.

Do not add --volumes or -v to docker compose down when preserving data.

## 3. Database outage

```bash
docker compose stop mongo
curl --max-time 20 -i http://localhost:3000/health
curl --max-time 20 -i http://localhost:3000/api/notes
```

Observed results:
- Health returned HTTP 503:
  {"status":"unhealthy","database":"down"}
- Notes returned HTTP 503:
  {"error":"Unable to load notes. Please try again later."}

Result: PASS. The application reported database unavailability.

## 4. Database recovery without restarting the application

```bash
docker compose start mongo
```

After allowing the database to start:

```bash
curl --max-time 20 -i http://localhost:3000/health
curl --max-time 20 -i http://localhost:3000/api/notes
docker compose ps
```

Observed results:
- Health returned HTTP 200:
  {"status":"healthy","database":"up"}
- Notes returned HTTP 200 with the original document.
- Both containers were healthy.
- The application container was not restarted during this test.

Result: PASS. The running application reconnected after database recovery.

## Scope and limitations

These tests verify note creation, reading, container-level persistence
and recovery from a database outage.

A local named volume is not a backup. These tests do not demonstrate
recovery from EC2 disk loss or database volume deletion.
