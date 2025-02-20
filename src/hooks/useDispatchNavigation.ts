
import { useCallback, useState } from 'react';
import { DispatchViewState } from '@/types/dispatch';

export const useDispatchNavigation = () => {
  const [viewState, setViewState] = useState<DispatchViewState>({
    activeTab: 'active',
    activeView: 'list',
  });

  const updateViewState = useCallback((updates: Partial<DispatchViewState>) => {
    setViewState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    viewState,
    updateViewState,
  };
};
