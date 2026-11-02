#!/bin/bash

echo "Pushing to GitHub..."

cd /Users/mac/Downloads/danish-portfolio-main

git remote set-url origin https://github.com/taimooralam870/taimoor-portfolio.git

git push -u origin main

echo "Done!"
