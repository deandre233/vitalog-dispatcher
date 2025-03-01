
import { useState, useEffect } from "react";
import { Megaphone, Pin, PinOff, CheckCircle, MessageSquare, AlertCircle, Bell } from "lucide-react";
import { HRLayout } from "@/components/layout/HRLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { useAnnouncementAI } from "@/hooks/useAnnouncementAI";
import { useToast } from "@/hooks/use-toast";
import { Announcement, TeamMember, AnnouncementPriority, DirectMessage } from "@/types/announcements";

const BroadcastCenter = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [newAnnouncementPriority, setNewAnnouncementPriority] = useState<AnnouncementPriority>("medium");
  const [newAnnouncementExpiryDate, setNewAnnouncementExpiryDate] = useState<Date | undefined>(undefined);
  const [directMessageContent, setDirectMessageContent] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  
  const { 
    generateAnnouncement, 
    getRecommendedRecipients,
    suggestion, 
    isLoading: aiLoading, 
    error: aiError 
  } = useAnnouncementAI();

  // Mock data initialization
  useEffect(() => {
    // Mock team members
    setTeamMembers([
      { id: "1", name: "John Smith", role: "Paramedic", department: "Emergency Response", isOnline: true },
      { id: "2", name: "Sarah Johnson", role: "EMT", department: "Emergency Response", isOnline: false },
      { id: "3", name: "Michael Brown", role: "Dispatch Manager", department: "Operations", isOnline: true },
      { id: "4", name: "Emily Davis", role: "Administrator", department: "Administration", isOnline: true },
    ]);

    // Mock announcements
    setAnnouncements([
      {
        id: "1",
        title: "New Dispatch Protocol",
        content: "Starting next week, we will be implementing new dispatch protocols. Please review the attached documentation.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdBy: "Admin",
        isPinned: true,
        priority: "high",
        acknowledgments: [
          { userId: "2", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), read: true },
          { userId: "3", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), read: true },
        ]
      },
      {
        id: "2",
        title: "Upcoming Training Session",
        content: "Reminder: There will be a mandatory training session on emergency response procedures next Tuesday at 9 AM.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdBy: "Admin",
        isPinned: false,
        priority: "medium",
        acknowledgments: [
          { userId: "1", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), read: true },
          { userId: "4", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), read: true },
        ]
      }
    ]);

    // Mock direct messages
    setDirectMessages([
      {
        id: "dm1",
        senderId: "3",
        recipientId: "admin",
        content: "Hi there, I have a question about the new dispatch protocol.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isRead: true
      }
    ]);
  }, []);

  const handleCreateAnnouncement = () => {
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content for the announcement.",
        variant: "destructive"
      });
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      createdAt: new Date(),
      createdBy: "Admin", // Would be current user in a real app
      isPinned: false,
      priority: newAnnouncementPriority,
      expiresAt: newAnnouncementExpiryDate,
      acknowledgments: []
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    
    toast({
      title: "Announcement Created",
      description: `Your announcement "${newAnnouncementTitle}" has been published.`
    });

    // Reset form
    setNewAnnouncementTitle("");
    setNewAnnouncementContent("");
    setNewAnnouncementPriority("medium");
    setNewAnnouncementExpiryDate(undefined);
    setSelectedTeamMembers([]);
  };

  const handleSendDirectMessage = () => {
    if (!directMessageContent.trim() || !selectedRecipient) {
      toast({
        title: "Error",
        description: "Please select a recipient and enter a message.",
        variant: "destructive"
      });
      return;
    }

    const newMessage: DirectMessage = {
      id: Date.now().toString(),
      senderId: "admin", // Would be current user in a real app
      recipientId: selectedRecipient,
      content: directMessageContent,
      timestamp: new Date(),
      isRead: false
    };

    setDirectMessages([newMessage, ...directMessages]);
    
    toast({
      title: "Message Sent",
      description: `Your message has been sent.`
    });

    // Reset form
    setDirectMessageContent("");
    setSelectedRecipient(null);
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, isPinned: !announcement.isPinned } 
        : announcement
    ));

    const announcement = announcements.find(a => a.id === id);
    
    toast({
      title: announcement?.isPinned ? "Announcement Unpinned" : "Announcement Pinned",
      description: `"${announcement?.title}" has been ${announcement?.isPinned ? 'unpinned' : 'pinned'}.`
    });
  };

  const acknowledgeAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { 
            ...announcement, 
            acknowledgments: [
              ...announcement.acknowledgments, 
              { userId: "admin", timestamp: new Date(), read: true }
            ] 
          } 
        : announcement
    ));

    toast({
      title: "Announcement Acknowledged",
      description: "Your acknowledgment has been recorded."
    });
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the AI.",
        variant: "destructive"
      });
      return;
    }

    await generateAnnouncement(aiPrompt);
    
    // If we got a suggestion, apply it
    if (suggestion) {
      setNewAnnouncementTitle(suggestion.title || "");
      setNewAnnouncementContent(suggestion.content || "");
      setNewAnnouncementPriority((suggestion.priority as AnnouncementPriority) || "medium");
      if (suggestion.expiryDate) {
        setNewAnnouncementExpiryDate(suggestion.expiryDate);
      }
    }
  };

  const getPriorityBadge = (priority: AnnouncementPriority) => {
    switch (priority) {
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      case "medium":
        return <Badge>Medium</Badge>;
      case "high":
        return <Badge variant="warning">High</Badge>;
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge>Medium</Badge>;
    }
  };

  return (
    <HRLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Megaphone className="h-8 w-8 text-[#2B4B8C]" />
              Broadcast Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Send announcements, direct messages, and manage communications with your team
            </p>
          </div>
        </div>

        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" /> Create Announcement
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Direct Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <div className="grid gap-6">
              {announcements.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No announcements available</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Pinned announcements */}
                  {announcements.some(a => a.isPinned) && (
                    <div className="mb-4">
                      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Pin className="h-4 w-4" /> Pinned Announcements
                      </h2>
                      <div className="grid gap-4">
                        {announcements.filter(a => a.isPinned).map(announcement => (
                          <Card key={announcement.id} className="border-l-4 border-l-[#2B4B8C]">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                  <CardDescription>
                                    Posted {announcement.createdAt.toLocaleDateString()} by {announcement.createdBy}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getPriorityBadge(announcement.priority)}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => togglePinAnnouncement(announcement.id)}
                                  >
                                    <PinOff className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="whitespace-pre-line">{announcement.content}</p>
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex justify-between">
                              <div className="text-sm text-muted-foreground">
                                {announcement.acknowledgments.length} acknowledgments
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => acknowledgeAnnouncement(announcement.id)}
                                disabled={announcement.acknowledgments.some(ack => ack.userId === "admin")}
                              >
                                <CheckCircle className="h-4 w-4" />
                                {announcement.acknowledgments.some(ack => ack.userId === "admin") 
                                  ? "Acknowledged" 
                                  : "Acknowledge"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Regular announcements */}
                  <div>
                    <h2 className="text-lg font-medium mb-4">Recent Announcements</h2>
                    <div className="grid gap-4">
                      {announcements.filter(a => !a.isPinned).map(announcement => (
                        <Card key={announcement.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{announcement.title}</CardTitle>
                                <CardDescription>
                                  Posted {announcement.createdAt.toLocaleDateString()} by {announcement.createdBy}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                {getPriorityBadge(announcement.priority)}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => togglePinAnnouncement(announcement.id)}
                                >
                                  <Pin className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="whitespace-pre-line">{announcement.content}</p>
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <div className="text-sm text-muted-foreground">
                              {announcement.acknowledgments.length} acknowledgments
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => acknowledgeAnnouncement(announcement.id)}
                              disabled={announcement.acknowledgments.some(ack => ack.userId === "admin")}
                            >
                              <CheckCircle className="h-4 w-4" />
                              {announcement.acknowledgments.some(ack => ack.userId === "admin") 
                                ? "Acknowledged" 
                                : "Acknowledge"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Announcement</CardTitle>
                    <CardDescription>
                      Compose an announcement to send to your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter announcement title"
                        value={newAnnouncementTitle}
                        onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Enter announcement content"
                        rows={6}
                        value={newAnnouncementContent}
                        onChange={(e) => setNewAnnouncementContent(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newAnnouncementPriority}
                          onChange={(e) => setNewAnnouncementPriority(e.target.value as AnnouncementPriority)}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Expiry Date (Optional)</Label>
                        <DatePicker
                          date={newAnnouncementExpiryDate}
                          onDateChange={setNewAnnouncementExpiryDate}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Recipients</Label>
                      <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                        {teamMembers.map(member => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`member-${member.id}`}
                              checked={selectedTeamMembers.includes(member.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTeamMembers([...selectedTeamMembers, member.id]);
                                } else {
                                  setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== member.id));
                                }
                              }}
                            />
                            <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 cursor-pointer">
                              {member.name}
                              <span className="text-xs text-muted-foreground">{member.role}</span>
                              {member.isOnline && (
                                <span className="h-2 w-2 rounded-full bg-green-500" title="Online"></span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleCreateAnnouncement}>Publish Announcement</Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistance</CardTitle>
                    <CardDescription>
                      Let AI help you draft your announcement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ai-prompt">What would you like to announce?</Label>
                      <Textarea
                        id="ai-prompt"
                        placeholder="E.g., 'Draft an announcement about new safety procedures starting next Monday'"
                        rows={4}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={handleGenerateAI}
                      disabled={aiLoading}
                      className="w-full"
                    >
                      {aiLoading ? "Generating..." : "Generate with AI"}
                    </Button>

                    {aiError && (
                      <div className="text-sm text-destructive mt-2">
                        {aiError}
                      </div>
                    )}

                    {suggestion && (
                      <Card className="bg-slate-50 border-dashed">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">AI Suggestion</CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 text-sm">
                          {suggestion.title && (
                            <div className="mb-2">
                              <strong>Title:</strong> {suggestion.title}
                            </div>
                          )}
                          {suggestion.content && (
                            <div className="mb-2">
                              <strong>Content:</strong> 
                              <p className="whitespace-pre-line mt-1">{suggestion.content}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Select a team member to message
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {teamMembers.map(member => (
                        <div 
                          key={member.id}
                          className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-50 ${
                            selectedRecipient === member.id ? 'bg-slate-100' : ''
                          }`}
                          onClick={() => setSelectedRecipient(member.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                {member.name.substring(0, 1)}
                              </div>
                              {member.isOnline && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          {selectedRecipient === member.id && (
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      {selectedRecipient 
                        ? `Message to ${teamMembers.find(m => m.id === selectedRecipient)?.name}`
                        : 'Select a recipient'}
                    </CardTitle>
                    <CardDescription>
                      Send a direct message to the selected team member
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {selectedRecipient ? (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Type your message here..."
                          rows={6}
                          value={directMessageContent}
                          onChange={(e) => setDirectMessageContent(e.target.value)}
                        />
                        
                        <div className="flex justify-end">
                          <Button onClick={handleSendDirectMessage}>
                            Send Message
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Select a team member to start messaging</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
};

export default BroadcastCenter;
