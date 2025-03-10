
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  X, 
  ArrowLeft, 
  Users, 
  User, 
  Check, 
  SendHorizontal,
  PlusCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface TeamMemberType {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  role?: string;
  status?: 'online' | 'offline' | 'away';
}

interface GroupType {
  id: string;
  name: string;
  type: string;
  members: number;
}

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessageSent: (recipients: string[], message: string) => void;
}

export function NewMessageDialog({ 
  open, 
  onOpenChange,
  onMessageSent 
}: NewMessageDialogProps) {
  const [step, setStep] = useState<'recipients' | 'compose'>('recipients');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<TeamMemberType[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  
  // Mock data
  const groups: GroupType[] = [
    { id: "g1", name: "Entire Team", type: "team", members: 26 },
    { id: "g2", name: "All Managers", type: "management", members: 5 },
    { id: "g3", name: "Celebration", type: "topic", members: 26 },
    { id: "g4", name: "Everyone Working Tomorrow", type: "schedule", members: 14 },
    { id: "g5", name: "EMT", type: "role", members: 18 },
    { id: "g6", name: "Advanced Care", type: "role", members: 8 },
  ];
  
  const teamMembers: TeamMemberType[] = [
    { id: "tm1", name: "Andrew Taylor", initials: "AT", status: "online" },
    { id: "tm2", name: "Baron Randle", initials: "BR", status: "offline" },
    { id: "tm3", name: "Blake Gatewood", initials: "BG", status: "away" },
    { id: "tm4", name: "Chaz Oneal", initials: "CO", status: "online" },
    { id: "tm5", name: "Christian Moreland", initials: "CM", status: "online" },
    { id: "tm6", name: "Daniel Lalor-McGiboney", initials: "DL", status: "offline" },
    { id: "tm7", name: "Ishmael Grogan", initials: "IG", status: "online" },
    { id: "tm8", name: "jalik rideout", initials: "JR", status: "away" },
    { id: "tm9", name: "Joseph Pinto", initials: "JP", status: "online" },
    { id: "tm10", name: "Justen Baker", initials: "JB", status: "online" },
    { id: "tm11", name: "Kaelyn holland", initials: "KH", status: "offline" },
    { id: "tm12", name: "Lakisha Mason", initials: "LM", status: "online" },
    { id: "tm13", name: "Renard Jenkins", initials: "RJ", status: "away" },
  ];
  
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleMemberSelection = (member: TeamMemberType) => {
    if (selectedMembers.some(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };
  
  const toggleGroupSelection = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };
  
  const deselectAll = () => {
    setSelectedMembers([]);
    setSelectedGroups([]);
  };
  
  const getMemberStatus = (status?: 'online' | 'offline' | 'away') => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': 
      default: return 'bg-gray-300';
    }
  };
  
  const handleStartMessage = () => {
    if (selectedMembers.length === 0 && selectedGroups.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one recipient",
        variant: "destructive"
      });
      return;
    }
    
    setStep('compose');
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }
    
    // Gather all recipient names for the callback
    const recipientNames = [
      ...selectedMembers.map(m => m.name),
      ...selectedGroups.map(gId => groups.find(g => g.id === gId)?.name || '')
    ].filter(Boolean);
    
    onMessageSent(recipientNames, messageText);
    
    // Reset and close dialog
    setStep('recipients');
    setSelectedMembers([]);
    setSelectedGroups([]);
    setMessageText("");
    setIsUrgent(false);
    setSearchQuery("");
    onOpenChange(false);
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${recipientNames.length} recipient(s)`,
    });
  };
  
  const handleClose = () => {
    // Reset state when dialog closes
    setStep('recipients');
    setSelectedMembers([]);
    setSelectedGroups([]);
    setMessageText("");
    setIsUrgent(false);
    setSearchQuery("");
    onOpenChange(false);
  };
  
  // Get total selected count
  const totalSelected = selectedMembers.length + selectedGroups.length;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center">
            {step === 'compose' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 h-8 w-8 p-0" 
                onClick={() => setStep('recipients')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-lg">
              {step === 'recipients' ? "New Message" : "Compose Message"}
            </DialogTitle>
          </div>
          <DialogClose 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        {step === 'recipients' ? (
          <div className="px-4 py-3">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Select a Group</h3>
              <div className="flex flex-wrap gap-2">
                {groups.map(group => (
                  <Badge 
                    key={group.id}
                    variant={selectedGroups.includes(group.id) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedGroups.includes(group.id) ? 'bg-primary hover:bg-primary/90' : 'bg-background hover:bg-accent'}`}
                    onClick={() => toggleGroupSelection(group.id)}
                  >
                    {group.name}
                    {selectedGroups.includes(group.id) && (
                      <X className="ml-1 h-3 w-3" onClick={(e) => {
                        e.stopPropagation();
                        toggleGroupSelection(group.id);
                      }} />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">
                Team Members Selected ({totalSelected})
              </h3>
              {totalSelected > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-sm text-primary"
                  onClick={deselectAll}
                >
                  Deselect All
                </Button>
              )}
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Team Members"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {filteredMembers.map(member => (
                  <div 
                    key={member.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${
                      selectedMembers.some(m => m.id === member.id) ? 'bg-accent/50' : ''
                    }`}
                    onClick={() => toggleMemberSelection(member)}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 mr-3">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className={`absolute right-2 bottom-0 w-2.5 h-2.5 rounded-full ${getMemberStatus(member.status)} border-2 border-background`}></span>
                    </div>
                    <span className="flex-1">{member.name}</span>
                    {selectedMembers.some(m => m.id === member.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-4 pt-4 border-t">
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                disabled={totalSelected === 0}
                onClick={handleStartMessage}
              >
                Start Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4">
              <Label htmlFor="recipients" className="text-sm font-medium">To:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedGroups.map(groupId => {
                  const group = groups.find(g => g.id === groupId);
                  return group ? (
                    <Badge key={group.id} variant="outline" className="bg-primary/10 text-primary">
                      <Users className="h-3 w-3 mr-1" />
                      {group.name}
                      <X 
                        className="ml-1 h-3 w-3 hover:text-destructive" 
                        onClick={() => toggleGroupSelection(group.id)}
                      />
                    </Badge>
                  ) : null;
                })}
                
                {selectedMembers.map(member => (
                  <Badge key={member.id} variant="outline" className="bg-primary/10 text-primary">
                    <User className="h-3 w-3 mr-1" />
                    {member.name}
                    <X 
                      className="ml-1 h-3 w-3 hover:text-destructive" 
                      onClick={() => toggleMemberSelection(member)}
                    />
                  </Badge>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 px-2 border border-dashed rounded-md"
                  onClick={() => setStep('recipients')}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Add</span>
                </Button>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="message" className="text-sm font-medium">Message:</Label>
                <textarea
                  id="message"
                  className="mt-1 w-full h-[200px] p-3 rounded-md border border-input bg-transparent text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={isUrgent ? "bg-red-100 text-red-800 border-red-300" : ""}
                  onClick={() => setIsUrgent(!isUrgent)}
                >
                  {isUrgent ? "Urgent" : "Mark as Urgent"}
                </Button>
                
                <div className="flex-1 text-right text-xs text-muted-foreground">
                  {messageText.length} characters
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <SendHorizontal className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
