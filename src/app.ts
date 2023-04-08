import express,{Request,Response} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors = require("cors");
import _authorization from "../middleware/authorization";
const path = require('path');
const { genSaltSync, hashSync } = require("bcrypt");

// APP
import ApiV1 from "./api/v1/_index"

dotenv.config({
  path: ".env",
});
class Server {
  public app = express();

  constructor() {
    this.app = express();
    this.config();
    this.routerConfig();
  }
  private config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: "3mb" }));
    this.app.use(cors());
  }
  private routerConfig() {
    
    this.app.get('/cdn/:dir/:dir/:dir/:file?', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname + '/..'+ req.originalUrl));
    })
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        appName: 'Node Base API and CronJob',
        version: process.env.APP_VERSION
      })
    });
    this.app.get('/gen_password/:password', (req: Request, res: Response) => {
      let password:any = hashSync(req.params.password,genSaltSync(10));
      res.json({
        hash: password,
        pass:req.params.password
      })
    });
    this.app.use("/api/v1",ApiV1);
    
    this.app.use(function(_: Request, res: Response){
      res.json({
        message: 'Ooppss api is not found',
        code:404,
        success:false
      }).status(404);
    });
  }
}
const server = new Server();
((port = process.env.APP_PORT || 3000) => {
  server.app.listen(port);
  console.log("server is running on port :" + port);
})();
