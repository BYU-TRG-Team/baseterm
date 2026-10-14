import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import constructUserManagementAPI from "@byu-trg/express-user-management";
import sendGridNodemailerTransport from "nodemailer-sendgrid-transport"
import logger from "./logger";
import smtpConfig from "./config/smtp.config";
import dbConfig from "./config/db.config";
import nodemailer from "nodemailer";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import { EmailProvider } from "./types";
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
  const smtpTransporter = function () {
    const provider = smtpConfig.provider?.toLowerCase();

    switch (provider) {
      case EmailProvider.Zoho:
        return nodemailer.createTransport({
          service: smtpConfig.provider,
          secure: true,
          auth: {
            user: smtpConfig.email,
            pass: smtpConfig.password,
          },
        });
  
      case EmailProvider.SendGrid:
        return nodemailer.createTransport(sendGridNodemailerTransport({
          auth: {
            api_key: smtpConfig.apiKey
          },
        }))
  
      default:
        // Email-based verification/recovery is retired locally, so fall back
        // to a no-op transport instead of requiring SMTP config at startup.
        return nodemailer.createTransport({
          jsonTransport: true,
        });
    }
  } ()

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
        email: smtpConfig.email || "noreply@example.com",
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