import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-medical-primary">Loveable AI</div>
          </div>
          <nav className="hidden sm:flex sm:space-x-8">
            <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Home
            </Link>
            <Link to="/dispatch" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Dispatch
            </Link>
            <Link to="/schedule" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Schedule
            </Link>
            <Link to="/performance" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Performance
            </Link>
            <Link to="/billing" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Billing
            </Link>
            <Link to="/settings" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}