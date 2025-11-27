#!/bin/bash

# Deploy to GitHub Pages
echo "Building project..."
npm run build

echo "Creating gh-pages branch..."
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

echo "Switching back to main..."
git checkout main

echo "Deployment complete!"
