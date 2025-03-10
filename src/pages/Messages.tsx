
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AINotificationCenter } from "@/components/hr/tabs/notifications/AINotificationCenter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Search, 
  Bot, 
  Filter, 
  Bell, 
  Plus, 
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { NewMessageDialog } from "@/components/messaging/NewMessageDialog";
import { TeamChatView } from "@/components/messaging/TeamChatView";

export default function Messages() {
  // Mock employee ID - in a real app, this would come from auth context
  const employeeId = "emp-123";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("team-chat");
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      channel: "Entire Team",
      sender: "Heart to Heart Ambulance Medic",
      senderAvatar: "/lovable-uploads/056f6072-2287-4579-bb29-786c9206ac76.png",
      content: "I felt that one, rest in peace",
      timestamp: "FRI 7 MAR",
      read: true,
      participants: ["Entire Team"]
    },
    {
      id: "msg-2",
      channel: "Direct Message",
      sender: "Ishmael G., Justen B.",
      senderAvatar: "",
      content: "It is with deep sadness that I...",
      timestamp: "FRI 7 MAR",
      read: true,
      participants: ["Ishmael G.", "Justen B."]
    },
    {
      id: "msg-3",
      channel: "Celebration",
      sender: "Heart to Heart Ambulance Medic",
      senderAvatar: "/lovable-uploads/056f6072-2287-4579-bb29-786c9206ac76.png",
      content: "Ishmael sent a shout-out.",
      timestamp: "WED 5 MAR",
      read: true,
      participants: ["Celebration"]
    },
    {
      id: "msg-4",
      channel: "Direct Message",
      sender: "Andrew T., Blake G.",
      senderAvatar: "",
      content: "10-4",
      timestamp: "FRI 28 FEB",
      read: false,
      participants: ["Andrew T.", "Blake G."]
    },
    {
      id: "msg-5",
      channel: "Direct Message",
      sender: "Blake G.",
      senderAvatar: "",
      content: "👍",
      timestamp: "FRI 28 FEB",
      read: false,
      participants: ["Blake G."]
    },
    {
      id: "msg-6",
      channel: "Direct Message",
      sender: "Benjamin H. (inactive)",
      senderAvatar: "",
      content: "Good morning. The address is...",
      timestamp: "THU 20 FEB",
      read: true,
      participants: ["Benjamin H."]
    },
    {
      id: "msg-7",
      channel: "Direct Message",
      sender: "Justen B.",
      senderAvatar: "",
      content: "Forgot to clock in 755am till...",
      timestamp: "WED 19 FEB",
      read: false,
      participants: ["Justen B."]
    }
  ]);
  
  const [channels, setChannels] = useState([
    { id: "ch-1", name: "Entire Team", type: "team", unread: 0 },
    { id: "ch-2", name: "Announcements", type: "announcement", unread: 0 },
    { id: "ch-3", name: "Celebration", type: "celebration", unread: 0 },
    { id: "ch-4", name: "Applicants", type: "applicants", unread: 3 },
    { id: "ch-5", name: "Dispatch", type: "operations", unread: 0 },
    { id: "ch-6", name: "Training", type: "training", unread: 0 }
  ]);
  
  const handleNewMessage = (recipients: string[], message: string) => {
    // Add new message to the conversation
    const newMsg = {
      id: `msg-${Date.now()}`,
      channel: recipients.length > 1 ? "Group Message" : "Direct Message",
      sender: "You",
      senderAvatar: "",
      content: message,
      timestamp: "Just now",
      read: true,
      participants: recipients
    };
    
    setMessages(prev => [newMsg, ...prev]);
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${recipients.join(", ")}`,
    });
  };
  
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
              <Button variant="outline" size="sm" className="md:flex hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="md:flex hidden bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                onClick={() => setShowNewMessageDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Message
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
          
          <Tabs defaultValue="team-chat" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-muted/50 overflow-x-auto flex w-full md:w-auto">
              <TabsTrigger value="team-chat" className="flex gap-1">
                <Users className="h-4 w-4" />
                <span>Team Chat</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex gap-1">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="ai-interactions" className="flex gap-1">
                <Bot className="h-4 w-4" />
                <span>AI Interactions</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Smart Insights</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="team-chat" className="w-full">
              <TeamChatView 
                messages={messages}
                channels={channels}
                searchQuery={searchQuery}
                onNewMessage={handleNewMessage}
              />
            </TabsContent>
            
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
                    <Bot className="h-12 w-12 text-slate-400 mb-4" />
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
      
      {/* New Message Dialog */}
      <NewMessageDialog
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
        onMessageSent={handleNewMessage}
      />
    </MainLayout>
  );
}
