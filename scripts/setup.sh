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
for key in EMAIL_ADDRESS EMAIL_PROVIDER AUTH_SECRET; do
  if [[ -z "$(env_value "$key")" ]]; then
    missing+=("$key")
  fi
done

email_provider="$(env_value EMAIL_PROVIDER | tr '[:upper:]' '[:lower:]')"
if [[ "$email_provider" == "zoho" && -z "$(env_value EMAIL_PASSWORD)" ]]; then
  missing+=("EMAIL_PASSWORD")
elif [[ "$email_provider" == "sendgrid" && -z "$(env_value EMAIL_PROVIDER_API_KEY)" ]]; then
  missing+=("EMAIL_PROVIDER_API_KEY")
fi

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

echo "Checking for an administrator..."
set +e
docker compose run -T --rm --no-deps baseterm \
  npm --prefix express-app run bootstrap-admin -- --check
admin_check_status=$?
set -e

if [[ "$admin_check_status" -eq 2 ]]; then
  if [[ ! -t 0 ]]; then
    echo "No administrator exists, and setup is not running interactively."
    echo "Run npm run setup from a terminal to create the initial administrator."
    exit 1
  fi

  read -r -p "Administrator username [admin]: " admin_username
  admin_username="${admin_username:-admin}"

  while [[ -z "${admin_email:-}" ]]; do
    read -r -p "Administrator email: " admin_email
  done

  read -r -p "Administrator name [Administrator]: " admin_name
  admin_name="${admin_name:-Administrator}"

  while true; do
    read -r -s -p "Administrator password (minimum 12 characters): " admin_password
    echo
    if (( ${#admin_password} < 12 )); then
      echo "Password must be at least 12 characters."
      continue
    fi

    read -r -s -p "Confirm administrator password: " admin_password_confirmation
    echo
    if [[ "$admin_password" != "$admin_password_confirmation" ]]; then
      echo "Passwords do not match."
      continue
    fi
    break
  done

  printf '%s' "$admin_password" |
    docker compose run -T --rm --no-deps \
      -e "INITIAL_ADMIN_USERNAME=$admin_username" \
      -e "INITIAL_ADMIN_EMAIL=$admin_email" \
      -e "INITIAL_ADMIN_NAME=$admin_name" \
      baseterm npm --prefix express-app run bootstrap-admin

  unset admin_password admin_password_confirmation
elif [[ "$admin_check_status" -ne 0 ]]; then
  echo "Unable to check for an existing administrator."
  exit "$admin_check_status"
fi

echo "Starting BaseTerm..."
docker compose up -d

host_port="$(env_value HOST_PORT)"
host_port="${host_port:-3000}"
echo "BaseTerm is running at http://localhost:${host_port}"
echo "Run 'npm run docker:logs' to follow logs."
