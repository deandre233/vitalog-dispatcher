
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Announcement } from "./AnnouncementList";
import { CalendarClock, Save, FileText, Wand2 } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSuccess: () => void;
}

const targetGroupOptions = [
  { id: "supervisors", label: "Supervisors" },
  { id: "dispatchers", label: "Dispatchers" },
  { id: "callTakers", label: "Call Takers" },
  { id: "billers", label: "Billers" },
  { id: "qaReviewers", label: "QA Reviewers" },
  { id: "hrStaff", label: "HR Staff" },
  { id: "mechanics", label: "Mechanics" },
  { id: "salespeople", label: "Salespeople" },
  { id: "crew", label: "Crew" },
  { id: "allStaff", label: "All Staff" },
];

export const AnnouncementForm = ({ announcement, onSuccess }: AnnouncementFormProps) => {
  const [title, setTitle] = useState(announcement?.title || "");
  const [content, setContent] = useState(announcement?.content || "");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    announcement?.expiresAt ? new Date(announcement.expiresAt) : undefined
  );
  const [targetGroups, setTargetGroups] = useState<string[]>(
    announcement?.targetGroups || []
  );
  const [requiresSignature, setRequiresSignature] = useState(
    announcement?.requiresSignature || false
  );
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onSuccess();
  };

  const handleTargetGroupChange = (id: string, checked: boolean) => {
    if (checked) {
      setTargetGroups([...targetGroups, id]);
    } else {
      setTargetGroups(targetGroups.filter(group => group !== id));
    }
  };

  const handleAiSuggestion = async () => {
    setIsLoadingAi(true);
    
    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions = [
      "We are pleased to announce a new feature has been added to our dispatch system that will help improve response times.",
      "Important update: We will be conducting a mandatory training session on the updated protocol next week.",
      "Please note that we have updated our billing procedures. The changes will take effect on the first of next month."
    ];
    
    setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    setIsLoadingAi(false);
  };

  const handleUseSuggestion = () => {
    setContent(aiSuggestion);
    setAiSuggestion("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Announcement Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear, concise title"
            required
          />
        </div>

        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Write Content
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              AI Assistance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="content">Announcement Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the announcement details"
                className="min-h-[200px]"
                required
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>AI Content Generator</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={isLoadingAi}
                      onClick={handleAiSuggestion}
                    >
                      {isLoadingAi ? <LoadingSpinner size={16} className="mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                      Generate
                    </Button>
                  </div>
                  
                  {aiSuggestion && (
                    <div className="border p-4 rounded-md bg-slate-50">
                      <p className="mb-3">{aiSuggestion}</p>
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={handleUseSuggestion}
                      >
                        Use This Suggestion
                      </Button>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="ai-content">Current Content</Label>
                    <Textarea
                      id="ai-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="AI will help you generate content"
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <Label>Expiration Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <DatePicker date={expiresAt} setDate={setExpiresAt} />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="isScheduled" 
                  checked={isScheduled}
                  onCheckedChange={(checked) => setIsScheduled(checked as boolean)}
                />
                <Label htmlFor="isScheduled" className="font-normal">Schedule for later publication</Label>
              </div>
              
              {isScheduled && (
                <div className="ml-6 mt-2">
                  <Label>Publication Date</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <DatePicker date={scheduledDate} setDate={setScheduledDate} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="requiresSignature" 
                  checked={requiresSignature}
                  onCheckedChange={(checked) => setRequiresSignature(checked as boolean)}
                />
                <Label htmlFor="requiresSignature" className="font-normal">Requires acknowledgment signature</Label>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <Label>Target Groups</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {targetGroupOptions.map(option => (
                <div key={option.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={option.id} 
                    checked={targetGroups.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleTargetGroupChange(option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={option.id} className="font-normal">{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size={16} className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {announcement ? "Update" : "Publish"} Announcement
        </Button>
      </div>
    </form>
  );
};
