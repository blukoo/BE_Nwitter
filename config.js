import dotenv from "dotenv";
dotenv.config();

export const config = {
  jwt: {
    secretKey: process.env.JWT_SECRET,
    expireInSec: parseInt(process.env.BCRYRT_SALT_ROUNDS),
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYRT_SALT_ROUNDS),
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  },
};
