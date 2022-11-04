export default class CustomError {
  name!: string;
  status!: number;
  message?: string;
  additionalInfo?: any;
  constructor(
    name: string,
    status: number = 500,
    message: string,
    additionalInfo: any = {}
  ) {
    this.name = name;
    this.status = status;
    this.message = message;
    this.additionalInfo = additionalInfo;
  }
}
