# Docs
https://helmfile.readthedocs.io/en/latest/

# Usage
Helmfile supports a structured workflow with the following key commands:

 1. Dependencies
Install or update chart dependencies before applying:
```bash
helmfile deps
```
 2. Preview Changes
See what will change before applying it (dry run):
```bash
helmfile diff -e staging

helmfile diff -e production
```

3. Apply Changes
Apply the desired state to the cluster:
```bash
helmfile apply -e staging

helmfile apply -e production
```

You can target specific charts using labels. For example, to operate on a single chart with the label name=chart-name:
```bash
helmfile -l name=redis diff -e staging
helmfile -l name=redis apply -e staging
```

# To secure some data like redis password SOPS and kms key can be used
