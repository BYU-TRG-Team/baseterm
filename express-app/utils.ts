import { Request } from "express";

export const isMultipartRequest = (req: Request) => {
  const contentTypeHeader = req.headers["content-type"];
  return (
    contentTypeHeader && contentTypeHeader.indexOf("multipart") > -1
  ) as boolean;
};
