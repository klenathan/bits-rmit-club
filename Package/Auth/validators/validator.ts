import { plainToInstance } from "class-transformer";
import classvld, { validate } from "class-validator";
import CustomError from "../Errors/CustomError";

/**
 * Utilities class which provides methods to validate request body
 */
export default class RequestBodyValidator {
  public validator;
  constructor() {
    this.validator = classvld;
  }
  /**
   * This method will create an instance from the request body and compare it with the DTO, throw a 400 INVALID_REQUEST_BODY error if the validation failed
   * @param dto - Dto to validate against the request body
   * @param reqBody - Request body payload
   * @param strict - Allow skip required fields
   */
  public async validateRequest(
    dto: any,
    reqBody: any,
    strict: boolean
  ): Promise<void> {
    const entity: object = plainToInstance(dto, reqBody);
    const errors = await validate(entity, {
      skipMissingProperties: !strict,
    });
    let errorTexts = Array();

    if (errors.length > 0) {
      for (const err of errors) {
        errorTexts = errorTexts.concat(err.constraints);
      }
      throw new CustomError(
        "INVALID_REQUEST_BODY",
        400,
        "Errors in request body",
        errorTexts
      );
    }
  }
}
