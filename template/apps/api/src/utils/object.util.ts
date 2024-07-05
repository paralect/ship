import _ from 'lodash';

const flattenObject = <T>(obj: object, path: string[] = []): Record<string, T[keyof T]> =>
  !_.isObject(obj)
    ? { [path.join('.')]: obj }
    : Object.entries(obj).reduce((cur, [key, value]) => _.merge(cur, flattenObject<T>(value, [...path, key])), {});

export default {
  flattenObject,
};
