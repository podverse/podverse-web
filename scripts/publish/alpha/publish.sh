#!/bin/bash

git checkout v5-alpha
git pull origin v5-develop
git push origin v5-alpha
git checkout v5-develop
