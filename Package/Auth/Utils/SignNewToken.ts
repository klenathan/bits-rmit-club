import jwt from "jsonwebtoken";
import CustomError from "./../Errors/CustomError";
import dotenv from "dotenv";
dotenv.config();
interface ISignTokenOptions {
  expiresIn?: string | number;
  algorithms?: jwt.Algorithm;
  issuer: string;
  audience: string;
  tokenType: "refresh" | "access";
}

// Sign new token function
export const signNewToken = async (
  payload: Object,
  options: ISignTokenOptions
): Promise<string> => {
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.APP_SECRET as string,
      {
        subject: options.tokenType,
        issuer: options.issuer,
        audience: options.audience,
        algorithm: options.algorithms,
        expiresIn: options.expiresIn,
      },
      (err, refreshToken) => {
        if (err) reject(null);
        resolve(refreshToken);
      }
    );
  });
  if (!token)
    throw new CustomError(
      "TOKEN_GEN_ERR",
      500,
      `Error when generating ${options.tokenType}Token`
    );
  return token as string;
};
