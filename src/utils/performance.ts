import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

export function useMemoizedCallback<T extends (...args: never[]) => void>(
  callback: T,
  dependencies: unknown[]
): T {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useCallback(
    ((...args) => {
      ref.current(...args);
    }) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );
}

export function useThrottledCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
          timeoutRef.current = undefined;
        }, delay - (now - lastRun.current));
      }
    }) as T,
    [callback, delay]
  );
}