# Deployment Guide

## Lab overview

This guide deploys the Mini Shop Node.js application and MongoDB to the
`kubernetes-nodejs` namespace on a local Minikube cluster.

MongoDB runs as one replica with a 2Gi PersistentVolumeClaim. This is a
single-instance lab database, not a production-grade highly available
database.

## Build and load the application image

Run these commands from the repository root:

```bash
docker build --build-arg APP_VERSION=1.2.0 \
  -t mini-shop-k8s:1.2.0 docker-nodejs-mongodb
minikube image load mini-shop-k8s:1.2.0
```

## Create the namespace and database Secret

Create the namespace before creating namespaced resources:

```bash
kubectl apply -f kubernetes-nodejs/manifests/namespace.yaml
```

Generate database passwords on the EC2 lab host. The temporary file is
removed after Kubernetes creates the Secret. Do not commit real passwords.

```bash
umask 077
ROOT_PASSWORD=$(openssl rand -hex 24)
APP_PASSWORD=$(openssl rand -hex 24)
SECRET_FILE=$(mktemp /tmp/project13-secret.XXXXXX)

printf 'MONGO_INITDB_ROOT_PASSWORD=%s\nMONGO_APP_PASSWORD=%s\n' \
  "$ROOT_PASSWORD" "$APP_PASSWORD" > "$SECRET_FILE"

kubectl create secret generic mini-shop-secret \
  --namespace kubernetes-nodejs \
  --from-env-file="$SECRET_FILE"

rm -f "$SECRET_FILE"
unset ROOT_PASSWORD APP_PASSWORD SECRET_FILE
```

If `mini-shop-secret` already exists, do not run the create command again.
`manifests/secret.example.yaml` contains placeholders only. Do not apply it.
The real Secret is created directly in Kubernetes and is not stored in Git.

## Apply the manifests

```bash
kubectl apply -f kubernetes-nodejs/manifests/mongodb-pvc.yaml
kubectl apply -f kubernetes-nodejs/manifests/configmap.yaml
kubectl apply -f kubernetes-nodejs/manifests/mongodb-init-configmap.yaml
kubectl apply -f kubernetes-nodejs/manifests/mongodb-deployment.yaml
kubectl apply -f kubernetes-nodejs/manifests/mongodb-service.yaml
kubectl apply -f kubernetes-nodejs/manifests/app-deployment.yaml
kubectl apply -f kubernetes-nodejs/manifests/app-service.yaml
```

Wait for both Deployments and inspect the pods, Services, and storage:

```bash
kubectl rollout status deployment/mongodb \
  -n kubernetes-nodejs --timeout=300s
kubectl rollout status deployment/mini-shop \
  -n kubernetes-nodejs --timeout=300s
kubectl get pods,services,pvc -n kubernetes-nodejs
```

## Configuration and health checks

The ConfigMap stores non-secret settings such as the database name,
application username, shop name, and app version. The Secret supplies the
MongoDB passwords. The application connects to MongoDB through the
`mongodb` Service.

The app uses `/version` for startup and liveness checks, and `/health` for
readiness. `/health` checks the database connection. MongoDB uses `mongosh`
ping checks. Both workloads have CPU and memory requests and limits.

## Test the application

Forward the Service port from the EC2 host:

```bash
kubectl port-forward service/mini-shop 3000:80 \
  -n kubernetes-nodejs
```

In another SSH terminal, check health and version and write/read a note:

```bash
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/version
curl -i -X POST http://127.0.0.1:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"text":"Project 13 persistence check"}'
curl -i http://127.0.0.1:3000/api/notes
```

Stop port-forwarding with Ctrl+C.

## Persistence check

After writing a note, delete the MongoDB pod. The Deployment creates a
replacement pod while the PVC keeps the database files:

```bash
kubectl get pods -n kubernetes-nodejs -l app=mongodb
kubectl delete pod <mongodb-pod-name> -n kubernetes-nodejs
kubectl rollout status deployment/mongodb \
  -n kubernetes-nodejs --timeout=300s
```

Read `/api/notes` again through the port-forward. The previously saved note
should still be present.

## Cleanup

To remove the local Minikube cluster and its lab resources:

```bash
minikube delete
```

Deleting the cluster also removes this lab's PVC and its MongoDB data.
