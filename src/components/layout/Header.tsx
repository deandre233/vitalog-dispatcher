import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Header({ className = "" }) {
  return (
    <header className={`bg-medical-primary text-white border-b border-medical-primary/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-white animate-pulse" />
            <div className="text-xl font-bold">Heart Medical Transport</div>
          </div>
          <nav className="hidden sm:flex sm:space-x-1">
            {["Home", "Dispatch", "Schedule", "Performance", "Billing", "Settings"].map((item) => (
              <Link 
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}