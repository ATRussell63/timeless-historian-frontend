#!/usr/bin/env bash

# Exit immediately if a command fails
set -e

# === Configuration ===
STATIC_PATH=""  # <-- replace with your Docker build path
REMOTE_USER=""                      # <-- remote SSH user
REMOTE_HOST=""             # <-- remote server address
REMOTE_PATH=""                  # <-- remote directory to copy the .tar

# === Prompt for tag ===
read -rp "Enter Docker tag name (e.g., frontend-0.3.3): " TAG

# Validate input
if [[ -z "$TAG" ]]; then
    echo "Error: Tag name cannot be empty."
    exit 1
fi

# Optional: confirm
echo "Using Docker tag: $TAG"

# === Step 1: Docker build ===
echo "Building Docker image..."
docker build -t "$TAG" "$STATIC_PATH"
echo "Docker build completed."

# === Step 2: Docker save ===
TAR_PATH="$HOME/${TAG}.tar"
echo "Saving Docker image to $TAR_PATH..."
docker save -o "$TAR_PATH" "$TAG"
echo "Docker save completed."

# === Step 3: SCP to remote server ===
echo "Copying $TAR_PATH to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH..."
scp "$TAR_PATH" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo "SCP completed. Done!"
