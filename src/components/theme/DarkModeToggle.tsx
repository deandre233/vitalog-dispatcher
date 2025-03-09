
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={`
              p-2 rounded-full transition-all duration-300 hover-glow
              ${theme === 'dark' 
                ? 'text-purple-300 hover:bg-purple-800/30 hover:text-purple-200' 
                : 'text-purple-600 hover:bg-purple-200/50 hover:text-purple-700'}
            `}
          >
            <div className="relative w-5 h-5 overflow-hidden">
              {theme === 'dark' ? (
                <Sun className="absolute inset-0 transform transition-all duration-500 hover:rotate-45" />
              ) : (
                <Moon className="absolute inset-0 transform transition-all duration-500 hover:scale-110" />
              )}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className={theme === 'dark' ? 'dark-glass' : 'glass-morphism'}>
          <p>{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
