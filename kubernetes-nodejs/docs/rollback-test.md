# Rollback and Persistence Test

## Test environment

- Namespace: `kubernetes-nodejs`
- Application Deployment: `mini-shop`
- Database Deployment: `mongodb`
- Database storage: 2Gi PVC, `mongodb-pvc`
- Working application image: `mini-shop-k8s:1.2.0`

## Persistence test

1. Confirm the application and database pods are Ready:

   ```bash
   kubectl get pods -n kubernetes-nodejs
   ```

2. Write a note through the application API:

   ```bash
   curl -i -X POST http://127.0.0.1:3000/api/notes \
     -H "Content-Type: application/json" \
     -d '{"text":"Project 13 Kubernetes persistence check"}'
   ```

   Expected result: HTTP `201 Created`.

3. Delete the MongoDB pod. The Deployment creates a replacement pod:

   ```bash
   kubectl delete pod <mongodb-pod-name> -n kubernetes-nodejs
   kubectl rollout status deployment/mongodb \
     -n kubernetes-nodejs --timeout=300s
   ```

4. Read notes again through the application API:

   ```bash
   curl -i http://127.0.0.1:3000/api/notes
   ```

   Expected result: HTTP `200 OK`, with the previously saved note present.
   This confirms the data remained on the PVC after the MongoDB pod was
   recreated.

## Successful rolling update

The image `mini-shop-k8s:1.2.0` was built and loaded into Minikube. The
Deployment and ConfigMap were updated to version `1.2.0`.

```bash
kubectl rollout status deployment/mini-shop \
  -n kubernetes-nodejs --timeout=300s
curl http://127.0.0.1:3000/version
curl http://127.0.0.1:3000/health
```

Expected results: rollout succeeds, version is `1.2.0`, and database health
is `up`.

## Failed rollout test

The test used an image tag that does not exist locally or in a registry:

```bash
kubectl set image deployment/mini-shop \
  mini-shop=mini-shop-k8s:broken \
  -n kubernetes-nodejs

kubectl rollout status deployment/mini-shop \
  -n kubernetes-nodejs --timeout=60s
kubectl get pods -n kubernetes-nodejs
```

Expected result: rollout times out and the new pod enters `ImagePullBackOff`.
The existing version `1.2.0` pod remains Ready because the Deployment uses
`maxUnavailable: 0`.

This simulates an unavailable release image. It verifies rollout failure
detection and availability protection; it does not simulate an application
code defect.

## Rollback test

```bash
kubectl rollout undo deployment/mini-shop \
  -n kubernetes-nodejs
kubectl rollout status deployment/mini-shop \
  -n kubernetes-nodejs --timeout=300s

kubectl get deployment mini-shop -n kubernetes-nodejs \
  -o jsonpath='image={.spec.template.spec.containers[0].image}{"\n"}'
```

Expected result: the Deployment returns to `mini-shop-k8s:1.2.0`.
After rollback, `/version` returns `1.2.0`, `/health` reports the database
as `up`, and the previously saved note remains available.

## Result

Persistence, successful rolling update, failed rollout detection, and
rollback tests passed in the Minikube lab.
