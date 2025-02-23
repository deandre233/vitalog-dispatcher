type Decrement<N extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][N];

// Simplified version using any for deeply nested types
type LimitDepth<T> = {
  [P in keyof T]: T[P] extends object ? any : T[P];
};

type BuildArray<Length extends number, T> = T[];

type Add<A extends number, B extends number> = number;
type Subtract<A extends number, B extends number> = number;