#!/bin/bash
set -e

# Configure git
git config --global user.name "Feroz Ahmad"
git config --global user.email "ferozserikar10@gmail.com"
git config --global --add safe.directory /app/applet

echo "Initializing Git..."
# If .git directory doesn't exist, init it
if [ ! -d ".git" ]; then
  git init
fi

echo "Setting branch name to main..."
git branch -M main || true

echo "Adding remote..."
git remote remove origin || true
git remote add origin "https://x-access-token:${GITHUB_TOKEN}@github.com/ferozserikar04-cpu/feroz01-matrimonial.git"

echo "Fetching remote branch..."
git fetch origin main || true

echo "Resetting branch pointer to remote main without modifying files..."
git reset origin/main || true

echo "Adding changes..."
git add .

echo "Commiting changes..."
git commit -m "Configure signed APK auto-release and add Android download banner to homepage" || echo "No changes to commit"

echo "Ensuring branch is named main..."
git branch -M main

echo "Pushing changes to remote repository..."
git push -u origin main

echo "Push successful!"
