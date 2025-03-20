import _ from 'lodash';

const flattenObject = <T>(obj: object, path: string[] = []): Record<string, T[keyof T]> =>
  _.isObject(obj)
    ? Object.entries(obj).reduce((cur, [key, value]) => _.merge(cur, flattenObject<T>(value, [...path, key])), {})
    : { [path.join('.')]: obj };

export default {
  flattenObject,
};
