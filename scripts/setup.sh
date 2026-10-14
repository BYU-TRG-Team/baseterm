#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Desktop, then run this command again."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose is required. Install Docker Desktop, then run this command again."
  exit 1
fi

git submodule update --init --recursive

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example."
  echo "Fill in the email credentials and AUTH_SECRET, then run npm run setup again."
  exit 1
fi

env_value() {
  awk -F= -v key="$1" '$1 == key { sub(/^[^=]*=/, ""); print; exit }' .env
}

missing=()
for key in AUTH_SECRET; do
  if [[ -z "$(env_value "$key")" ]]; then
    missing+=("$key")
  fi
done

if (( ${#missing[@]} > 0 )); then
  echo "Complete these settings in .env: ${missing[*]}"
  exit 1
fi

echo "Building BaseTerm and BaseTerm API..."
docker compose build

echo "Starting PostgreSQL..."
docker compose up -d --wait postgres

echo "Applying BaseTerm API database migrations..."
docker compose run --rm --no-deps baseterm-api npm run migrate up

echo "Applying user-management database migrations..."
docker compose run --rm --no-deps baseterm \
  sh -c "cd express-app && npm run migrate:user-management"

echo "Seeding the default administrator if needed..."
docker compose run --rm --no-deps baseterm \
  npm --prefix express-app run bootstrap-admin

echo "Starting BaseTerm..."
docker compose up -d

host_port="$(env_value HOST_PORT)"
host_port="${host_port:-3000}"
echo "BaseTerm is running at http://localhost:${host_port}"
echo "Run 'npm run docker:logs' to follow logs."
