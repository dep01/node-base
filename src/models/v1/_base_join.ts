import db from "../../../helpers/queryBuilder";

class BaseJoinModel {
  private search_column = ["username"];
  private search_join_column = [
    "b.first_name",
    "b.last_name",
    "b.phone",
    "b.mail",
    "b.address",
    "c.role_name",
  ];
  private column = ["username", "id_role", "id"];
  private column_join = [
    "b.first_name",
    "b.last_name",
    "b.phone",
    "b.mail",
    "b.address",
  ];
  private orders = " order by users.username asc";
  private join_table = ` left join user_profile b on users.id = b.id_user
                         left join user_role c on users.id_role = c.id`;
  private default_condition = ` where users.deleted = false`;
  private table = "users";

  async insert(data: any) {
    try {
      return await db.insert(this.table, data, true);
    } catch (error) {
      throw error;
    }
  }
  async update(data: any, id: any) {
    try {
      return await db.update(this.table, data, { id: id }, true);
    } catch (error) {
      throw error;
    }
  }
  async getById(id: string = "") {
    try {
      const resp: any = await db.getOne(this.table, this.column, {
        id,
        deleted: false,
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }
  async getDataAll(search: string = "") {
    try {
      let condition: string = "";
      if (search != "") {
        condition = db.orCondition(
          this.search_column.concat(this.search_join_column),
          search
        );
      }
      const resp: any = await db.manual(`
                select  ${this.column.concat(this.column_join).join()} from ${
        this.table
      }
                ${this.default_condition}
                and b.deleted = false
                and c.deleted = false
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
        condition = db.orCondition(
          this.search_column.concat(this.search_join_column),
          search
        );
      }
      const resp: any = await db.manual(`
                select  ${this.column.concat(this.column_join).join()} from ${
        this.table
      }
                ${this.join_table}
                ${this.default_condition}
                and b.deleted = false
                and c.deleted = false
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
        condition = db.orCondition(
          this.search_column.concat(this.search_join_column),
          search
        );
      }
      const resp: any = await db.manual(`
                select  count(1) from ${this.table}
                ${this.join_table}
                ${this.default_condition}
                and b.deleted = false
                and c.deleted = false
                ${condition}
            `);
      return resp[0].count;
    } catch (error) {
      throw error;
    }
  }
}

export = new BaseJoinModel();
