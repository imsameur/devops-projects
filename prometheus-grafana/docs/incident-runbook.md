# Incident Runbook: Node Exporter Down

## Project Information

- Project: 014 - Prometheus & Grafana Monitoring
- Environment: AWS EC2 + Minikube Kubernetes
- Monitoring Tools: Prometheus, Grafana, Alertmanager
- Component: Node Exporter
- Alert Name: NodeExporterDown
- Severity: Critical

## 1. Incident Detection

Prometheus continuously monitors Node Exporter.

The following alert rule detects exporter failure:

```promql
(up{job="node-exporter"} == 0) or absent(up{job="node-exporter"})
```

If Node Exporter is unavailable for more than 1 minute,
Prometheus triggers the NodeExporterDown alert.

Check Prometheus:

http://localhost:9090/alerts

Expected incident status: FIRING

Check Alertmanager:

http://localhost:9093

Verify the alert is routed to:

monitoring/project014-routing/project014-receiver

## 2. Investigation

Check Node Exporter DaemonSet:

```bash
kubectl get daemonset monitoring-prometheus-node-exporter -n monitoring
```

Check exporter pods:

```bash
kubectl get pods -n monitoring \
  -l app.kubernetes.io/name=prometheus-node-exporter
```

Check DaemonSet details:

```bash
kubectl describe daemonset monitoring-prometheus-node-exporter -n monitoring
```

Check Kubernetes nodes:

```bash
kubectl get nodes
```

Possible causes:

- Node Exporter pod stopped or crashed
- Kubernetes scheduling problems
- Node resource limitations
- Network connectivity problems
- Incorrect DaemonSet configuration

## 3. Recovery Procedure

During Project 014 testing, Node Exporter was intentionally disabled
using a temporary nodeSelector.

Remove the test nodeSelector to restore the exporter:

```bash
kubectl patch daemonset monitoring-prometheus-node-exporter \
  -n monitoring \
  --type json \
  -p='[{"op":"remove","path":"/spec/template/spec/nodeSelector/project014-test"}]'
```

Important: Run this command only when the temporary
`project014-test` nodeSelector exists.

For other incidents, investigate the actual cause before applying changes.

## 4. Verify Recovery

Check DaemonSet:

```bash
kubectl get daemonset monitoring-prometheus-node-exporter -n monitoring
```

Expected:

DESIRED: 1
CURRENT: 1
READY: 1

Check Node Exporter metrics in Prometheus:

```promql
up{job="node-exporter"}
```

Expected result:

1

Verify the alert lifecycle:

1. Prometheus NodeExporterDown becomes INACTIVE.
2. Alertmanager no longer shows NodeExporterDown as active.
3. Grafana displays Linux CPU, memory, and disk metrics again.

## 5. Incident Documentation

Record the following information:

- Incident start time
- Incident detection time
- Root cause
- Recovery action
- Recovery completion time
- Alert resolution status
- Screenshots or other evidence

## 6. Project 014 Test Result

The following workflow was successfully verified:

Failure -> Alert FIRING -> Alertmanager Routing -> Recovery -> Alert Resolved

Test actions:

1. Disabled Node Exporter scheduling.
2. Verified the exporter pod disappeared.
3. Confirmed NodeExporterDown entered FIRING state.
4. Verified Alertmanager routing to project014-receiver.
5. Restored Node Exporter scheduling.
6. Confirmed Node Exporter returned to READY state.
7. Verified the Prometheus up metric returned 1.
8. Confirmed NodeExporterDown became INACTIVE.
9. Confirmed the alert disappeared from Alertmanager active alerts.

## 7. Notification Limitation

Alertmanager routing was configured and verified.

External email, Slack, or webhook notification delivery
was not configured or tested in this project.
