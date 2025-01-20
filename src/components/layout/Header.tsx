import { Link } from "react-router-dom";
import { Heart, Home, Truck, Calendar, BarChart, DollarSign, Settings, User } from "lucide-react";

export function Header({ className = "" }) {
  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Dispatch", icon: Truck, path: "/dispatch" },
    { name: "Schedule", icon: Calendar, path: "/schedule" },
    { name: "Performance", icon: BarChart, path: "/performance" },
    { name: "Billing", icon: DollarSign, path: "/billing" },
    { name: "Patients", icon: User, path: "/patients" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  return (
    <header className={`bg-medical-primary text-white border-b border-medical-primary/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-white animate-pulse" />
            <div className="text-xl font-bold">Vitalog</div>
          </div>
          <nav className="hidden sm:flex sm:space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}