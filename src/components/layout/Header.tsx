import { Button } from "@/components/ui/button";
import { useIsidore } from "@/hooks/useIsidore";
import { IsidoreHelper } from "@/components/common/IsidoreHelper";
import { HelpCircle } from "lucide-react";

export function Header() {
  const { isOpen, openIsidore, closeIsidore } = useIsidore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={openIsidore}
          >
            <HelpCircle className="h-4 w-4" />
            Ask Isidore
          </Button>
          
        </div>

        <IsidoreHelper 
          isOpen={isOpen} 
          onClose={closeIsidore}
        />
      </div>
    </header>
  );
}
