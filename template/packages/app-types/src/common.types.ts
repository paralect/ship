type Path<T> = T extends object ? {
  [K in keyof T]: K extends string
    ? `${K}` | (Path<T[K]> extends infer R ? (R extends never ? never : `${K}.${R & string}`) : never)
    : never
}[keyof T] : never;

export type NestedKeys<T> = Path<Required<T>>;
