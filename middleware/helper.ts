import { sign, decode } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request } from "express";

dotenv.config({ path: __dirname + "/.env" });

interface TokenField {
  id_user: string;
  username: string;
  id_role: string;
  role_name: string;
}
class Helpers {
  async genToken(data: TokenField) {
    const key: any = process.env.SECRET_KEY;
    return sign(data, key);
  }
  async decodeToken(req: Request) {
    let authorize = req.get("authorization");
    if (authorize) {
      let tokenstr: any = decode(authorize.slice(7));
      let token: TokenField = {
        id_user: tokenstr.id_user,
        id_role: tokenstr.id_role,
        role_name: tokenstr.role_name,
        username: tokenstr.username,
      };
      return token;
    } else {
      return null;
    }
  }
}
export = new Helpers()