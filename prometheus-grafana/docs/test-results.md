# Project 014 - Monitoring Test Results

## Environment

- Cloud: AWS EC2 (Singapore)
- Operating System: Amazon Linux 2023
- Kubernetes: Minikube v1.39.0
- Kubernetes Version: v1.37.0
- Deployment: Helm kube-prometheus-stack
- Namespace: monitoring

## 1. Monitoring Stack Verification

| Component | Result |
|-----------|--------|
| Prometheus | PASS |
| Grafana | PASS |
| Alertmanager | PASS |
| Node Exporter | PASS |
| kube-state-metrics | PASS |
| Prometheus Operator | PASS |

Prometheus scrape targets were verified as UP.

## 2. Grafana Dashboard Verification

Dashboard: Kubernetes & Linux Monitoring

| Panel | Result |
|-------|--------|
| Node CPU Usage (%) | PASS |
| Node Memory Usage (%) | PASS |
| Node Disk Usage (%) | PASS |
| Kubernetes Pod Status | PASS |
| Kubernetes Pod Readiness | PASS |

Dashboard JSON exported to:

`dashboards/kubernetes-overview.json`

## 3. Failure Simulation

Test: Node Exporter failure

Action: Applied a temporary nodeSelector to prevent
the Node Exporter DaemonSet from scheduling a pod.

Expected: Exporter becomes unavailable.

Observed:

- DaemonSet READY changed from 1 to 0.
- Node Exporter pod disappeared.
- Prometheus could no longer scrape Node Exporter.

Result: PASS

## 4. Alert Verification

Alert: NodeExporterDown

Expression:

```promql
(up{job="node-exporter"} == 0) or absent(up{job="node-exporter"})
```

Alert duration: 1 minute

Observed:

- Alert entered FIRING state.
- Severity: critical
- Namespace: monitoring
- Project: 014

Result: PASS

## 5. Alertmanager Routing Verification

Configured receiver:

`monitoring/project014-routing/project014-receiver`

Observed:

- Alertmanager received NodeExporterDown.
- The alert matched the configured route.
- The receiver was displayed correctly.

Result: PASS

Note: External email/webhook delivery was not tested.

## 6. Recovery Verification

Action: Removed the temporary nodeSelector.

Observed:

- Node Exporter pod returned to Running.
- DaemonSet READY returned to 1.
- Prometheus query `up{job="node-exporter"}` returned 1.
- NodeExporterDown changed to INACTIVE.
- Alertmanager cleared NodeExporterDown.

Result: PASS

## 7. Final Test Summary

| Test | Status |
|------|--------|
| Monitoring deployment | PASS |
| Metrics collection | PASS |
| Grafana dashboard | PASS |
| Prometheus alert rules | PASS |
| Alertmanager routing | PASS |
| Failure simulation | PASS |
| Alert FIRING | PASS |
| Exporter recovery | PASS |
| Alert resolution | PASS |
| External notifications | NOT TESTED |

Overall verified workflow:

**Failure -> Alert FIRING -> Routing -> Recovery -> Resolved**

External notification delivery is outside the verified scope.
