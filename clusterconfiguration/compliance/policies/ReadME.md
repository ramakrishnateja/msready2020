kubectl apply --validate=false -f https://raw.githubusercontent.com/jetstack/cert-manager/v0.13.0/deploy/manifests/00-crds.yaml
kubectl create namespace cert-manager --kubeconfig=C:\projects\personal\msready\config
helm3 repo add jetstack https://charts.jetstack.io
helm3 repo update
helm3 install cert-manager --namespace cert-manager --version v0.13.0 jetstack/cert-manager --kubeconfig=C:\projects\personal\msready\config



https://cert-manager.io/docs/configuration/ca/
https://cert-manager.io/docs/concepts/ca-injector/

kubectl get issuers ca-issuer -n sandbox -o wide