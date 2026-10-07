# Test Results

Date: 2026-10-07

## Jenkins pipeline: build #7

| Check | Result | Evidence |
|---|---|---|
| Node.js unit tests | PASS, 4 tests | Jenkins Test stage |
| Docker image build | PASS | `imsameur/mini-shop-cicd:build-7` |
| Trivy security scan | PASS, no HIGH or CRITICAL findings | Jenkins Security scan stage |
| Docker Hub push | PASS | Image digest `sha256:af918336611f104ff194809cd2c547a071d0e99fcea107bec4f7509857e3cd41` |
| Deployment | PASS | Container running on port `3000` |
| Health endpoint | PASS, HTTP 200 | `/health` returned `{"status":"healthy"}` |
| Version endpoint | PASS | `/version` returned `{"version":"build-7"}` |
| Products endpoint | PASS | `/api/products` returned four products |

## Rollback rehearsal

The published `build-5` image was run on test port `3001`. It returned HTTP 200 from `/health` and `{"version":"build-5"}` from `/version`.

The `build-7` image was then run on the same test port. It returned HTTP 200 and `{"version":"build-7"}`. The test container was stopped afterward. The deployed `build-7` container on port `3000` remained running.
