# this document is to show how to setup this piece of code

## required softwares installed

1. docker desktop with active kubectl cluster
2. run nats-streaming on one of the kube-pods
3. deploy the nats-server using config.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nats-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nats
  template:
    metadata:
      labels:
        app: nats
    spec:
      containers:
        - name: nats
          image: nats-streaming:0.17.0
          args:
            [
              "-p",
              "4222",
              "-m",
              "8222",
              "-hbi",
              "5s",
              "-hbt",
              "5s",
              "-hbf",
              "2",
              "-SD",
              "-cid",
              "ticketing",
            ]
---
apiVersion: v1
kind: Service
metadata:
  name: nats-srv
spec:
  selector:
    app: nats
  ports:
    - name: client
      protocol: TCP
      port: 4222
      targetPort: 4222
    - name: monitoring
      protocol: TCP
      port: 8222
      targetPort: 8222
```

-> once the service deployed port forward the cluster ports to localhost and make use of them outside the cluster.

check the starting scripts from package.json.
