# BaseTerm 

An Express.js and React.js termbase management application that follows the [TermBase eXchange (TBX) standard](https://www.tbxinfo.net/). Currently, BaseTerm only supports the TBX-Basic dialect. The application makes use of the [BaseTerm API](https://github.com/BYU-TRG-Team/baseterm-api) for the underlying CRUD operations on TBX elements. The API is compatible with any TBX dialect since the underlying logic and PostgreSQL schemas follow the Core dialect. However, in order to support the BaseTerm application (which currently only supports TBX-Basic), the import endpoint currently rejects any TBX files that are not TBX-Basic. 

## Installation

BaseTerm requires the following to be installed on your machine: 
- PostgreSQL 14.x
- Node.js 16.x

### Build React App

This application operates as an express server that serves the React bundle. To generate the react bundle, the following commands will need to be run from the directory of the react-app.

```
npm install
```

```
npm run build
```

### Build Express App

To install and build the express app, the following commands will need to be run from the directory of the express-app.

```
npm install
```

```
npm run build
```

### User Management PostgreSQL migrations

BaseTerm also makes use of the BYU TRG's [express-based user management library](https://github.com/BYU-TRG-Team/express-user-management). The following commands will need to be run from the directory of the express-app to instantiate the desired database with user management schemas.

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

