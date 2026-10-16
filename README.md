# BaseTerm

A termbase management application that follows the [TermBase eXchange](https://www.tbxinfo.net) (TBX) v3 standard. It includes the [BaseTerm API](https://github.com/BYU-TRG-Team/baseterm-api) as a Git submodule.

## Quick start

### Requirements

- Docker Desktop with Docker Compose
- Node.js 24.x with npm 11 (to run the convenience commands)

Docker Compose starts a local PostgreSQL 14 database automatically.

### 1. Configure the application

```sh
cp .env.example .env
openssl rand -hex 32
```

Put the generated secret in `AUTH_SECRET`.

### 2. Build and start everything

```sh
npm run setup
```

This command:

- downloads the BaseTerm API submodule;
- builds both Docker images;
- applies the API and user-management database migrations; and
- seeds the default administrator if one does not already exist; and
- starts the application at <http://localhost:3000>.

The default administrator is `admin` with password `ChangeMeNow!123`. The first time that account signs in, it must change its password from `Edit Profile` before it can use the rest of the application. Public signups remain available, but those accounts stay pending until an administrator verifies them in User Management. Setup and migration commands are safe to rerun. After the first setup, start the existing containers with:

```sh
npm run docker:up
```

## Useful commands

```sh
npm run docker:logs  # Follow application logs
npm run docker:down  # Stop and remove containers
npm run setup        # Rebuild, migrate, and restart
```

To update the repository and its API submodule together:

```sh
git pull
git submodule update --init --recursive
```

## Configuration

See [.env.example](.env.example) for all settings. Rollbar tokens are optional. No email service credentials are required for local setup, account approval, or password management.

## Heroku Notes

BaseTerm deploys as two Heroku apps:

- the BaseTerm web app from this repository; and
- the BaseTerm API from the `baseterm-api` submodule.

Both apps should target supported Heroku runtimes. This repository is tested against Node 24. The API should use Node 24 and Python 3.14. The web app release phase now runs the identity migration and seeds the default administrator automatically when the database has no verified admin.

The default administrator is `admin` / `ChangeMeNow!123`. Change that password immediately after the first production login from `Edit Profile`. Public signups remain pending until an administrator verifies them in User Management.

Before deploying an instance, contact the BYU TRG at byutrg@gmail.com to receive important version updates.
