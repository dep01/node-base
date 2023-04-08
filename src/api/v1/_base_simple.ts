import { Request, Response, Router } from "express";
import {
  setMessage,
  val_xss,
  genUUID,
  genToday,
  paginationLimitOffsetSearch,
  pagination,
  validateInput,
  validateUpdate,
} from "../../../helpers/global";
import _model from "../../models/v1/_base_simple";
import _helper from "../../../middleware/helper";

class BaseSimple {
  private _router = Router();
  private default_insert: any = {
    id: genUUID(),
    created_date: genToday(true),
  };
  private required_field = [
    "id_role",
    "username",
    "password",
  ];
  private updated_field =[
    "username",
    "password"
  ]
  get router() {
    return this._router;
  }
  constructor() {
    this._configure();
  }
  private _configure() {
    this._router.get("/", async (req: Request, res: Response) => {
      try {
        const limit: any = paginationLimitOffsetSearch(req);
        let total_data: number = await _model.countDataPagination(limit.search);
        let data: any = await _model.getDataPagination(
          limit.page,
          limit.search
        );
        let response: any = pagination(
          total_data,
          limit.page,
          limit.limit,
          data
        );
        return setMessage(res, 200, "Success get data", response);
      } catch (error) {
        return setMessage(res, 400, "Terjadi kesalahan", error);
      }
    });
    this._router.get("/:id", async (req: Request, res: Response) => {
      try {
        let data: any = await _model.getById(val_xss(req.params.id));
        return setMessage(res, 200, "Success get data", data);
      } catch (error) {
        return setMessage(res, 400, "Terjadi kesalahan", error);
      }
    });

    this._router.post("/", async (req: Request, res: Response) => {
      try {
        let post: any = req.body;
        let key: any = Object.keys(post);
        if (key.length <= 0)
          return setMessage(
            res,
            400,
            `Data ${this.required_field.join()} tidak boleh kosong`
          );
        const validate = validateInput(this.required_field, post);
        if (!validate.success) return setMessage(res, 400, validate.message);
        let insert: any = validate.insert;
        const token = await _helper.decodeToken(req);
        insert = {
          ...insert,
          ...this.default_insert,
          created_by: token?.username ?? "",
        };
        await _model.insert(insert);
        return setMessage(res, 200, "Data succes inserted", insert);
      } catch (error: any) {
        return setMessage(res, 400, error, error);
      }
    });
    this._router.put("/:id", async (req: Request, res: Response) => {
      try {
        let post: any = req.body;
        let key: any = Object.keys(post);
        if (key.length <= 0)
          return setMessage(res, 400, `Tidak ada data yang di update`);
        let update:any = validateUpdate(this.updated_field,post)
        const token = await _helper.decodeToken(req);
        const id: any = val_xss(req.params.id);

        // THIS IS FOR ADDING OTHER FIELD
        update.updated_by = token?.username ?? "";
        update.updated_date = genToday(true);

        // THIS IS USE IF SOME FIELD IS NOT TO BE UPDATE
        // delete update.device_name;
        
        await _model.update(update, id);
        return setMessage(res, 200, "Data success updated", update);
      } catch (error) {
        return setMessage(res, 400, "Terjadi kesalahan", error);
      }
    });
    this._router.delete("/:id", async (req: Request, res: Response) => {
      try {
        const token = await _helper.decodeToken(req);
        const id: any = val_xss(req.params.id);
        let post: any = {
          deleted: true,
          updated_by: token?.username ?? "",
          updated_date: genToday(true),
        };
        await _model.update(post, id);
        return setMessage(res, 200, "Data success deleted", post);
      } catch (error) {
        return setMessage(res, 400, "Terjadi kesalahan", error);
      }
    });
   
  }
}

export = new BaseSimple().router;
