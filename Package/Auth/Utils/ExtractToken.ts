import CustomError from "./../Errors/CustomError";

export const extractTokenFromHeader = (headerPayload: string | undefined) => {
  if (!headerPayload)
    throw new CustomError(
      "MISSING_TOKEN_HEADER",
      400,
      "Token not found in authorization header"
    );
  const token = headerPayload!.split(" ")[1];
  if (!token)
    throw new CustomError(
      "MISSING_TOKEN_HEADER",
      400,
      "Token not found in authorization header"
    );
  return token;
};
