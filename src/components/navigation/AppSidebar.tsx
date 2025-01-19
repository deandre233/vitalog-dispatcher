import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Users, Map, ClipboardCheck, Brain, Inbox, Calendar, Archive, Bell, ShieldCheck, FolderLock, Building, Network, UserRound, Upload, BookOpen, Tags, History, Link2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const menuItems = [
  { title: "Employee Directory", icon: Users, url: "/employees", description: "Access employee list including crew, management, and admin staff" },
  { title: "Real-Time Route Map", icon: Map, url: "/live-map", description: "Track real-time locations and routes of crews" },
  { title: "Shift History & Checklists", icon: ClipboardCheck, url: "/shifts", description: "Review completed shifts and task checklists" },
  { title: "AI Route Planning", icon: Brain, url: "/route-optimization", description: "AI-powered route suggestions and optimization" },
  { title: "Pending Approvals Queue", icon: Inbox, url: "/approvals", description: "Manage requests requiring approval" },
  { title: "Upcoming Schedule", icon: Calendar, url: "/schedule", description: "View upcoming crew and service schedules" },
  { title: "Closed Requests", icon: Archive, url: "/closed-requests", description: "Review completed transport requests" },
  { title: "Incoming Service Requests", icon: Bell, url: "/requests", description: "View new unprocessed service requests" },
  { title: "Authorization Approval Queue", icon: ShieldCheck, url: "/authorizations", description: "Manage pending prior authorizations" },
  { title: "Auth File Management", icon: FolderLock, url: "/auth-files", description: "Access existing prior authorizations" },
  { title: "Facility Directory", icon: Building, url: "/facilities", description: "View list of service facilities" },
  { title: "Partner Organizations", icon: Network, url: "/partners", description: "Manage partner organizations" },
  { title: "Patient Records", icon: UserRound, url: "/patients", description: "Access patient transport information" },
  { title: "Upload Patient Documents", icon: Upload, url: "/upload", description: "Upload and manage patient documents" },
  { title: "Resource Library", icon: BookOpen, url: "/resources", description: "Access educational and training materials" },
  { title: "Tagging System", icon: Tags, url: "/tags", description: "Manage dispatch and service categorization" },
  { title: "Schedule Past Dispatch", icon: History, url: "/backdated", description: "Book or update past dispatches" },
  { title: "Custom Shortcut", icon: Link2, url: "/custom", description: "Customizable shortcuts to frequent tools" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
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