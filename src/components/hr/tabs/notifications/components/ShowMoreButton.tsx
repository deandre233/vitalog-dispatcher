
import { Button } from "@/components/ui/button";

interface ShowMoreButtonProps {
  showAll: boolean;
  onToggle: () => void;
}

export function ShowMoreButton({ showAll, onToggle }: ShowMoreButtonProps) {
  return (
    <div className="flex justify-center mt-4">
      <Button 
        variant="link" 
        onClick={onToggle}
      >
        {showAll ? "Show fewer" : "Show all notifications"}
      </Button>
    </div>
  );
}
