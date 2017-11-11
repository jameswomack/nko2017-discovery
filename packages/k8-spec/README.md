# nko2017 kubernetes cluster

The infrastructure for our Node Knockout 2017 project.

## Deploying

This spec should be deployed to a kubernetes end point using (hikaru)[https://github.com/arobson/hikaru].

*from the repo*
```shell
hikaru deploy ./ \
  -k https://ip \
  -u username \
  -p password \
  -f ./data.yml \
  -d -s
```
