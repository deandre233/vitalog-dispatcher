
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RefreshCw, Copy, Send, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIMessageGeneratorProps {
  onSelectMessage: (message: string) => void;
  onClose: () => void;
}

export function AIMessageGenerator({ onSelectMessage, onClose }: AIMessageGeneratorProps) {
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const generateMessage = async () => {
    setIsGenerating(true);
    setError("");
    
    try {
      const { data, error } = await supabase.functions.invoke("message-ai", {
        body: {
          operation: "generate",
          recipient,
          topic
        }
      });

      if (error) throw error;

      setGeneratedMessage(data.text);
    } catch (err) {
      console.error("Failed to generate message:", err);
      setError("Failed to generate message. Please try again.");
      toast({
        title: "Error",
        description: "Failed to generate message",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Message copied to clipboard"
    });
  };

  const useMessage = () => {
    onSelectMessage(generatedMessage);
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-orange-500 mr-2" />
          AI Message Generator
        </CardTitle>
        <CardDescription>
          Let AI help you craft the perfect message
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient</Label>
          <Input 
            id="recipient" 
            placeholder="Team, Manager, Client, etc."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic or Message Intent</Label>
          <Input 
            id="topic" 
            placeholder="Meeting update, project status, thank you note..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={generateMessage} 
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Message
            </>
          )}
        </Button>
        
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {generatedMessage && (
          <div className="mt-4 space-y-2">
            <Label>Generated Message</Label>
            <div className="relative">
              <Textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="min-h-[120px] resize-y"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {generatedMessage && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={useMessage}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Use This Message
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
