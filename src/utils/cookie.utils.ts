import { CookieName } from "src/constants/enum";
import { Response } from "express";
import { TOKEN_EXPIRE_TIME } from "src/constants/constants";

interface ResponseArg {
  res: Response;
  data: string;
}

interface CookiesArg extends ResponseArg {
  name: CookieName;
}

export const setAuthToken = ({ res, name, data }: CookiesArg) =>
  res.cookie(name, data, {
    maxAge: TOKEN_EXPIRE_TIME,
    secure: true,
    httpOnly: true,
  });
