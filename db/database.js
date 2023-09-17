import mysql from "mysql2";
import { config } from "../config.js";
import SQ from "sequelize";
const { host, user, database, password, port } = config.db;
export const sequelize = new SQ.Sequelize(database, user,password,{
  host, dialect:"mysql"
});
const pool = mysql.createPool({ host, user, database, password, port });
export const db = pool.promise();
