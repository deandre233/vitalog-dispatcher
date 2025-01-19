import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Ambulance, PlusSquare, Users, DollarSign, FileText, Flag, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";

const menuItems = [
  { title: "Main Dashboard", icon: Home, url: "/", description: "Access the main dashboard and overview" },
  { title: "Emergency Transport", icon: Ambulance, url: "/emergency", description: "Manage emergency transport and dispatches" },
  { title: "Add New Item", icon: PlusSquare, url: "/new", description: "Create new entries and records" },
  { title: "Team Management", icon: Users, url: "/team", description: "Manage team members and assignments" },
  { title: "Financial Tracker", icon: DollarSign, url: "/finance", description: "Track financial data and reports" },
  { title: "Documents & Reports", icon: FileText, url: "/documents", description: "Access and manage documents" },
  { title: "Flagged Items", icon: Flag, url: "/flagged", description: "View items marked for attention" },
  { title: "Time Tracker", icon: Clock, url: "/time", description: "Track and manage time-related data" }
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-lg font-semibold text-medical-primary">Dispatch</span>
          <SidebarTrigger />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.url
                        ? "bg-medical-primary/10 text-medical-primary"
                        : "hover:bg-gray-100"
                    }`}
                    title={item.description}
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        location.pathname === item.url
                          ? "text-medical-primary"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={
                        location.pathname === item.url
                          ? "font-medium"
                          : "text-gray-700"
                      }
                    >
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}