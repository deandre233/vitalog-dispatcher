
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, RefreshCw, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AITextCorrectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialText?: string;
  onApply: (correctedText: string) => void;
}

export function AITextCorrection({ 
  open, 
  onOpenChange, 
  initialText = "", 
  onApply 
}: AITextCorrectionProps) {
  const [inputText, setInputText] = useState(initialText);
  const [correctedText, setCorrectedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "correct">("edit");
  const { toast } = useToast();

  const correctText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to correct",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("message-ai", {
        body: {
          operation: "autocorrect",
          text: inputText
        }
      });

      if (error) throw error;

      setCorrectedText(data.text);
      setActiveTab("correct");
    } catch (err) {
      console.error("Failed to correct text:", err);
      toast({
        title: "Error",
        description: "Failed to process your text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    onApply(correctedText);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-orange-500 mr-2" />
            AI Text Correction
          </DialogTitle>
          <DialogDescription>
            Let AI help you fix spelling, grammar, and punctuation errors
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "correct")} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="edit">Your Text</TabsTrigger>
              <TabsTrigger value="correct" disabled={!correctedText}>Corrected Text</TabsTrigger>
            </TabsList>
            
            <div className={activeTab === "edit" ? "block" : "hidden"}>
              <Textarea
                placeholder="Type or paste your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px] resize-y"
              />
            </div>
            
            <div className={activeTab === "correct" ? "block" : "hidden"}>
              {correctedText ? (
                <Textarea
                  value={correctedText}
                  onChange={(e) => setCorrectedText(e.target.value)}
                  className="min-h-[150px] resize-y bg-orange-50/50 border-orange-200"
                />
              ) : (
                <div className="flex items-center justify-center h-[150px] bg-muted/20 rounded-md border">
                  <p className="text-muted-foreground">Corrected text will appear here</p>
                </div>
              )}
            </div>
          </Tabs>
          
          {activeTab === "edit" && (
            <Button 
              onClick={correctText} 
              disabled={isProcessing || !inputText.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Correct Text
                </>
              )}
            </Button>
          )}
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {correctedText && activeTab === "correct" && (
            <Button 
              onClick={handleApply}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Corrections
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
