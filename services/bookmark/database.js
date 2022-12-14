import * as mysql from "mysql";

export const connection = mysql.createConnection({
  host: process.env.HNAPP_DB_HOST,
  user: process.env.HNAPP_DB_USER,
  password: process.env.HNAPP_DB_PASSWORD,
  database: process.env.HNAPP_DB_NAME,
});

