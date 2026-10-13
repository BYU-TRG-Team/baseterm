# Create a release from the main branch

## 1. Create release commit

From your local, create the release commit normally. Do not use `npm version` at the repository root, because the root package is private and does not carry the application release version.

Bump the version in the footer of the React app. Apply this change to the newly created commit using `git commit --amend`.

This commit should now be merged to remote main branch.

## 2. Create a GitHub release

Create a new GitHub release, configured with a new tag `v<x>.<y>.<z>`. **Generate release notes** can be used. 

**Please note any updates to the database configuration.**

If merging from a branch, please delete the branch.

## 3. Deploy new version

### BYU TRG BaseTerm instance

GitHub automatically deploys to BYU TRG BaseTerm instance on updates to main branch. 

However, changes to database configurations are not automatically applied. To apply new database migrations, the following can be run from the repository root: 

```sh
# Retrieve the database url from Heroku
cd express-app
HUSKY=0 npm ci
cd ..
DATABASE_URL=<url for the database> \
APP_ENV=prod \
npm run migrate:user-management
```

### New deployment

See the [Deploy Heroku stack guide](deploy-heroku-stack.md).
