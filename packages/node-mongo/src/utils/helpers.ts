import * as _ from 'lodash';
import { ObjectId, UpdateFilter } from 'mongodb';

const deepCompare = (
  data: unknown,
  initialData: unknown,
  properties: Array<string | Record<string, unknown>>,
): boolean => properties.some((prop) => {
  let isChanged;

  if (typeof prop === 'string') {
    const value = _.get(data, prop);
    const initialValue = _.get(initialData, prop);

    isChanged = !_.isEqual(value, initialValue);
  } else {
    isChanged = Object.keys(prop).every((p) => {
      const value = _.get(data, p);
      const initialValue = _.get(initialData, p);

      return _.isEqual(value, prop[p]) && !_.isEqual(initialValue, prop[p]);
    });
  }

  return isChanged;
});

const generateId = (): string => {
  const objectId = new ObjectId();

  return objectId.toHexString();
};

const addUpdatedOnField = <T>(update: UpdateFilter<T>): UpdateFilter<T> => {
  const setCommand = update.$set || {};

  return {
    ...update,
    $set: { ...setCommand, updatedOn: new Date() },
  } as unknown as UpdateFilter<T>;
};

export { deepCompare, generateId, addUpdatedOnField };
