/*
  Query Builder for nodejs + express + typescript + postgresql
  Created by: Jon Snow
  Ver: 1.0
  Require Package: @types/pg
*/
import pool from "./../configs/database";
import { converDatetoISO } from "./global";

class Builders {
  public converDateISO(objectData: any = {}) {
    if (Object.keys(objectData).length > 0) {
      let res: any = {};
      Object.keys(objectData).forEach((v) => {
        if (objectData[v] instanceof Date) {
          res[v] = converDatetoISO(objectData[v]);
        } else {
          res[v] = objectData[v];
        }
      });
      return res;
    } else {
      return objectData;
    }
  }

  public async get(
    tableName: string,
    fields: any,
    conditions: any = {},
    orders: any = {},
    joins: any = [],
    limit: number = 0,
    offset: number = 0
  ) {
    let query: string = "";
    try {
      const fieldsConditions: string = this.convertFields(fields);
      const whereConditions: string = this.convertConditions(conditions);
      const joinConditions: string = this.convertJoins(joins);
      const orderConditions: string = this.convertOrders(orders);
      const limitCondition: string = limit > 0 ? ` LIMIT ${limit} ` : "";
      const offsetCondition: string = limit > 0 ? ` OFFSET ${offset} ` : "";
      query = `
        SELECT ${fieldsConditions} 
        FROM ${tableName} 
        ${joinConditions} 
        ${whereConditions}
        ${orderConditions}
        ${limitCondition} ${offsetCondition}
      `;
      // RETURNING
      const conn = await pool.connect();
      // console.log(query);
      const { rows } = await conn.query(query);
      conn.release();
      return rows.map((v) => this.converDateISO(v));
    } catch (err) {
      throw err + "\n sytanx: " + query;
    }
  }
  public async getOne(
    tableName: string,
    fields: any,
    conditions: any = {},
    orders: any = {},
    joins: any = [],
    limit: number = 0,
    offset: number = 0
  ) {
    try {
      const data = await this.get(
        tableName,
        fields,
        conditions,
        orders,
        joins,
        limit,
        offset
      );
      if (data.length > 0) {
        return this.converDateISO(data[0]);
      } else {
        return {};
      }
    } catch (err) {
      throw err;
    }
  }
  public async getCount(tableName: string, conditions: any = {}) {
    try {
      const conn = await pool.connect();
      let whereConditions = this.convertConditions(conditions);
      const { rows } = await pool.query(`
        SELECT COUNT(*) AS count FROM ${tableName} 
        ${whereConditions}
      `);
      conn.release();
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  public async insert(
    tableName: string,
    data: any = {},
    insert: boolean = false
  ) {
    let query: string = "";
    try {
      let fields = "";
      let values = "";
      Object.keys(data).forEach((key: any, i: any) => {
        const comma = i < Object.keys(data).length - 1 ? "," : "";
        fields += key;
        fields += comma;
        if (
          data[key] == null ||
          typeof data[key] == "boolean" ||
          typeof data[key] == "number"
        ) {
          values += `${data[key]}`;
        } else {
          values += `'${data[key]}'`;
        }
        values += comma;
      });
      query = `
        INSERT INTO ${tableName} 
        (${fields}) VALUES (${values});
      `;
      // RETURNING
      if (insert) {
        return await this.manual(query);
      } else {
        return query;
      }
    } catch (err) {
      throw err + "\n sytanx: " + query;
    }
  }
  public async update(
    tableName: string,
    data: any,
    conditions: any,
    doUpdate: boolean = false
  ) {
    let query: string = "";
    try {
      let fields = "";
      let whereConditions = this.convertConditions(conditions);
      Object.keys(data).forEach((key: any, i: any) => {
        let value = data[key];
        if (typeof value === "string") {
          value = `'${value}'`;
        }
        fields += ` ${key} = ${value} `;
        fields += i < Object.keys(data).length - 1 ? "," : "";
      });
      query = `
        UPDATE ${tableName} SET ${fields} 
        ${whereConditions};
      `;
      // RETURNING
      if (doUpdate) {
        return await this.manual(query);
      } else {
        return query;
      }
    } catch (err) {
      throw err + "\n sytanx: " + query;
    }
  }
  public async delete(tableName: string, conditions: any) {
    let query: string = "";
    try {
      const conn = await pool.connect();
      let whereConditions = this.convertConditions(conditions);
      query = `
        DELETE FROM ${tableName} ${whereConditions}
      `;
      // RETURNING
      const { rows } = await conn.query(query);
      conn.release();
      return rows;
    } catch (err) {
      throw err + "\n sytanx: " + query;
    }
  }
  public async manual(query: string) {
    try {
      const conn = await pool.connect();
      // console.log(query);
      const { rows } = await conn.query(query);
      conn.release();
      return rows;
    } catch (err) {
      throw err + "\n sytanx: " + query;
    }
  }
  // EACH LIBRARIES
  private convertFields(fields: any = []) {
    let callback = fields.length > 0 ? "" : "*";
    fields.forEach((v: String, i: Number) => {
      const arr = v.split(".");
      if (typeof arr[1] == "undefined") {
        v = `"${v}"`;
      }
      callback += v;
      // callback += i < fields.length - 1 ? "," : "";
    });
    return callback;
  }
  private convertConditions(conditions: any = {}) {
    let callback = Object.keys(conditions).length > 0 ? " WHERE " : "";
    Object.keys(conditions).forEach((key, index) => {
      if (typeof conditions[key] === "string") {
        conditions[key] = `'${conditions[key]}'`;
      }
      callback += `${key} = ${conditions[key]}`;
      callback += index < Object.keys(conditions).length - 1 ? " AND " : "";
    });
    return callback;
  }
  private convertJoins(joins: any = []) {
    let callback = "";
    joins.forEach((v: any, i: Number) => {
      let type = "LEFT";
      if (v.type != undefined) {
        type = v.type.toUpperCase();
      }
      callback += ` ${type} JOIN ${v.target} ON ${v.condition}\n`;
    });
    return callback;
  }
  private convertOrders(orders: any = []) {
    let callback = Object.keys(orders).length > 0 ? " ORDER BY " : "";
    Object.keys(orders).forEach((key, index) => {
      callback += `${key} ${orders[key].toUpperCase()}`;
      callback += index < Object.keys(orders).length - 1 ? "," : "";
    });
    return callback;
  }

  public async multiInsert(tableName: string, data: Array<{}>) {
    let query: string = "";
    const conn = await pool.connect();
    try {
      data.forEach((val: any) => {
        let fields = "";
        let values = "";
        Object.keys(val).forEach((key: any, i: any) => {
          const comma = i < Object.keys(val).length - 1 ? "," : "";
          fields += key;
          fields += comma;
          values += `'${val[key]}'`;
          values += comma;
        });
        query += `INSERT INTO ${tableName} (${fields}) VALUES (${values}); \n`;
      });

      await conn.query("BEGIN");
      await conn.query(query);
      await conn.query("COMMIT");
      // RETURNING
      conn.release();
      return true;
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err + "\n sytanx: " + query;
    }
  }
  public paginationLimitOffsetStr(page: number = 1) {
    let limit: number = 10;
    if (page <= 0) page = 1;
    return ` limit ${limit} offset ${(page - 1) * limit}`;
  }
  public orCondition(column:any = [], search: string = "") {
    let condition: string = "";
    condition += ` and (`;
    for (let index = 0; index < column.length; index++) {
      if(index!=0)condition += " or";
      condition += ` lower(${column[index]}) like lower('%${search}%')`;
    }
    condition += ` )`;
    return condition;
  }
}
export = new Builders();
