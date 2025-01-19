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
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
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