"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMultipartRequest = void 0;
const isMultipartRequest = (req) => {
    const contentTypeHeader = req.headers["content-type"];
    return (contentTypeHeader && contentTypeHeader.indexOf("multipart") > -1);
};
exports.isMultipartRequest = isMultipartRequest;
//# sourceMappingURL=utils.js.map