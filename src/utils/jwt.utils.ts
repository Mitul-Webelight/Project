import { JwtPayload, sign, verify } from "jsonwebtoken";
import { appConfig } from "src/config/app.config";
import { expireTime } from "src/constants/constants";

interface TokenPayload extends JwtPayload {
  id?: string;
  token?: string;
}

export const jwtSign = (payload: TokenPayload) =>
  sign(payload, appConfig.jwtSecretKey, {
    expiresIn: expireTime,
  });

export const verifyToken = (token: string): JwtPayload => {
  try {
    return verify(token, appConfig.jwtSecretKey) as JwtPayload;
  } catch {
    throw new Error();
  }
};

export const decodeToken = (authorization: string) => {
  let authToken = authorization;

  if (authorization.includes("Bearer")) {
    [, authToken] = authorization.split(" ");
  }

  const { id } = verifyToken(authToken);

  return { id };
};
