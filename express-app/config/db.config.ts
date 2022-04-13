import { AppEnv } from "../types";

const { APP_ENV } = process.env;

export default {
  connectionString: process.env.DATABASE_URL,
  ssl: 
    APP_ENV === AppEnv.Prod ?
    {
      rejectUnauthorized: false
    } :
    false,
};