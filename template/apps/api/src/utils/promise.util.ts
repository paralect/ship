import _ from 'lodash';

const promiseLimit = <T>(
  documents: T[],
  limit: number,
  operator: (document: T) => Promise<unknown>,
): Promise<void> => {
  const chunks = _.chunk(documents, limit);

  return chunks.reduce<Promise<void>>(async (previousPromise, chunk) => {
    await previousPromise;

    const operations = chunk.map(operator);

    await Promise.all(operations);
  }, Promise.resolve());
};

export default {
  promiseLimit,
};
