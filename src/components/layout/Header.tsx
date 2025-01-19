import { Link } from "react-router-dom";

export function Header({ className = "" }) {
  return (
    <header className={`bg-blue-700 text-white border-b border-blue-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold">Loveable AI</div>
          </div>
          <nav className="hidden sm:flex sm:space-x-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
            >
              Home
            </Link>
            <Link 
              to="/dispatch" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
            >
              Dispatch
            </Link>
            <Link 
              to="/schedule" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
            >
              Schedule
            </Link>
            <Link 
              to="/performance" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
            >
              Performance
            </Link>
            <Link 
              to="/billing" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
            >
              Billing
            </Link>
            <Link 
              to="/settings" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 rounded-md"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}