"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app_1 = require("./app");
const app = (0, express_1.default)();
if (process.env.PORT === undefined)
    throw new Error("Error starting BaseTerm application: no PORT enviornment variable specified");
(0, app_1.constructServer)(app);
app.listen(process.env.PORT, () => {
    console.log(`BaseTerm application listening on port ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map