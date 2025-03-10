
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Send, 
  Menu, 
  Search, 
  MessageSquare, 
  Users, 
  Sparkles, 
  Pin, 
  Bell, 
  FileText,
  Paperclip,
  Image,
  Mic,
  ChevronDown,
  Star,
  ArrowUpRight,
  BrainCircuit,
  MessageCircle,
  Info,
  UserPlus,
  Calendar
} from "lucide-react";
import { ChannelSidebar } from "./ChannelSidebar";
import { MessageList } from "./MessageList";
import { Message } from "./types";

interface MobileChatViewProps {
  messages: Message[];
  channels: any[];
  setCurrentChannelName: (name: string) => void;
  currentChannelName: string;
  selectedConversation: Message | null;
  setSelectedConversation: (message: Message) => void;
  togglePinMessage: (messageId: string) => void;
  pinnedMessages: string[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  onShowAICorrection: () => void;
  onShowAIGenerator: () => void;
}

export function MobileChatView({
  messages,
  channels,
  setCurrentChannelName,
  currentChannelName,
  selectedConversation,
  setSelectedConversation,
  togglePinMessage,
  pinnedMessages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  onShowAICorrection,
  onShowAIGenerator
}: MobileChatViewProps) {
  const [open, setOpen] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Enhanced search filter for messages
  const filteredMessages = messages.filter(message => {
    if (!searchQuery) return true;
    const content = message.content.toLowerCase();
    const sender = message.sender.toLowerCase();
    const query = searchQuery.toLowerCase();
    return content.includes(query) || sender.includes(query);
  });
  
  // AI suggestions for quick responses
  const aiSuggestions = [
    "I'll look into this right away.",
    "Could you provide more details?",
    "Let's schedule a meeting to discuss this.",
    "Thanks for the update!"
  ];

  // Simulated AI voice recording handler
  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setNewMessage("I'm processing your request and will get back to you soon.");
      }, 3000);
    }
  };
  
  return (
    <div className="md:hidden h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header with Tabs */}
      <div className="border-b p-2 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-2">
                  <Menu className="h-4 w-4 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <ChannelSidebar 
                  channels={channels}
                  currentChannelName={currentChannelName}
                  setCurrentChannelName={(name) => {
                    setCurrentChannelName(name);
                    setOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
            <div>
              <h2 className="text-base font-semibold text-gray-800">{currentChannelName}</h2>
              <div className="flex items-center text-xs text-gray-500">
                <Badge variant="outline" className="text-[10px] font-normal h-4 bg-green-50 border-green-200 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                  Active
                </Badge>
                <span className="mx-1">•</span>
                {currentChannelName === "Entire Team" ? (
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {messages.length} messages
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Last active today
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchVisible(!searchVisible)}>
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserPlus className="h-4 w-4 text-gray-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-0">
                <div className="p-3 border-b">
                  <h3 className="font-medium text-sm">Add Team Members</h3>
                  <p className="text-xs text-gray-500 mt-1">Invite others to this conversation</p>
                </div>
                <div className="p-3">
                  <Input placeholder="Search by name or email" className="mb-2" />
                  <div className="flex flex-col gap-2 mt-3 max-h-40 overflow-auto">
                    {["Sarah Parker", "Mike Johnson", "Alyssa Chen"].map((name) => (
                      <div key={name} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <Avatar className="h-7 w-7 mr-2">
                            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{name}</span>
                        </div>
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4 text-gray-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">About this Channel</h3>
                  <p className="text-xs text-gray-500">
                    Created on {new Date().toLocaleDateString()}
                  </p>
                  <div className="text-xs border-t pt-2 mt-2">
                    <div className="flex justify-between py-1">
                      <span>Members</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Messages</span>
                      <span className="font-medium">{messages.length}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Pinned Messages</span>
                      <span className="font-medium">{pinnedMessages.length}</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {searchVisible && (
          <div className="px-2 py-1 bg-gray-50 rounded-lg flex items-center mb-2 animate-fade-in">
            <Search className="h-3.5 w-3.5 text-gray-400 mr-2" />
            <Input 
              placeholder="Search in this conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 text-sm border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => {
                setSearchQuery("");
                setSearchVisible(false);
              }}
            >
              ×
            </Button>
          </div>
        )}
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-gray-100/80">
            <TabsTrigger value="chat" className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="pinned" className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Pin className="h-3.5 w-3.5 mr-1" />
              Pinned
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BrainCircuit className="h-3.5 w-3.5 mr-1" />
              AI Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Message Content Areas */}
      <TabsContent value="chat" className="flex-1 overflow-y-auto p-0 m-0 data-[state=inactive]:hidden">
        <div className="flex-1 p-3 space-y-6">
          {filteredMessages.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <MessageList 
                messages={filteredMessages}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
              />
              <div ref={messageEndRef} />
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-270px)] text-center p-4">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery ? "No results found. Try a different search." : "Start the conversation by sending a message."}
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="pinned" className="flex-1 overflow-y-auto p-4 space-y-4 m-0 data-[state=inactive]:hidden">
        {pinnedMessages.length > 0 ? (
          <div className="space-y-3">
            {messages
              .filter(msg => pinnedMessages.includes(msg.id))
              .map(pinnedMsg => (
                <Card key={pinnedMsg.id} className="border border-amber-100 bg-amber-50/50">
                  <CardContent className="p-3">
                    <div className="flex items-start mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={pinnedMsg.senderAvatar} alt={pinnedMsg.sender} />
                        <AvatarFallback>{pinnedMsg.sender.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{pinnedMsg.sender}</span>
                          <Badge className="ml-2 h-5 bg-amber-200 text-amber-800 text-[10px] border-0">
                            <Pin className="h-3 w-3 mr-1" />
                            Pinned
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(pinnedMsg.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-sm pl-10">{pinnedMsg.content}</p>
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs text-gray-500"
                        onClick={() => togglePinMessage(pinnedMsg.id)}
                      >
                        Unpin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center">
            <Pin className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No pinned messages</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              Pin important messages to keep them easily accessible.
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="ai" className="flex-1 overflow-y-auto p-4 m-0 data-[state=inactive]:hidden">
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                  <BrainCircuit className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-800">AI Conversation Summary</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    This conversation focuses on {currentChannelName === "Entire Team" ? "team coordination" : "project planning"} 
                    with key topics including resource allocation and upcoming deadlines.
                  </p>
                  <div className="flex mt-2">
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 mr-1">
                      <Star className="h-3 w-3 mr-1" />
                      4 action items
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                      <Calendar className="h-3 w-3 mr-1" />
                      2 deadlines
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
              AI Message Suggestions
            </h3>
            
            {aiSuggestions.map((suggestion, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="w-full justify-start text-left h-auto py-2 px-3 text-sm font-normal bg-white hover:bg-gray-50"
                onClick={() => setNewMessage(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm text-gray-800 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1 text-emerald-500" />
                Team Engagement Insights
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Most active member</span>
                  <span className="font-medium">Sarah Parker</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Response time</span>
                  <span className="font-medium">12 min avg</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Peak activity time</span>
                  <span className="font-medium">10:00 - 11:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      {/* Enhanced Input Area */}
      <div className="p-3 border-t bg-white">
        <div className="relative mb-2">
          <Textarea 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className={`min-h-[60px] max-h-24 pr-10 ${isRecording ? 'bg-red-50 border-red-200' : 'bg-gray-50'} text-sm placeholder:text-gray-400 resize-none`}
          />
          {isRecording && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-1 animate-pulse"></div>
              <span className="text-xs text-red-500">Recording...</span>
            </div>
          )}
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && !isRecording}
            className="absolute right-2 bottom-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 h-8 w-8 p-0 rounded-full"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-8 w-8 rounded-full ${isRecording ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              onClick={handleVoiceRecording}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          
          <Popover open={showAIMenu} onOpenChange={setShowAIMenu}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                AI Tools
                <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 bg-white" align="end">
              <div className="p-2.5 border-b">
                <Label className="font-medium text-sm">AI Assistants</Label>
              </div>
              <div className="p-1.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm h-9 font-normal"
                  onClick={() => {
                    onShowAICorrection();
                    setShowAIMenu(false);
                  }}
                >
                  <BrainCircuit className="h-4 w-4 mr-2 text-blue-500" />
                  Auto-correct Message
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm h-9 font-normal"
                  onClick={() => {
                    onShowAIGenerator();
                    setShowAIMenu(false);
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  Generate Message
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-sm h-9 font-normal"
                >
                  <FileText className="h-4 w-4 mr-2 text-green-500" />
                  Summarize Chat
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
