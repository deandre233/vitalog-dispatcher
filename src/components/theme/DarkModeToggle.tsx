
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-full transition-colors ${
        theme === 'dark' 
          ? 'text-purple-300 hover:bg-purple-800/30 hover:text-purple-200' 
          : 'text-blue-800 hover:bg-blue-200/50 hover:text-blue-700'
      }`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 transition-transform hover:scale-110" />
      )}
    </Button>
  );
}
