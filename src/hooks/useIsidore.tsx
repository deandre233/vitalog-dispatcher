
import { useState, useCallback } from 'react';

export function useIsidore() {
  const [isOpen, setIsOpen] = useState(false);

  const openIsidore = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeIsidore = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openIsidore,
    closeIsidore
  };
}
