import db from "../../../helpers/queryBuilder";

class BaseSimpleModel {
  private search_column = ["kode", "name"];
  private column = ["id", "kode", "name"];
  private orders = " order by name asc";
  private table = "brand";

  async insert(data: any) {
    try {
      return await db.insert(this.table, data,true);
    } catch (error) {
      throw error;
    }
  }
  async update(data: any, id: any) {
    try {
      return await db.update(this.table, data, { id: id },true);
    } catch (error) {
      throw error;
    }
  }
  async getById(id: string = "") {
    try {
      const resp: any = await db.getOne(this.table,this.column,{id,deleted:false});
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async getDataAll(search: string = "") {
    try {
      let condition: string = "";
      if (search != "") {
        condition = db.orCondition(this.search_column, search);
      }
      const resp: any = await db.manual(`
                select  ${this.column.join()} from ${this.table}
                where deleted = false
                ${condition} ${this.orders}
            `);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async getDataPagination(page: number = 1, search: string = "") {
    try {
      const limit = db.paginationLimitOffsetStr(page);
      let condition: string = "";
      if (search != "") {
        condition = db.orCondition(this.search_column, search);
      }
      const resp: any = await db.manual(`
                select  ${this.column.join()} from ${this.table}
                where deleted = false
                ${condition} ${this.orders} ${limit}
            `);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async countDataPagination(search: string = "") {
    try {
      let condition: string = "";
      if (search != "") {
        condition = db.orCondition(this.search_column, search);
      }
      const resp: any = await db.manual(`
                select  count(1) from  ${this.table}
                where deleted = false 
                ${condition}
            `);
      return resp[0].count;
    } catch (error) {
      throw error;
    }
  }
}

export = new BaseSimpleModel();
