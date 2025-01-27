export type BuildArray<Length extends number, T> = {
    [K in Length]: T;
};

export type Add<A extends number, B extends number> = [...BuildArray<A, 1>, ...BuildArray<B, 1>]['length'];
export type Subtract<A extends number, B extends number> = BuildArray<A, 1> extends [...BuildArray<B, 1>, ...infer R] ? R['length'] : never;

export type LimitDepth<T, Depth extends number = 3> = Depth extends 0
  ? never
  : T extends object
  ? {
      [P in keyof T]: LimitDepth<T[P], Subtract<Depth, 1>>
    }
  : T;