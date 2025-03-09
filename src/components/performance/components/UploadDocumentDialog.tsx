
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  employeeId
}: UploadDocumentDialogProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter notes for the document",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error } = await supabase
        .from('employee_documents' as any)
        .insert({
          employee_id: employeeId,
          document_type: 'performance_note',
          notes: notes,
          created_at: new Date().toISOString(),
          status: 'active',
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Document has been uploaded to employee record",
      });
      
      onOpenChange(false);
      setNotes("");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Performance Document</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Document Notes:
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter performance notes or documentation..."
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
