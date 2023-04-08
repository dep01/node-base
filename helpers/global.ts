import { Response, Request } from "express";
import { uuid } from "uuidv4";
import dateformat = require("dateformat");
import xss from "xss";
import fs from "fs";

require("dotenv").config();

var base64Img = require("base64-img");
import Builders from "./queryBuilder";

const HOST_CDN = process.env.APP_HOST_CDN;

const converDatetoISO = (value: any) => {
  return dateformat(value, "isoDateTime").replace("+0700", "Z");
};

const leadingZero = (value: any) => {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
};

const genUUID = () => {
  return uuid();
};

const toSqlDate = (d: any, withTime: boolean = false) => {
  let date = new Date(d);
  let year = date.getFullYear();
  let month = leadingZero(date.getMonth() + 1);
  let day = leadingZero(date.getDate());
  let callback = year + "-" + month + "-" + day;
  if (withTime) {
    let hour = leadingZero(date.getHours());
    let min = leadingZero(date.getMinutes());
    let sec = leadingZero(date.getSeconds());
    callback += " " + hour + ":" + min + ":" + sec;
  }
  return callback;
};

const addZeroBefore = (value: any) => {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
};

const genToday = (withTime: boolean = false) => {
  let dateGmt = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  let date = new Date(dateGmt);
  let callback =
    date.getFullYear() +
    "-" +
    addZeroBefore(date.getMonth() + 1) +
    "-" +
    addZeroBefore(date.getDate());
  if (withTime) {
    callback +=
      " " +
      addZeroBefore(date.getHours()) +
      ":" +
      addZeroBefore(date.getMinutes()) +
      ":" +
      addZeroBefore(date.getSeconds());
  }
  return callback;
};

const genSqlDate = (date: Date, withTime: boolean = false) => {
  let callback =
    date.getFullYear() +
    "-" +
    addZeroBefore(date.getMonth() + 1) +
    "-" +
    addZeroBefore(date.getDate());
  if (withTime) {
    callback +=
      " " +
      addZeroBefore(date.getHours()) +
      ":" +
      addZeroBefore(date.getMinutes()) +
      ":" +
      addZeroBefore(date.getSeconds());
  }
  return callback;
};

const setMessage = (
  res: Response,
  statusCode: number,
  message: String,
  callback: any = null
) => {
  let success: boolean = false;
  if (statusCode == 200 || statusCode == 201) success = true;
  res.status(statusCode).json({
    code: statusCode,
    success,
    message: message,
    data: callback,
  });
};

const genMonth = (month: any) => {
  let callback = month;
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  months.forEach((v: string, i: number) => {
    if (parseInt(month) == i + 1) {
      callback = v;
    }
  });
  return callback;
};
const beautifyDate = (d: any, withTime: boolean = false) => {
  let date = new Date(d);
  let year = date.getFullYear();
  let month = addZeroBefore(date.getMonth() + 1);
  let day = date.getDate();
  let callback = day + " " + genMonth(month.toString()) + " " + year;
  if (withTime) {
    let hour = addZeroBefore(date.getHours());
    let min = addZeroBefore(date.getMinutes());
    callback += " " + hour + ":" + min;
  }
  return callback;
};
const val_xss = (value: any) => {
  return xss(value);
};
const pagination = (
  total_data: number = 0,
  current_page: number = 1,
  limit: number = 10,
  data: any = []
) => {
  return {
    total_page:
      Math.ceil(total_data / limit) <= 0 ? 1 : Math.ceil(total_data / limit),
    current_page,
    data,
    record: data.length,
  };
};

const paginationLimitOffsetSearch = (req: Request) => {
  let page = req.query.page ? parseInt(val_xss(req.query.page.toString())) : 1;
  let limit = req.query.limit
    ? parseInt(val_xss(req.query.limit.toString()))
    : 10;
  let search = req.query.search ?? "";
  if (page <= 0) page = 1;
  return { limit, offset: (page - 1) * limit, search, page };
};

const uploadImage = (
  base64Image: string,
  dirPath: string,
  filename: string
) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  let resp = base64Img.imgSync(base64Image, dirPath, filename);
  return resp;
};

const loadImage = (dirpath: string, filename: any) => {
  return `${HOST_CDN}/${dirpath}/${filename}`;
};
const validateInput = (column: any = [], post: any) => {
  let empty_field: any = [];
  let key: any = Object.keys(post);
  let insert: any = {};
  for (let index = 0; index < column.length; index++) {
    var found: boolean = false;
    insert[column[index]] = post[column[index]];
    for (let index_post = 0; index_post < key.length; index_post++) {
      if (key[index_post] == column[index]) {
        if (post[key[index_post]] != null && post[key[index_post]] != "") {
          found = true;
        }
      }
    }
    if (!found) empty_field.push(column[index]);
  }
  for (let index = 0; index < empty_field.length; index++) {
    empty_field[index] = empty_field[index].replace(/_/g, " ");
  }
  return {
    success: empty_field.length > 0 ? false : true,
    message: `Data ${empty_field.join()} tidak boleh kosong!`,
    insert,
  };
};
const validateUpdate = (column: any = [], post: any) => {
  let key: any = Object.keys(post);
  let update: any = {};
  for (let index = 0; index < key.length; index++) {
    var find: any = column.find((val: any) => val == key[index]);
    if (find) {
      if (post[key[index]] != null && post[key[index]] != "") {
        update[key[index]] = post[key[index]];
      }
    }
  }
  return update;
};
export {
  leadingZero,
  genUUID,
  converDatetoISO,
  toSqlDate,
  genToday,
  addZeroBefore,
  setMessage,
  beautifyDate,
  val_xss,
  genSqlDate,
  pagination,
  paginationLimitOffsetSearch,
  uploadImage,
  loadImage,
  validateInput,
  validateUpdate,
};
