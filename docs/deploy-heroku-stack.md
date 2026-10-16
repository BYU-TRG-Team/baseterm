# Deploy Heroku stack

## Prerequisites

The [BaseTerm API](https://github.com/BYU-TRG-Team/baseterm-api) will need to be deployed to Heroku first.

Use supported Heroku runtimes:

- BaseTerm web app: Node 24
- BaseTerm API: Node 24 and Python 3.14

## Heroku setup 

1. Create a Heroku account.
2. [Install the Heroku CLI and login with your account](https://devcenter.heroku.com/articles/heroku-cli).
3. [Create a new Heroku app](https://devcenter.heroku.com/articles/creating-apps). 
    - **Make note of the app name**. 
    - The newly created app will use the lowest plan/tier by default (Eco). Please reference [this guide](https://www.heroku.com/dynos) to assess different tiers offered by Heroku, and [this guide](https://devcenter.heroku.com/articles/dyno-types#from-the-heroku-dashboard) if you wish to adjust the tier type of the app.
4. [Provision a Heroku Postgres instance for your app](https://devcenter.heroku.com/articles/provisioning-heroku-postgres).
    - The minimum plan needed for a small number of users and projects is **Basic**.
    - Refer to [this guide](https://devcenter.heroku.com/articles/heroku-postgres-plans) to learn more about Heroku Postgres plans.


## Set environment variables

Environment variables can either be set [using the CLI or the Heroku Dashboard](https://devcenter.heroku.com/articles/config-vars).

At minimum, configure:

- `APP_ENV=prod`
- `AUTH_SECRET=<shared secret used by both apps>`
- `BASETERM_API=<url of the deployed BaseTerm API>`

Email service credentials are not required for BaseTerm deployment. Account approval and password management are handled by administrators inside the app.

If you use a staging or production pipeline, set `HUSKY=0` for build environments.

## Deploy application to Heroku

1. [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
2. Clone the repository, initialize the API submodule, and checkout the latest release:

```
git clone https://github.com/BYU-TRG-Team/baseterm.git
cd baseterm
git submodule update --init --recursive
LATEST_TAG=$(git describe --tags --abbrev=0)
git checkout tags/"${LATEST_TAG}" -b "${LATEST_TAG}"
```

3. The BaseTerm web app release phase runs the identity migration and seeds the default administrator automatically when the database has no verified administrator.

4. Retrieve the database url from Heroku, and run the following commands to configure the database for the web app if you need to backfill an existing deployment:

From the repository root:

```sh
cd express-app
HUSKY=0 npm ci
cd ..
DATABASE_URL=<url for the database> \
APP_ENV=prod \
PGSSLMODE=no-verify npm run migrate:user-management
```

5. The API app should also run its own `npm run migrate up` command during deployment or release.

6. [Create a Git remote for Heroku](https://devcenter.heroku.com/articles/git#create-a-heroku-remote).
7. [Deploy the git repo to Heroku](https://devcenter.heroku.com/articles/git#deploy-your-code).

Use Heroku Git pushes for deployment. GitHub-to-Heroku sync does not resolve submodules reliably.

Your application should now be available at the following url:

```
https://<app-name>.herokuapp.com
```

## Configure initial user

1. The default administrator is seeded automatically as `admin` / `ChangeMeNow!123` whenever the database has no verified administrator.
2. The seeded administrator must change its password from `Edit Profile` before it can use the rest of the application.
3. Change the production password immediately after the first login.
4. Public signups remain pending until an administrator verifies them from User Management.