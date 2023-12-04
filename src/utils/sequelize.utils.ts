import { Op } from "sequelize";
export interface SequelizeOrConditionInterface<T> {
  [Op.and]:{
    [Op.or]:T
  }  
}

export class SequelizeUtils {
  sequelizeOrCondition(columns:string[],query:string=""){ 
    if(query == ""||query==null||query==undefined)return {};
    let conditions:SequelizeOrConditionInterface<{[x:string]:{[Op.iLike]:string}}[]>  = {
      [Op.and]: {
        [Op.or]: [],
      },
    };
    for (let cond of columns) {
      const condition = {
          [cond]: {
              [Op.iLike]: `%${query}%`,
          },
      };
      conditions[Op.and][Op.or].push(condition);
  }
    return conditions;
  }
}
