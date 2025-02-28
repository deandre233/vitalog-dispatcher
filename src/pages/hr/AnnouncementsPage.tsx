
import { useState } from 'react';
import { HRLayout } from "@/components/layout/HRLayout";
import { AnnouncementList } from "@/components/hr/AnnouncementList";
import { AnnouncementForm } from "@/components/hr/AnnouncementForm";
import { AIAnnouncementSuggestions } from "@/components/hr/AIAnnouncementSuggestions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Megaphone, Plus, FileText, BrainCircuit } from "lucide-react";

export const AnnouncementsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  const handleCreateSuccess = () => {
    toast({
      title: "Announcement Created",
      description: "Your announcement has been successfully published.",
      variant: "default",
    });
  };

  return (
    <HRLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-blue-600" />
            Broadcast Center
          </h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Announcement
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md md:max-w-xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Create New Announcement</SheetTitle>
                  <SheetDescription>
                    Publish a new announcement to the organization
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <AnnouncementForm onSuccess={handleCreateSuccess} />
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Announcements</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <AIAnnouncementSuggestions />
            <AnnouncementList status="all" />
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <AnnouncementList status="active" />
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            <AnnouncementList status="scheduled" />
          </TabsContent>
          
          <TabsContent value="expired" className="space-y-4">
            <AnnouncementList status="expired" />
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
};

export default AnnouncementsPage;
