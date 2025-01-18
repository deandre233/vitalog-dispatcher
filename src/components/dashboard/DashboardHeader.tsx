import { Bell } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center p-6 bg-white border-b">
      <h1 className="text-2xl font-semibold text-medical-primary">
        Welcome to Dispatch Control
      </h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-medical-accent rounded-full">
          <Bell className="w-6 h-6 text-medical-primary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}