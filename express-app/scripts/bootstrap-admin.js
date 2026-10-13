"use strict";

const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const ADMIN_ROLE_ID = 3;
const PASSWORD_MIN_LENGTH = 12;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.APP_ENV === "prod"
    ? { rejectUnauthorized: false }
    : false,
});

const hasAdministrator = async () => {
  const result = await pool.query(
    `SELECT EXISTS (
      SELECT 1
      FROM identity."user"
      WHERE role_id = $1 AND verified = true
    ) AS exists`,
    [ADMIN_ROLE_ID],
  );

  return result.rows[0].exists;
};

const bootstrapAdministrator = async () => {
  const username = process.env.INITIAL_ADMIN_USERNAME?.trim();
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim();
  const name = process.env.INITIAL_ADMIN_NAME?.trim();
  const password = require("fs").readFileSync(0, "utf8");

  if (!username || !email || !name) {
    throw new Error("Administrator username, email, and name are required.");
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(
      `Administrator password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('baseterm-admin-bootstrap'))",
    );

    const existingAdministrator = await client.query(
      `SELECT user_id
       FROM identity."user"
       WHERE role_id = $1 AND verified = true
       FOR UPDATE`,
      [ADMIN_ROLE_ID],
    );

    if (existingAdministrator.rowCount > 0) {
      await client.query("ROLLBACK");
      console.log("A verified administrator already exists; no changes made.");
      return;
    }

    const conflictingUser = await client.query(
      `SELECT user_id
       FROM identity."user"
       WHERE username = $1 OR email = $2 OR name = $3
       FOR UPDATE`,
      [username, email, name],
    );

    if (conflictingUser.rowCount > 0) {
      throw new Error(
        "A user already has that username, email, or name. Refusing to elevate an existing account.",
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await client.query(
      `INSERT INTO identity."user"
        (username, verified, password, email, name, role_id)
       VALUES ($1, true, $2, $3, $4, $5)`,
      [username, passwordHash, email, name, ADMIN_ROLE_ID],
    );

    await client.query("COMMIT");
    console.log(`Administrator "${username}" created successfully.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const main = async () => {
  try {
    if (process.argv.includes("--check")) {
      if (await hasAdministrator()) {
        console.log("A verified administrator exists.");
        return;
      }

      console.log("No verified administrator exists.");
      process.exitCode = 2;
      return;
    }

    await bootstrapAdministrator();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

main();
