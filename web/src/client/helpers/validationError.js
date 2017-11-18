class ValidationError extends Error {
  constructor(message, fileName, lineNumber) {
    const messageString = typeof message === 'string'
      ? message
      : JSON.stringify(message);

    super(messageString, fileName, lineNumber);

    this.response = {
      data: message,
    };
  }
}

export default ValidationError;
