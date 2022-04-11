class MongoServiceError extends Error {
  static NOT_FOUND = 'NOT_FOUND';

  static INVALID_SCHEMA = 'INVALID_SCHEMA';

  static MORE_THAN_ONE = 'MORE_THAN_ONE';

  name: string;

  code: string;

  error: any;

  constructor(code: string, message: string, error?: any) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.code = code;
    this.error = error;
  }
}

export default MongoServiceError;
