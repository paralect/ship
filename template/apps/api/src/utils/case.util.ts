import { camelCase, isArray, isObject, transform } from 'lodash';

type NonNullableObject = Record<string, unknown>;

export const toCamelCase = <T extends NonNullableObject | null | undefined>(object: T): T => {
  if (object === null || object === undefined) {
    return object;
  }

  const transformObject = (input: NonNullableObject): NonNullableObject =>
    transform(input, (result: NonNullableObject, value, key) => {
      const camelKey = camelCase(key);

      if (isObject(value) && !isArray(value)) {
        result[camelKey] = transformObject(value as NonNullableObject);
      } else if (isArray(value)) {
        result[camelKey] = value.map((item) => (isObject(item) ? transformObject(item as NonNullableObject) : item));
      } else {
        result[camelKey] = value;
      }
    });

  return isObject(object) && !isArray(object) ? (transformObject(object as NonNullableObject) as T) : object;
};
