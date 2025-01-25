import { Button } from "@/components/ui/button";

interface DispatchViewToggleProps {
  activeView: 'dispatches' | 'scheduled';
  onViewChange: (view: 'dispatches' | 'scheduled') => void;
}

export function DispatchViewToggle({ activeView, onViewChange }: DispatchViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={activeView === 'dispatches' ? 'default' : 'outline'}
        onClick={() => onViewChange('dispatches')}
        className="text-sm"
      >
        Active Dispatches
      </Button>
      <Button
        variant={activeView === 'scheduled' ? 'default' : 'outline'}
        onClick={() => onViewChange('scheduled')}
        className="text-sm"
      >
        Scheduled Transport
      </Button>
    </div>
  );
}