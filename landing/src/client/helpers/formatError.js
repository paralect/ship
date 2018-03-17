import ApiError from './api/api.error';

const defaultMessage = 'Unexpected error occurred';

export default (err) => {
  if (err instanceof ApiError) {
    if (err.serverError) {
      return defaultMessage;
    } else if (err._status === 400) {
      if (err.data && err.data.errors) {
        let errorText = '';

        err.data.errors.forEach((e) => {
          Object.values(e)
            .forEach((errorValue) => {
              errorText += `${errorValue}\n`;
            });
        });

        return errorText;
      }
      return 'Validation Error';
    }
  }

  return defaultMessage;
};
