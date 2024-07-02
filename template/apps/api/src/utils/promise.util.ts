import _ from 'lodash';

const promiseLimit = <T>(
  documents: T[],
  limit: number,
  operator: (document: T) => Promise<unknown>
): Promise<void> => {
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
  const queue: (() => Promise<void>)[] = [];

  const runNext = async () => {
    if (!queue.length || activePromises >= limit) return;

    activePromises += 1;
    const task = queue.shift();

    if (!task) return;

    await task();
    activePromises -= 1;

    await runNext();
  };

  documents.forEach((document) => queue.push(() => operator(document)));

  await Promise.all(Array.from({ length: limit }).map(runNext));
};

export default {
  promiseLimit,
  promiseQueue,
};
