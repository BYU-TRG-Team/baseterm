import * as dotenv from 'dotenv';
import express from "express";

dotenv.config({ path: `${process.env.APP_DIR}/../.env` })

import { constructServer } from "./app";

const app = express();

if (process.env.PORT === undefined) throw new Error(
  "Error starting BaseTerm application: no PORT enviornment variable specified"
)

constructServer(app);

app.listen(process.env.PORT, () => {
  console.log(`BaseTerm application listening on port ${process.env.PORT}`);
});


