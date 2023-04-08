import { Request, Response, Router } from "express";
import {
  setMessage,
  val_xss,
} from "../../../helpers/global";
const { compareSync } = require("bcrypt");
import _model from "../../models/v1/users";
import _helper from "../../../middleware/helper";
class AuthRoutes {
  private _router = Router();

  get router() {
    return this._router;
  }
  constructor() {
    this._configure();
  }
  private _configure() {
    this._router.post("/login", async (req: Request, res: Response) => {
      try {
        let post = {
          username: val_xss(req.body.username),
          password: val_xss(req.body.password),
        };
        const user: any = await _model.getUserByUsername(post.username);
        if (Object.keys(user).length <= 0)
          return setMessage(res, 401, "User is not found!");
        const compared = compareSync(post.password, user.password);
        if (!compared) {
          return setMessage(res, 401, "Username and password does not match");
        }
        const token = await _helper.genToken({
            id_user: user.id_user,
            username: user.username,
            id_role: user.id_role??"admin",
            role_name: user.role_name??"admin",
          });
        return setMessage(res, 200, "Login success", {
          access_token: token,
        });
      } catch (error) {
        console.log(error);
        return setMessage(res, 400, "Terjadi kesalahan", error);
      }
    });
  }
}

export = new AuthRoutes().router;
