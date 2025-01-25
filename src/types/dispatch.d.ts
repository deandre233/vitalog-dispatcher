export interface DispatchViewState {
    activeTab: string;
    activeView: 'list' | 'map' | 'calendar';
    selectedDate: Date | null;
    filterStatus: string[];
}
export { DispatchViewState };
