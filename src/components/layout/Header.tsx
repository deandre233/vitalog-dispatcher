import { Heart } from "lucide-react";

export function Header({ className = "" }) {
  return (
    <header className={`bg-gradient-to-r from-[#ea384c] to-[#ff6b81] backdrop-blur-sm border-b border-red-600/20 shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Heart className="w-6 h-6 text-white animate-pulse" />
              <div className="absolute inset-0 bg-white/20 blur-sm rounded-full animate-pulse"></div>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
              Vitalog
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}