import { Request, Response, Router } from "express";
import {
  setMessage,
  paginationScrapperSearchPage,
  paginationScrapper,
} from "../../../helpers/global";
import _helper from "../../../middleware/helper";
import { get } from "../../../helpers/api_client";
import { load } from "cheerio";

class BaseScrapper {
  private _router = Router();
  private _uri = "";
  get router() {
    return this._router;
  }
  constructor() {
    this._configure();
  }
  private _configure() {
    this._router.get("/", async (req: Request, res: Response) => {
      try {
        const limit: any = paginationScrapperSearchPage(req);
        const resp = await get(this._uri + limit.str);
        let response: any = {};
        if (resp != "") {
          const $ = load(resp);

          // YOUR FUCKING DATA MUST BE HERE!
          const total_page = 0;
          const current_page = 0;
          const data: any = [];
          response = paginationScrapper(total_page, current_page, data);

          return setMessage(res, 200, "Success get data", response);
        } else {
          return setMessage(res, 404, "Cannot get data", null);
        }
      } catch (error) {
        return setMessage(res, 400, "Terjadi kesalahan", error);
      }
    });
  }
}

export = new BaseScrapper().router;
