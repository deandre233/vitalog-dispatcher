import { useState } from 'react';
import { DispatchViewState } from '@/types/dispatch';

export function useDispatchNavigation() {
  const [viewState, setViewState] = useState<DispatchViewState>({
    activeTab: 'active',
    activeView: 'dispatches',
  });

  const setActiveTab = (tab: DispatchViewState['activeTab']) => {
    setViewState(prev => ({ ...prev, activeTab: tab }));
  };

  const setActiveView = (view: DispatchViewState['activeView']) => {
    setViewState(prev => ({ ...prev, activeView: view }));
  };

  const setSelectedDate = (date?: Date) => {
    setViewState(prev => ({ ...prev, selectedDate: date }));
  };

  const setFilterStatus = (status?: string[]) => {
    setViewState(prev => ({ ...prev, filterStatus: status }));
  };

  return {
    viewState,
    setActiveTab,
    setActiveView,
    setSelectedDate,
    setFilterStatus,
  };
}