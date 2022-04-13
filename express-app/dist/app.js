"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructServer = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_user_management_1 = __importDefault(require("@byu-trg/express-user-management"));
const logger_1 = __importDefault(require("./logger"));
const smtp_config_1 = __importDefault(require("./config/smtp.config"));
const db_config_1 = __importDefault(require("./config/db.config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const utils_1 = require("./utils");
const proxyMiddleware = (req, res, next) => {
    return (0, express_http_proxy_1.default)(process.env.BASETERM_API, {
        parseReqBody: !(0, utils_1.isMultipartRequest)(req),
        proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
            if (proxyReqOpts.headers !== undefined &&
                srcReq.cookies["TRG_AUTH_TOKEN"] !== undefined) {
                proxyReqOpts.headers["cookie"] = `TRG_AUTH_TOKEN=${srcReq.cookies["TRG_AUTH_TOKEN"]}`;
            }
            return proxyReqOpts;
        },
    })(req, res, next);
};
const constructServer = (app) => {
    const smtpTransporter = nodemailer_1.default.createTransport({
        service: smtp_config_1.default.provider,
        secure: true,
        auth: {
            user: smtp_config_1.default.email,
            pass: smtp_config_1.default.password,
        },
    });
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(process.env.APP_DIR, '../react-app/build')));
    (0, express_user_management_1.default)(app, {
        logger: logger_1.default,
        smtpConfig: {
            transporterConfig: smtpTransporter.transporter,
            email: smtp_config_1.default.email,
        },
        authConfig: {
            secret: process.env.AUTH_SECRET
        },
        dbConfig: {
            connectionString: db_config_1.default.connectionString,
            ssl: process.env.APP_ENV === 'production' ? { rejectUnauthorized: false } : false,
        }
    });
    app.use('/baseterm', proxyMiddleware);
    // app.use("/baseterm", createProxyMiddleware({
    //   target: process.env.BASETERM_API as string,
    //   pathRewrite: (path) => path.substring("/baseterm".length),
    //   selfHandleResponse: true,
    //   onProxyReq: (proxyReq, req, res) => {
    //     console.log(req.headers);
    //     const authCookie = req.cookies["TRG_AUTH_TOKEN"];
    //     if (
    //       authCookie !== undefined
    //     ) {
    //       proxyReq.setHeader("Cookie", `TRG_AUTH_TOKEN=${authCookie}`);
    //     }
    //   },
    // }))
    // Send BaseTerm app for all other endpoints
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(process.env.APP_DIR, '../react-app/build', 'index.html'));
    });
};
exports.constructServer = constructServer;
//# sourceMappingURL=app.js.map