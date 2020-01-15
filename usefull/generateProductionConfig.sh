#!/bin/bash
set -e

cd ..

mkdir -p ./confd/conf.d
mkdir -p ./confd/templates
cp ./confd/production.toml ./confd/conf.d/production.toml -f
cp ./confd/production.tmpl ./confd/templates/production.tmpl -f

# Run confd with file as backend (instead of etcd, for demo purposes only).
confd -onetime -backend file -config-file ./confd/production.toml -confdir ./confd -file ./usefull/config.yaml

rm -f -r ./confd/conf.d
rm -f -r ./confd/templates