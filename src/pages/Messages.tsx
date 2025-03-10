
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AINotificationCenter } from "@/components/hr/tabs/notifications/AINotificationCenter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Robot, Filter, Bell } from "lucide-react";

export default function Messages() {
  // Mock employee ID - in a real app, this would come from auth context
  const employeeId = "emp-123";
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Message Center</h1>
              <p className="text-muted-foreground">
                View your notifications and communicate with your team
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <Robot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
          
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages and notifications..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="mb-4 bg-muted/50">
              <TabsTrigger value="notifications" className="flex gap-1">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="ai-interactions" className="flex gap-1">
                <Robot className="h-4 w-4" />
                <span>AI Interactions</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Smart Insights</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="notifications" className="w-full">
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>Notification Center</CardTitle>
                  <CardDescription>
                    View your recent notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[600px] overflow-y-auto pr-2">
                    <AINotificationCenter employeeId={employeeId} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-interactions">
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Interact with our AI to get help and insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[600px] flex flex-col justify-center items-center text-center p-6 bg-slate-50 rounded-lg border border-dashed">
                    <Robot className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">AI Assistant is ready</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      Ask questions about HR policies, get help with forms, or request insights about your team
                    </p>
                    <Button>Start a conversation</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights">
              <Card className="w-full">
                <CardHeader className="pb-3">
                  <CardTitle>Smart Insights</CardTitle>
                  <CardDescription>
                    AI-generated insights based on your communication
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[600px] flex flex-col justify-center items-center text-center p-6 bg-slate-50 rounded-lg border border-dashed">
                    <MessageSquare className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Communication Insights</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      AI-powered analysis of your team communication patterns will appear here
                    </p>
                    <Button variant="outline">Generate Insights</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
