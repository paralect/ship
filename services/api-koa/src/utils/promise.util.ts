import _ from 'lodash';

const promiseLimit = (documents: unknown[], limit: number, operator: (doc: any) => any): Promise<void> => {
  const chunks = _.chunk(documents, limit);

  return chunks.reduce((init: any, chunk) => {
    return init.then(() => {
      return Promise.all(chunk.map((c) => operator(c)));
    });
  }, Promise.resolve());
};

export default {
  promiseLimit,
};
