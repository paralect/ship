import _ from 'lodash';

type NonNullableObject = Record<string, unknown>;

export const toCamelCase = <T extends NonNullableObject | null | undefined>(object: T): T => {
  if (object === null || object === undefined) {
    return object;
  }

  const transformObject = (input: NonNullableObject): NonNullableObject =>
    _.transform(input, (result: NonNullableObject, value, key) => {
      const camelKey = _.camelCase(key);

      if (_.isObject(value) && !_.isArray(value)) {
        result[camelKey] = transformObject(value as NonNullableObject);
      } else if (_.isArray(value)) {
        result[camelKey] = value.map((item) => (_.isObject(item) ? transformObject(item as NonNullableObject) : item));
      } else {
        result[camelKey] = value;
      }
    });

  return _.isObject(object) && !_.isArray(object) ? (transformObject(object as NonNullableObject) as T) : object;
};
