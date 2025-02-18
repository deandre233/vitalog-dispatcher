
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface IsidoreHelperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IsidoreHelper({ isOpen, onClose }: IsidoreHelperProps) {
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div 
        ref={popoverRef}
        className="bg-white rounded-lg w-[80%] h-[80%] relative flex flex-col"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <iframe
          src="https://copilotstudio.microsoft.com/environments/Default-975296cd-79fe-4121-bca2-2d01b3e34197/bots/crfde_angelTrackKnowledgebaseHelper/webchat?__version__=2"
          className="w-full h-full rounded-lg"
          frameBorder="0"
        />
      </div>
    </div>
  );
}
