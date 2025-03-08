
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { HeroSection } from "@/components/announcements/HeroSection";
import { QuickStats } from "@/components/announcements/QuickStats";
import { SearchBar } from "@/components/announcements/SearchBar";
import { AnnouncementsTable } from "@/components/announcements/AnnouncementsTable";
import { Bulletin } from "@/types/announcements";

const announcements: Bulletin[] = [
  {
    id: 1,
    title: "New AI-Powered Route Optimization System Launch",
    author: "System Admin",
    expiry: "2024-03-28",
    targetGroups: ["Operations", "Field Teams", "Dispatch"],
    status: "active",
    requiresSignature: true,
    seenBy: 24,
    priority: "high"
  },
  {
    id: 2,
    title: "Updated Safety Protocols for Field Operations",
    author: "Safety Director",
    expiry: "2024-03-15",
    targetGroups: ["Field Teams", "Supervisors"],
    status: "active",
    requiresSignature: true,
    seenBy: 45,
    priority: "medium"
  }
];

export default function BulletinControl() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8f9ff] to-[#f0f2ff]">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <div className="max-w-[1800px] mx-auto p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <HeroSection />
                <QuickStats />
              </div>
              <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <AnnouncementsTable announcements={announcements} />
            </div>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
