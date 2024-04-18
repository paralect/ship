type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends (...args: never[]) => unknown
          ? never
          : `${K}` | (Path<T[K]> extends infer R ? (R extends never ? never : `${K}.${R & string}`) : never)
        : never;
    }[keyof T]
  : never;

export type NestedKeys<T> = Path<Required<T>>;

type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : S extends `${infer P1}${infer P2}`
    ? `${Lowercase<P1>}${CamelCase<P2>}`
    : Lowercase<S>;

export type ToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends object ? ToCamelCase<T[K]> : T[K];
};
