import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import constructUserManagementAPI from "@byu-trg/express-user-management";
import logger from "./logger";
import dbConfig from "./config/db.config";
import nodemailer from "nodemailer";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import { isMultipartRequest } from "./utils";
import {
  adminPasswordEnforcementMiddleware,
  registerAdminPasswordRoutes,
} from "./adminAuth";

const proxyMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  return proxy(process.env.BASETERM_API as string, {
    parseReqBody: !isMultipartRequest(req),
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      if (
        proxyReqOpts.headers !== undefined &&
        srcReq.cookies["TRG_AUTH_TOKEN"] !== undefined
      ) {
        proxyReqOpts.headers["cookie"] = `TRG_AUTH_TOKEN=${
          srcReq.cookies["TRG_AUTH_TOKEN"]
        }`;
      }

      return proxyReqOpts;
    },
  })(req, res, next)
};

export const constructServer = (
  app: Express,
) => {
  // Account verification and password recovery are admin-managed, so email
  // delivery is no longer part of the live authentication flow.
  const smtpTransporter = nodemailer.createTransport({
    jsonTransport: true,
  });

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(process.env.APP_DIR as string, '../react-app/build')));
  registerAdminPasswordRoutes(app);
  app.use(adminPasswordEnforcementMiddleware);
  
  constructUserManagementAPI(
    app,
    {
      logger,
      smtpConfig: {
        transporterConfig: smtpTransporter.transporter,
        email: "noreply@example.com",
      },
      authConfig: {
        secret: process.env.AUTH_SECRET as string
      },
      dbConfig: dbConfig,
    }
  );

  app.use('/baseterm', proxyMiddleware);  
  
  // Send BaseTerm app for all other endpoints
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.env.APP_DIR as string, '../react-app/build', 'index.html'));
  });
}