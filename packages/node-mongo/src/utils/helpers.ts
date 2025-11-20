import * as _ from 'lodash';
import { ObjectId, UpdateFilter } from 'mongodb';
import { GetPrivateProjectionParams } from 'src/types';

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

const omitPrivateFields = <T>(
  doc: T,
  privateFields?: string[],
): T => {
  if (!doc) return doc;

  return _.omit(doc, privateFields || []) as T;
};

const getPrivateFindOptions = (params: GetPrivateProjectionParams) => {
  const { findOptions, privateFields, mode } = params;

  if (mode === 'private' && privateFields?.length) {
    return { 
      ...findOptions, 
      projection: { 
        ...findOptions.projection,
        ...privateFields.reduce((acc: Record<string, number>, key: string) => {
          acc[key] = 0;

          return acc;
        }, {}),
      },
    };
  }

  return findOptions;
};

export { deepCompare, generateId, addUpdatedOnField, omitPrivateFields, getPrivateFindOptions };
