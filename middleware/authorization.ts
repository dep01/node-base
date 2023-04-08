import { Request, Response, NextFunction } from "express";
const { verify } = require("jsonwebtoken");
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

class Authorization {
  initWithoutAuthorize(req: Request, res: Response, next: NextFunction) {
    let content_type = req.get("content-type");
    if (content_type == "application/json") {
      next();
    } else {
      return res.status(401).json({
        statusCode: 401,
        message: "Header must be application/json!",
      });
    }
  }

  initAuthorize(req: Request, res: Response, next: NextFunction) {
    let content_type = req.get("content-type");
    if (content_type == "application/json") {
      let authorize = req.get("authorization");
      if (authorize) {
        const token = authorize.slice(7);
        verify(
          token,
          process.env.SECRET_KEY,
          async (err: any, decoded: any) => {
            if (err) {
              return res.status(401).json({
                statusCode: 401,
                message: "Invalid access token!",
              });
            }
            next();
          }
        );
      } else {
        return res.status(401).json({
          statusCode: 401,
          message: "Invalid access token!",
        });
      }
    } else {
      return res.status(401).json({
        statusCode: 401,
        message: "Header must be application/json!",
      });
    }
  }
}
export = new Authorization();
