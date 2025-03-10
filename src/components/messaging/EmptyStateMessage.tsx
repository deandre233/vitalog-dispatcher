
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Sparkles } from "lucide-react";

interface EmptyStateMessageProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
  onAIAssist?: () => void;
}

export function EmptyStateMessage({ 
  title, 
  description, 
  onAction, 
  actionLabel = "New Message",
  onAIAssist
}: EmptyStateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center space-y-4">
      <div className="rounded-full bg-primary/10 p-3">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        {onAction && (
          <Button onClick={onAction} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        {onAIAssist && (
          <Button 
            onClick={onAIAssist} 
            variant="outline" 
            className="mt-2 border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Sparkles className="h-4 w-4 mr-2 text-orange-500" />
            AI Assistance
          </Button>
        )}
      </div>
    </div>
  );
}
