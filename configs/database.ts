require('dotenv').config()
import pg from 'pg';
pg.types.setTypeParser(1114, function(stringValue) {
  // return stringValue;  //1114 for time without timezone type
  return new Date(stringValue + "+0000");;  //1114 for time without timezone type
});

pg.types.setTypeParser(1082, function(stringValue) {
  return stringValue;  //1082 for date type
});

const port: any = process.env.DB_PORT
export default new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(port),
  max: 20,
  idleTimeoutMillis: 30000
});