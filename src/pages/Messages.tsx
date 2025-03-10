
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AINotificationCenter } from "@/components/hr/tabs/notifications/AINotificationCenter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Search, 
  Bot, 
  Filter, 
  Bell, 
  Send, 
  Users, 
  Plus, 
  User, 
  Clock, 
  ArrowRight 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function Messages() {
  // Mock employee ID - in a real app, this would come from auth context
  const employeeId = "emp-123";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("team-chat");
  const [newMessage, setNewMessage] = useState("");
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

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentChannelName, setCurrentChannelName] = useState("Entire Team");
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add message to the conversation
    const newMsg = {
      id: `msg-${Date.now()}`,
      channel: currentChannelName,
      sender: "You",
      senderAvatar: "",
      content: newMessage,
      timestamp: "Just now",
      read: true,
      participants: [currentChannelName]
    };
    
    setMessages(prev => [newMsg, ...prev]);
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };
  
  const getChannelIcon = (type) => {
    switch(type) {
      case "team": return <Users className="h-4 w-4" />;
      case "announcement": return <Bell className="h-4 w-4" />;
      case "celebration": return <User className="h-4 w-4" />;
      case "applicants": return <User className="h-4 w-4" />;
      case "operations": return <MessageSquare className="h-4 w-4" />;
      case "training": return <User className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  const handleSelectConversation = (message) => {
    setSelectedConversation(message);
    setCurrentChannelName(message.channel);
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button size="sm" variant="default">
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
            <TabsList className="mb-4 bg-muted/50">
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
              <div className="grid grid-cols-12 gap-4 h-[700px]">
                {/* Channels/Contacts sidebar */}
                <div className="col-span-3 border rounded-lg bg-background shadow-sm">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Channels</h3>
                  </div>
                  <ScrollArea className="h-[640px]">
                    <div className="p-2">
                      {channels.map(channel => (
                        <Button 
                          key={channel.id} 
                          variant="ghost" 
                          className="w-full justify-start mb-1 font-normal"
                          onClick={() => setCurrentChannelName(channel.name)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              {getChannelIcon(channel.type)}
                              <span className="ml-2">{channel.name}</span>
                            </div>
                            {channel.unread > 0 && (
                              <Badge variant="destructive" className="ml-auto">
                                {channel.unread}
                              </Badge>
                            )}
                          </div>
                        </Button>
                      ))}
                      
                      <Separator className="my-2" />
                      
                      <h3 className="font-medium mb-2 px-2">Direct Messages</h3>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start mb-1 font-normal"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Justen B.</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start mb-1 font-normal"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Blake G.</span>
                        <Badge variant="destructive" className="ml-auto">1</Badge>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start mb-1 font-normal"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Andrew T.</span>
                        <Badge variant="destructive" className="ml-auto">2</Badge>
                      </Button>
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Messages List */}
                <div className="col-span-4 border rounded-lg bg-background shadow-sm overflow-hidden">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Messages</h3>
                    <Button size="sm" variant="ghost">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[640px]">
                    <div className="divide-y">
                      {messages
                        .filter(msg => searchQuery ? 
                          msg.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) : 
                          true)
                        .map(message => (
                        <div 
                          key={message.id} 
                          className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${!message.read ? 'bg-muted/20' : ''} ${selectedConversation?.id === message.id ? 'bg-muted' : ''}`}
                          onClick={() => handleSelectConversation(message)}
                        >
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{message.channel === "Direct Message" ? message.sender : message.channel}</div>
                            <div className="text-xs text-muted-foreground">{message.timestamp}</div>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{message.content}</div>
                          {!message.read && (
                            <div className="mt-1 flex justify-end">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Conversation View */}
                <div className="col-span-5 border rounded-lg bg-background shadow-sm flex flex-col">
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/lovable-uploads/056f6072-2287-4579-bb29-786c9206ac76.png" />
                        <AvatarFallback>{currentChannelName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium">{currentChannelName}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <User className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col-reverse gap-3">
                      {/* Current conversation messages would go here */}
                      <div className="bg-muted/20 p-3 rounded-lg max-w-[80%] ml-auto">
                        <div className="font-medium text-sm mb-1 text-right">You</div>
                        <div>I'll follow up with the team on that.</div>
                        <div className="text-xs text-muted-foreground mt-1 text-right">Just now</div>
                      </div>
                      
                      <div className="bg-muted/10 p-3 rounded-lg max-w-[80%]">
                        <div className="font-medium text-sm mb-1 flex items-center">
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback>HH</AvatarFallback>
                          </Avatar>
                          Heart to Heart Ambulance
                        </div>
                        <div>{selectedConversation ? selectedConversation.content : "I felt that one, rest in peace"}</div>
                        <div className="text-xs text-muted-foreground mt-1">Today at 10:45 AM</div>
                      </div>
                    </div>
                  </ScrollArea>
                  
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Type your message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} className="bg-gradient-to-r from-purple-500 to-indigo-600">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
    </MainLayout>
  );
}
