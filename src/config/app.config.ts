import { config } from "dotenv";

config();

export const appConfig = {
  port: process.env.PORT,
  db_Url: process.env.DB_CONNECTION_URL,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
