# BaseTerm 

An Express.js and React.js termbase management application that follows the [TermBase eXchange (TBX) standard](https://www.tbxinfo.net/). Currently, BaseTerm only supports the TBX-Basic dialect. The application makes use of the [BaseTerm API](https://github.com/BYU-TRG-Team/baseterm-api) for the underlying CRUD operations on TBX elements. The API is compatible with any TBX dialect since the underlying logic and PostgreSQL schemas follow the Core dialect. However, in order to support the BaseTerm application (which currently only supports TBX-Basic), the import endpoint currently rejects any TBX files that are not TBX-Basic. 

## Installation

### Server Requirements

- PostgreSQL 14.x
- Node.js 16.x

### Third Party Requirements

- **Hosted email account**. This is the account from which BaseTerm will send emails. The `EMAIL_ADDRESS`, `EMAIL_PASSWORD`, `EMAIL_PROVIDER` environment variables exist for this account. The possible providers can be found in the [NodeMailer source code](https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json). Zoho has a pretty generous free tier, so it's been a popular pick for instances of BaseTerm. 

- **Rollbar logging token (for BaseTerm server)**. Please contact the TRG team to setup one.

### Environment Variables

```
APP_ENV=<dev | prod>
BASETERM_API=<url for the associated BaseTerm API>
DATABASE_URL=<url for the BaseTerm database>
EMAIL_ADDRESS=<address for hosted email account>
EMAIL_PASSWORD=<password for hosted email account. Remember CSPRNG!>
EMAIL_PROVIDER=<one of the possible NodeMailer providers>
AUTH_SECRET=<64-bit CSPRNG secret>
ROLLBAR_API_TOKEN=<Rollbar logging token>
```

### Build

#### React App

This application operates as an express server that serves the React bundle. To generate the react bundle, the following commands will need to be run from the directory of the react-app.

```
npm install
```

```
npm run build
```

### Express App

To install and build the express app, the following commands will need to be run from the directory of the express-app.

```
npm install
```

```
npm run build
```

### Database Configuration (PostgreSQL migrations)

**This step makes used of NPM packages installed from build.**

Once you have the PostgreSQL instance running, the following commands will need to be run from the directory of the express-app to configure it:

#### Migrate up
```
DATABASE_URL=<postgres instance url> npm explore @byu-trg/express-user-management -- npm run migrate up
```

#### Migrate down
```
DATABASE_URL=<postgres instance url> npm explore @byu-trg/express-user-management -- npm run migrate down
```


### Launch

After all installation, the application can be launched with the following command from the directory of the express-app:

```
npm run start
```

