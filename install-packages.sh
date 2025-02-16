#!/bin/bash

# Xóa thư mục node_modules và các tệp lock
rm -rf node_modules
rm -f package-lock.json yarn.lock

# Cài đặt các package với cờ --force
npm install --force