type Decrement<N extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][N];

export type DeepRecursive<T, Depth extends number = 10> = Depth extends 0
  ? T
  : T | { next: DeepRecursive<T, Decrement<Depth>> };

export type LimitDepth<T, Depth extends number = 3> = Depth extends 0
  ? T
  : T extends object
  ? {
      [P in keyof T]: LimitDepth<T[P], Decrement<Depth>>
    }
  : T;

// Simple array builder that won't cause infinite recursion
export type BuildArray<Length extends number, T> = Length extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  ? T[]
  : T[];

export type Add<A extends number, B extends number> = A | B;
export type Subtract<A extends number, B extends number> = A | B;