import { Express, NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Pool, PoolClient } from "pg";
import bcrypt from "bcrypt";
import dbConfig from "./config/db.config";

const AUTH_COOKIE_NAME = "TRG_AUTH_TOKEN";
const COOKIE_LIFETIME_MS = 604800000;
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_CHANGE_REQUIRED_CODE = "PASSWORD_CHANGE_REQUIRED";
const PENDING_APPROVAL_CODE = "PENDING_ADMIN_APPROVAL";

enum RoleId {
  Inactive = 0,
  User = 1,
  Staff = 2,
  Admin = 3,
}

type UserState = {
  userId: string;
  username: string;
  email: string;
  name: string;
  roleId: number;
  verified: boolean;
  mustChangePassword: boolean;
  passwordHash: string;
};

type AuthTokenPayload = JwtPayload & {
  id: string;
  username: string;
  role: number;
  verified: boolean;
};

const pool = new Pool(dbConfig);

const passwordChangeRequiredMessage = "Password change required before continuing.";

const generateCookieOptions = (timestamp: number) => ({
  expires: new Date(COOKIE_LIFETIME_MS + timestamp),
  httpOnly: false,
  secure: false,
  sameSite: "strict" as const,
});

const isAllowedDuringForcedPasswordChange = (
  req: Request,
  currentUser: UserState,
) => {
  if (req.method === "GET" && req.path === "/api/auth/admin-status") {
    return true;
  }

  if (req.method === "GET" && req.path === "/api/auth/logout") {
    return true;
  }

  return (
    req.method === "PATCH" &&
    req.path === `/api/admin/users/${currentUser.userId}/password`
  );
};

const mapUserRow = (row: any): UserState => ({
  userId: row.user_id as string,
  username: row.username as string,
  email: row.email as string,
  name: row.name as string,
  roleId: row.role_id as number,
  verified: row.verified as boolean,
  mustChangePassword: row.must_change_password as boolean,
  passwordHash: row.password as string,
});

const createAuthToken = (user: UserState) => {
  return jwt.sign(
    {
      id: user.userId,
      role: user.roleId,
      verified: user.verified,
      username: user.username,
    },
    process.env.AUTH_SECRET as string,
  );
};

const setAuthCookie = (res: Response, token: string) => {
  res.cookie(
    AUTH_COOKIE_NAME,
    token,
    generateCookieOptions(Date.now()),
  );
};

const readCurrentUser = async (
  userId: string,
  client?: PoolClient,
) => {
  const executor = client ?? pool;
  const response = await executor.query(
    `SELECT user_id, username, email, name, role_id, verified, must_change_password, password
     FROM identity."user"
     WHERE user_id = $1`,
    [userId],
  );

  if (response.rowCount === 0) {
    return null;
  }

  return mapUserRow(response.rows[0]);
};

const readUserByUsername = async (username: string) => {
  const response = await pool.query(
    `SELECT user_id, username, email, name, role_id, verified, must_change_password, password
     FROM identity."user"
     WHERE username = $1`,
    [username],
  );

  if (response.rowCount === 0) {
    return null;
  }

  return mapUserRow(response.rows[0]);
};

const readAuthenticatedUser = async (req: Request) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (typeof token !== "string" || token.length === 0) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET as string,
    ) as AuthTokenPayload;

    if (typeof decoded.id !== "string") {
      return null;
    }

    return await readCurrentUser(decoded.id);
  } catch (_error) {
    return null;
  }
};

