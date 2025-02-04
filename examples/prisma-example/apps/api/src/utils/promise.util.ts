import _ from 'lodash';

const promiseLimit = <T>(documents: T[], limit: number, operator: (document: T) => Promise<unknown>): Promise<void> => {
  const chunks = _.chunk(documents, limit);

  return chunks.reduce<Promise<void>>(async (previousPromise, chunk) => {
    await previousPromise;

    const operations = chunk.map(operator);

    await Promise.all(operations);
  }, Promise.resolve());
};

const promiseQueue = async <T>(
  documents: T[],
  limit: number,
  operator: (document: T) => Promise<void>,
): Promise<void> => {
  let activePromises = 0;
  let currentIndex = 0;

  const runNext = async () => {
    if (currentIndex >= documents.length || activePromises >= limit) {
      return;
    }

    activePromises += 1;
    const task = operator(documents[(currentIndex += 1)]);

    task.finally(() => {
      activePromises -= 1;
      runNext();
    });

    if (activePromises < limit) {
      runNext();
    }
  };

  runNext();

  await Promise.all(Array.from({ length: Math.min(limit, documents.length) }, runNext));
};

export default {
  promiseLimit,
  promiseQueue,
};
