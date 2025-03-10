
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Send, 
  Users, 
  User, 
  ArrowRight 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  channel: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  participants: string[];
}

interface Channel {
  id: string;
  name: string;
  type: string;
  unread: number;
}

interface TeamChatViewProps {
  messages: Message[];
  channels: Channel[];
  searchQuery: string;
  onNewMessage: (recipientNames: string[], message: string) => void;
}

export function TeamChatView({
  messages,
  channels,
  searchQuery,
  onNewMessage
}: TeamChatViewProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [currentChannelName, setCurrentChannelName] = useState("Entire Team");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Prepare message data
    const recipients = currentChannelName === "Direct Message" 
      ? (selectedConversation?.participants || []) 
      : [currentChannelName];
    
    // Send the message
    onNewMessage(recipients, newMessage);
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };
  
  const getChannelIcon = (type: string) => {
    switch(type) {
      case "team": return <Users className="h-4 w-4" />;
      case "announcement": return <MessageSquare className="h-4 w-4" />;
      case "celebration": return <User className="h-4 w-4" />;
      case "applicants": return <User className="h-4 w-4" />;
      case "operations": return <MessageSquare className="h-4 w-4" />;
      case "training": return <User className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  const handleSelectConversation = (message: Message) => {
    setSelectedConversation(message);
    setCurrentChannelName(message.channel);
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <>
      {/* Mobile view: Show only conversation or list */}
      <div className="block md:hidden">
        {selectedConversation ? (
          <div className="border rounded-lg bg-background shadow-sm flex flex-col h-[700px]">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-2 p-0 h-8 w-8" onClick={() => setSelectedConversation(null)}>
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </Button>
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
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Messages</h3>
              <Button size="sm" variant="ghost" onClick={() => setMobileMenuOpen(true)}>
                <Users className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="border rounded-lg bg-background shadow-sm overflow-hidden">
              <ScrollArea className="h-[600px]">
                <div className="divide-y">
                  {messages
                    .filter(msg => searchQuery ? 
                      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) : 
                      true)
                    .map(message => (
                    <div 
                      key={message.id} 
                      className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${!message.read ? 'bg-muted/20' : ''}`}
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
          </div>
        )}
        
        {/* Mobile channels sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[300px]">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Channels & Contacts</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-4">
                <h3 className="font-medium mb-2">Channels</h3>
                <div className="space-y-1 mb-4">
                  {channels.map(channel => (
                    <Button 
                      key={channel.id} 
                      variant="ghost" 
                      className="w-full justify-start mb-1 font-normal"
                      onClick={() => {
                        setCurrentChannelName(channel.name);
                        setMobileMenuOpen(false);
                      }}
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
                </div>
                
                <Separator className="my-2" />
                
                <h3 className="font-medium mb-2">Direct Messages</h3>
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mb-1 font-normal"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Justen B.</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mb-1 font-normal"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Blake G.</span>
                    <Badge variant="destructive" className="ml-auto">1</Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mb-1 font-normal"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Andrew T.</span>
                    <Badge variant="destructive" className="ml-auto">2</Badge>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop view: Show grid layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 h-[700px]">
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
    </>
  );
}
