
import { useTheme } from "@/components/theme/ThemeProvider";

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`
      ${theme === 'dark' 
        ? 'bg-[#0f172a] text-gray-400 border-[#1e293b]' 
        : 'bg-white text-gray-600 border-gray-200'}
      border-t mt-auto backdrop-blur-lg transition-colors duration-300
    `}>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            <button 
              onClick={() => window.open('mailto:support@nexacore.ai')} 
              className={`
                ${theme === 'dark' 
                  ? 'text-gray-400 hover:text-purple-400' 
                  : 'text-gray-600 hover:text-purple-600'} 
                transition-colors relative group
              `}
            >
              Contact Support
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
          </p>
          <div className="flex gap-4 text-sm">
            <button className={`
              ${theme === 'dark' 
                ? 'text-gray-400 hover:text-purple-400' 
                : 'text-gray-600 hover:text-purple-600'} 
              transition-colors
            `}>Terms</button>
            <button className={`
              ${theme === 'dark' 
                ? 'text-gray-400 hover:text-purple-400' 
                : 'text-gray-600 hover:text-purple-600'} 
              transition-colors
            `}>Privacy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
