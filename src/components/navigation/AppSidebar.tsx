import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Ambulance, FileText, DollarSign, Users, Settings, PlusCircle, MapPin, Bell, HelpCircle } from "lucide-react";

const menuItems = [
  { title: "Active Dispatches", icon: Ambulance, url: "#dispatch" },
  { title: "Create New Dispatch", icon: PlusCircle, url: "#new" },
  { title: "Manage Routes", icon: MapPin, url: "#routes" },
  { title: "PCR", icon: FileText, url: "#pcr" },
  { title: "Billing", icon: DollarSign, url: "#billing" },
  { title: "Crew", icon: Users, url: "#crew" },
  { title: "Notifications", icon: Bell, url: "#notifications" },
  { title: "Help/Support", icon: HelpCircle, url: "#help" },
  { title: "Settings", icon: Settings, url: "#settings" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-medical-primary mb-1">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="my-0.5">
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2 py-1.5 px-2">
                      <item.icon className="w-4 h-4 text-medical-primary" />
                      <span className="text-sm">{item.title}</span>
                    </a>
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