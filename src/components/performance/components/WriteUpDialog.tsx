
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WriteUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  generatedWriteUp: string;
  writeUpSeverity: string;
  writeUpSubject: string;
  onWriteUpSeverityChange: (value: string) => void;
}

export function WriteUpDialog({
  open,
  onOpenChange,
  employeeId,
  generatedWriteUp,
  writeUpSeverity,
  writeUpSubject,
  onWriteUpSeverityChange
}: WriteUpDialogProps) {
  const [customNotes, setCustomNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUploadWriteUp = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const finalWriteUp = customNotes || generatedWriteUp;
      
      const { error } = await supabase
        .from('corrective_actions')
        .insert({
          employee_id: employeeId,
          action_type: writeUpSeverity,
          description: finalWriteUp,
          improvement_plan: `Improvement plan for ${writeUpSubject}`,
          issue_date: new Date().toISOString(),
          follow_up_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Performance write-up has been saved to employee record",
      });
      
      onOpenChange(false);
      setCustomNotes("");
    } catch (error) {
      console.error("Error saving write-up:", error);
      toast({
        title: "Error",
        description: "Failed to save performance write-up",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Performance Write-up</DialogTitle>
          <DialogDescription>
            Review the AI-generated write-up or customize it before saving to the employee record.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="severity" className="text-sm font-medium">Severity Level:</label>
            <Select 
              value={writeUpSeverity} 
              onValueChange={onWriteUpSeverityChange}
            >
              <SelectTrigger id="severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recognition">Recognition</SelectItem>
                <SelectItem value="advisory">Advisory</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="improvement-plan">Improvement Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="writeup" className="text-sm font-medium">Generated Write-up:</label>
            <Textarea
              id="writeup"
              value={generatedWriteUp}
              readOnly
              className="h-64 font-mono text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <label htmlFor="customNotes" className="text-sm font-medium">
              Custom Notes (optional):
            </label>
            <Textarea
              id="customNotes"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Add your own notes or edit the generated write-up..."
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUploadWriteUp} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save to Employee Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