const readVerifiedAdminCountExcludingUser = async (
  userId: string,
  client: PoolClient,
) => {
  const response = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM identity."user"
     WHERE role_id = $1
       AND verified = true
       AND user_id <> $2`,
    [RoleId.Admin, userId],
  );

  return response.rows[0].count as number;
};

const validatePassword = (password: unknown) => {
  return (
    typeof password === "string" &&
    password.length >= PASSWORD_MIN_LENGTH
  );
};

const validateRoleId = (roleId: unknown) => {
  return Object.values(RoleId).includes(Number(roleId) as RoleId);
};

const respondUnauthenticated = (res: Response) => {
  res.status(401).json({
    error: "You must be signed in to continue.",
  });
};

const respondPasswordChangeRequired = (res: Response) => {
  res.status(403).json({
    error: passwordChangeRequiredMessage,
    code: PASSWORD_CHANGE_REQUIRED_CODE,
  });
};

const requireVerifiedAdmin = async (req: Request, res: Response) => {
  const currentUser = await readAuthenticatedUser(req);

  if (currentUser === null) {
    respondUnauthenticated(res);
    return null;
  }

  if (!currentUser.verified || currentUser.roleId !== RoleId.Admin) {
    res.status(403).json({
      error: "Only administrators can perform this action.",
    });
    return null;
  }

  return currentUser;
};

const forbidRetiringLastVerifiedAdmin = async (
  currentUser: UserState,
  targetUserId: string,
  nextRoleId: number,
  nextVerified: boolean,
  client: PoolClient,
) => {
  const targetUser = await readCurrentUser(targetUserId, client);

  if (targetUser === null) {
    return {
      targetUser: null,
      error: "User not found.",
    };
  }

  if (
    targetUser.roleId === RoleId.Admin &&
    targetUser.verified &&
    !(nextRoleId === RoleId.Admin && nextVerified)
  ) {
    const otherVerifiedAdminCount = await readVerifiedAdminCountExcludingUser(
      targetUserId,
      client,
    );

    if (otherVerifiedAdminCount === 0) {
      return {
        targetUser,
        error: "At least one verified administrator must remain active.",
      };
    }
  }

  if (currentUser.userId === targetUserId && !nextVerified) {
    return {
      targetUser,
      error: "Administrators cannot unverify their own account.",
    };
  }

  if (currentUser.userId === targetUserId && nextRoleId !== RoleId.Admin) {
    return {
      targetUser,
      error: "Administrators cannot change their own role.",
    };
  }

  return {
    targetUser,
    error: null,
  };
};

export const adminPasswordEnforcementMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.path.startsWith("/api/") && !req.path.startsWith("/baseterm")) {
    next();
    return;
  }

  const currentUser = await readAuthenticatedUser(req);

  if (
    currentUser === null ||
    !currentUser.verified ||
    !currentUser.mustChangePassword
  ) {
    next();
    return;
  }

  if (isAllowedDuringForcedPasswordChange(req, currentUser)) {
    next();
    return;
  }

  respondPasswordChangeRequired(res);
};

export const registerAdminPasswordRoutes = (app: Express) => {
  app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password, name } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      !validatePassword(password)
    ) {
      res.status(400).json({
        message: `Body must include username, email, name, and a password of at least ${PASSWORD_MIN_LENGTH} characters.`,
      });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      await pool.query(
        `INSERT INTO identity."user"
          (username, verified, password, email, name, role_id, must_change_password)
         VALUES ($1, false, $2, $3, $4, $5, false)`,
        [username, hashedPassword, email, name, RoleId.User],
      );

      res.status(204).send();
    } catch (_error) {
      res.status(400).json({
        message: "There was a problem creating the account. Please try different user details.",
      });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({
        message: "Body must include a username and password",
      });
      return;
    }

    try {
      const user = await readUserByUsername(username);

      if (user === null) {
        res.status(400).json({
          message: "Incorrect username or password.",
        });
        return;
      }

      const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

      if (!passwordIsValid) {
        res.status(400).json({
          message: "Incorrect username or password.",
        });
        return;
      }

      if (!user.verified) {
        res.status(403).json({
          message: "Your account is awaiting administrator approval.",
          code: PENDING_APPROVAL_CODE,
        });
        return;
      }

      const token = createAuthToken(user);
      setAuthCookie(res, token);
      res.json({ token });
    } catch (_error) {
      res.status(500).json({
        message: "There was a problem signing in.",
      });
    }
  });

  app.get("/api/auth/verify/:token", (_req, res) => {
    res.redirect("/pending-approval");
  });

  app.post("/api/auth/recovery", (_req, res) => {
    res.status(410).json({
      message: "Password recovery is managed by an administrator.",
    });
  });

  app.get("/api/auth/recovery/verify/:token", (_req, res) => {
    res.status(410).json({
      message: "Password recovery is managed by an administrator.",
    });
  });

  app.post("/api/auth/recovery/:token", (_req, res) => {
    res.status(410).json({
      message: "Password recovery is managed by an administrator.",
    });
  });

  app.get("/api/auth/admin-status", async (req, res) => {
    const currentUser = await readAuthenticatedUser(req);

    if (currentUser === null) {
      respondUnauthenticated(res);
      return;
    }

    res.json({
      authenticated: true,
      userId: currentUser.userId,
      username: currentUser.username,
      roleId: currentUser.roleId,
      verified: currentUser.verified,
      mustChangePassword: currentUser.mustChangePassword,
    });
  });

  app.get("/api/users", async (req, res) => {
    const currentUser = await requireVerifiedAdmin(req, res);

    if (currentUser === null) {
      return;
    }

    const response = await pool.query(
      `SELECT user_id, username, verified, must_change_password, email, name, role_id
       FROM identity."user"
       ORDER BY name ASC, username ASC`,
    );

    res.json({
      users: response.rows,
      currentUserId: currentUser.userId,
    });
  });

  app.post("/api/admin/users", async (req, res) => {
    const currentUser = await requireVerifiedAdmin(req, res);

    if (currentUser === null) {
      return;
    }

    const {
      username,
      email,
      name,
      password,
      roleId = RoleId.User,
    } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      !validatePassword(password) ||
      !validateRoleId(roleId)
    ) {
      res.status(400).json({
        error: `User creation requires username, email, name, a password of at least ${PASSWORD_MIN_LENGTH} characters, and a valid role.`,
      });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const response = await pool.query(
        `INSERT INTO identity."user"
          (username, verified, password, email, name, role_id, must_change_password)
         VALUES ($1, true, $2, $3, $4, $5, true)
         RETURNING user_id, verified, must_change_password, role_id`,
        [username, hashedPassword, email, name, Number(roleId)],
      );

      res.status(201).json({
        userId: response.rows[0].user_id,
        verified: response.rows[0].verified,
        mustChangePassword: response.rows[0].must_change_password,
        roleId: response.rows[0].role_id,
      });
    } catch (_error) {
      res.status(400).json({
        error: "Unable to create that user. Please choose unique user details.",
      });
    }
  });

  app.patch("/api/admin/users/:userId", async (req, res) => {
    const currentUser = await requireVerifiedAdmin(req, res);

    if (currentUser === null) {
      return;
    }

    const targetUserId = req.params.userId;
    const { username, email, name, verified, roleId } = req.body ?? {};
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const targetUser = await readCurrentUser(targetUserId, client);

      if (targetUser === null) {
        await client.query("ROLLBACK");
        res.status(404).json({
          error: "User not found.",
        });
        return;
      }

      const nextRoleId = roleId === undefined ? targetUser.roleId : Number(roleId);
      const nextVerified = verified === undefined ? targetUser.verified : Boolean(verified);

      if (
        roleId !== undefined &&
        !validateRoleId(roleId)
      ) {
        await client.query("ROLLBACK");
        res.status(400).json({
          error: "A valid role is required.",
        });
        return;
      }

      const adminGuard = await forbidRetiringLastVerifiedAdmin(
        currentUser,
        targetUserId,
        nextRoleId,
        nextVerified,
        client,
      );

      if (adminGuard.error !== null) {
        await client.query("ROLLBACK");
        res.status(400).json({
          error: adminGuard.error,
        });
        return;
      }

      const attributes: string[] = [];
      const values: Array<string | boolean | number> = [];

      if (typeof username === "string") {
        attributes.push("username");
        values.push(username);
      }

      if (typeof email === "string") {
        attributes.push("email");
        values.push(email);
      }

      if (typeof name === "string") {
        attributes.push("name");
        values.push(name);
      }

      if (verified !== undefined) {
        attributes.push("verified");
        values.push(nextVerified);
      }

      if (roleId !== undefined) {
        attributes.push("role_id");
        values.push(nextRoleId);
      }

      if (attributes.length === 0) {
        await client.query("ROLLBACK");
        res.status(400).json({
          error: "No user updates were provided.",
        });
        return;
      }

      const assignments = attributes.map((attribute, index) => {
        return `${attribute} = $${index + 1}`;
      });

      values.push(targetUserId);

      const response = await client.query(
        `UPDATE identity."user"
         SET ${assignments.join(", ")}
         WHERE user_id = $${values.length}
         RETURNING user_id, verified, must_change_password, role_id`,
        values,
      );

      await client.query("COMMIT");
      res.json({
        userId: response.rows[0].user_id,
        verified: response.rows[0].verified,
        mustChangePassword: response.rows[0].must_change_password,
        roleId: response.rows[0].role_id,
      });
    } catch (_error) {
      await client.query("ROLLBACK");
      res.status(400).json({
        error: "Unable to update that user.",
      });
    } finally {
      client.release();
    }
  });

  app.delete("/api/admin/users/:userId", async (req, res) => {
    const currentUser = await requireVerifiedAdmin(req, res);

    if (currentUser === null) {
      return;
    }

    const targetUserId = req.params.userId;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (currentUser.userId === targetUserId) {
        await client.query("ROLLBACK");
        res.status(400).json({
          error: "Administrators cannot delete their own account.",
        });
        return;
      }

      const adminGuard = await forbidRetiringLastVerifiedAdmin(
        currentUser,
        targetUserId,
        RoleId.Inactive,
        false,
        client,
      );

      if (adminGuard.targetUser === null) {
        await client.query("ROLLBACK");
        res.status(404).json({
          error: "User not found.",
        });
        return;
      }

      if (adminGuard.error !== null) {
        await client.query("ROLLBACK");
        res.status(400).json({
          error: adminGuard.error,
        });
        return;
      }

      await client.query(
        `DELETE FROM identity."user"
         WHERE user_id = $1`,
        [targetUserId],
      );

      await client.query("COMMIT");
      res.status(204).send();
    } catch (_error) {
      await client.query("ROLLBACK");
      res.status(400).json({
        error: "Unable to delete that user.",
      });
    } finally {
      client.release();
    }
  });

  app.patch("/api/admin/users/:userId/password", async (req, res) => {
    const currentUser = await readAuthenticatedUser(req);

    if (currentUser === null) {
      respondUnauthenticated(res);
      return;
    }

    const targetUserId = req.params.userId;
    const isSelfUpdate = currentUser.userId === targetUserId;
    const isAdmin = currentUser.verified && currentUser.roleId === RoleId.Admin;

    if (!isSelfUpdate && !isAdmin) {
      res.status(403).json({
        error: "Only administrators can update other users' passwords.",
      });
      return;
    }

    if (currentUser.mustChangePassword && !isSelfUpdate) {
      respondPasswordChangeRequired(res);
      return;
    }

    const password = req.body?.password;

    if (!validatePassword(password)) {
      res.status(400).json({
        error: `Passwords must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      });
      return;
    }

    const nextMustChangePassword = isSelfUpdate ? false : true;
    const passwordHash = await bcrypt.hash(password, 12);
    const response = await pool.query(
      `UPDATE identity."user"
       SET password = $1,
           must_change_password = $2
       WHERE user_id = $3
       RETURNING user_id, must_change_password`,
      [passwordHash, nextMustChangePassword, targetUserId],
    );

    if (response.rowCount === 0) {
      res.status(404).json({
        error: "User not found.",
      });
      return;
    }

    res.json({
      userId: response.rows[0].user_id,
      mustChangePassword: response.rows[0].must_change_password,
    });
  });
};

export {
  PASSWORD_CHANGE_REQUIRED_CODE,
  PENDING_APPROVAL_CODE,
  passwordChangeRequiredMessage,
};
