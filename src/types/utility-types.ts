type Decrement<N extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][N];

type LimitDepth<T, Depth extends number = 3> = {
  [P in keyof T]: T[P] extends object
    ? Depth extends 0
      ? T[P]
      : LimitDepth<T[P], Decrement<Depth>>
    : T[P];
};

// Simple array builder that won't cause infinite recursion
type BuildArray<Length extends number, T> = Length extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  ? T[]
  : T[];

type Add<A extends number, B extends number> = A | B;
type Subtract<A extends number, B extends number> = A | B;