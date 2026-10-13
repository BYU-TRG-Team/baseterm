import { Express, NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import dbConfig from "./config/db.config";

const AUTH_COOKIE_NAME = "TRG_AUTH_TOKEN";
const ADMIN_ROLE_ID = 3;
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_CHANGE_REQUIRED_CODE = "PASSWORD_CHANGE_REQUIRED";

type UserState = {
  userId: string;
  username: string;
  roleId: number;
  verified: boolean;
  mustChangePassword: boolean;
};

type AuthTokenPayload = JwtPayload & {
  id: string;
  username: string;
  role: number;
  verified: boolean;
};

const pool = new Pool(dbConfig);

const passwordChangeRequiredMessage = "Administrator password change required.";

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

  if (req.method === "GET" && req.path === "/api/users") {
    return true;
  }

  return (
    req.method === "PATCH" &&
    req.path === `/api/admin/users/${currentUser.userId}/password`
  );
};

const readCurrentUser = async (userId: string) => {
  const response = await pool.query(
    `SELECT user_id, username, role_id, verified, must_change_password
     FROM identity."user"
     WHERE user_id = $1`,
    [userId],
  );

  if (response.rowCount === 0) {
    return null;
  }

  const row = response.rows[0];

  return {
    userId: row.user_id as string,
    username: row.username as string,
    roleId: row.role_id as number,
    verified: row.verified as boolean,
    mustChangePassword: row.must_change_password as boolean,
  } as UserState;
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
    currentUser.roleId !== ADMIN_ROLE_ID ||
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

  app.patch("/api/admin/users/:userId/password", async (req, res) => {
    const currentUser = await readAuthenticatedUser(req);

    if (currentUser === null) {
      respondUnauthenticated(res);
      return;
    }

    if (!currentUser.verified || currentUser.roleId !== ADMIN_ROLE_ID) {
      res.status(403).json({
        error: "Only administrators can update passwords.",
      });
      return;
    }

    const targetUserId = req.params.userId;

    if (currentUser.mustChangePassword && targetUserId !== currentUser.userId) {
      respondPasswordChangeRequired(res);
      return;
    }

    const password = req.body?.password;

    if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
      res.status(400).json({
        error: `Passwords must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const response = await pool.query(
      `UPDATE identity."user"
       SET password = $1,
           must_change_password = false
       WHERE user_id = $2
       RETURNING user_id`,
      [passwordHash, targetUserId],
    );

    if (response.rowCount === 0) {
      res.status(404).json({
        error: "User not found.",
      });
      return;
    }

    res.json({
      userId: response.rows[0].user_id,
      mustChangePassword: false,
    });
  });
};

export {
  PASSWORD_CHANGE_REQUIRED_CODE,
  passwordChangeRequiredMessage,
};
