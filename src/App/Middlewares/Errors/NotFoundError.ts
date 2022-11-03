import CustomError from "./CustomError";

export default class NotFoundError extends CustomError {
  constructor(name: string, message: string, additionalInfo?: string) {
    super(name, 404, message, additionalInfo);
  }
}
