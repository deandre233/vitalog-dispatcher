
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    // Check system preference as fallback
    const systemPreference = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    
    return (savedTheme || systemPreference);
  });
  
  useEffect(() => {
    // Save theme to localStorage when it changes
    localStorage.setItem("theme", theme);
    
    // Apply theme class to document
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    }
    
    // Apply transition class for smooth theme changes
    document.documentElement.classList.add("theme-transition");
    
    // Remove transition class after animation completes to prevent transition on page load
    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
    
    return () => clearTimeout(transitionTimeout);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
