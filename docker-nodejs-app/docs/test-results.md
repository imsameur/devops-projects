# Project 04: Test Results

Date: 2026-09-22
Environment: AWS EC2, Amazon Linux 2023, x86_64
Image: imsameur/mini-shop:1.0.0
Registry digest: sha256:1b53f54d31d71a956388fcc70295b69bfa359b073059c22e92e68f37a6f188c6

## Verification Results

| Test | Observed result | Status |
|---|---|---|
| Lockfile installation | npm ci completed successfully | PASS |
| Automated application tests | 4 passed, 0 failed | PASS |
| Cart calculation | Two mice and one keyboard total BDT 5,200 | PASS |
| Empty cart | Total is zero | PASS |
| Invalid cart input | Unknown products and invalid quantities rejected | PASS |
| Container homepage | GET / returned HTTP 200 | PASS |
| Product API | Four products returned | PASS |
| Application configuration | Custom shop name returned | PASS |
| Version endpoint | Version 1.0.0 returned | PASS |
| Non-root application | PID 1 UID values were all 1000 | PASS |
| Docker health check | Container reached healthy status | PASS |
| Simulated failure | HTTP 503 and Docker unhealthy | PASS |
| Recovery | HTTP 200 and Docker healthy | PASS |
| Environment overrides | Custom port, shop name and version worked | PASS |
| Custom-port health check | Healthy with PORT=4000 | PASS |
| Docker Hub push | Versioned image pushed successfully | PASS |
| Registry pull and run | New container started from registry image | PASS |
| Registry container endpoints | Homepage 200, healthy, version 1.0.0 | PASS |

## Automated Test Coverage

Run npm ci followed by npm test from the app directory.

The four tests verify:
- Correct total for multiple products and quantities.
- Zero total for an empty cart.
- Rejection of unknown product IDs.
- Rejection of invalid quantities.

Tests import the same calculateTotal function used by the frontend.

## Failure Simulation

Created /tmp/mini-shop-unhealthy inside the running container.
The health endpoint returned HTTP 503.
After three consecutive failed checks, Docker reported unhealthy.

Removed the marker file.
The health endpoint returned HTTP 200.
Docker returned to healthy after a successful check.

This is a controlled simulation, not a real dependency failure.

## Registry Verification

Pulled imsameur/mini-shop:1.0.0 from Docker Hub.
The local image was up to date, so cached layers were reused.
Started a new container named mini-shop-registry-test.
Published it on 127.0.0.1:3002, mapped to container port 3000.

Observed:
- Docker health: healthy
- Homepage: HTTP 200
- Health endpoint: healthy
- Version endpoint: 1.0.0

This test used the same EC2 host, not a clean machine.

## Application Scope

Demo shop with a static product catalog and browser cart.
No checkout, payment processing or database is implemented.
