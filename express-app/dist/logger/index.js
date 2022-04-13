"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_transport_rollbar_3_1 = __importDefault(require("winston-transport-rollbar-3"));
const types_1 = require("../types");
const { combine, errors, colorize, timestamp, prettyPrint, } = winston_1.default.format;
const transports = [];
// Add transports
if (process.env.ROLLBAR_API_TOKEN !== undefined) {
    transports.push(new winston_transport_rollbar_3_1.default({
        rollbarConfig: {
            accessToken: process.env.ROLLBAR_API_TOKEN,
        },
        level: "error",
    }));
}
if (process.env.APP_ENV === types_1.AppEnv.Dev) {
    transports.push(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
exports.default = winston_1.default.createLogger({
    transports,
    format: combine(errors({ stack: true }), // <-- use errors format
    colorize(), timestamp(), prettyPrint()),
});
//# sourceMappingURL=index.js.map