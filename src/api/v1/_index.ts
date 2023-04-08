import express,{Request,Response} from "express";
import dotenv from "dotenv";
import _authorization from "../../../middleware/authorization";

// ROUTES
import AuthRoutes from "./auth";
import BaseSimpleRoutes from "./_base_simple";

dotenv.config({
  path: ".env",
});
class ApiV1 {
  public app = express();

  constructor() {
    this.app = express();
    this.routerConfig();
  }
  private routerConfig() {
    this.app.get('/', (req: Request, res: Response) => {
        res.json({
          appName: 'Node Base API and CronJob',
          version: process.env.APP_VERSION,
        })
      });
    this.app.use("/auth", _authorization.initWithoutAuthorize, AuthRoutes);
    
    // THIS JUST SAMPLE AND MUST BE ERROR!!
    this.app.use("/base_simpe", _authorization.initAuthorize, BaseSimpleRoutes);
    
  }
}
export = new ApiV1().app