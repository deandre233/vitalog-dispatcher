
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";

interface EmptyStateMessageProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyStateMessage({ 
  title, 
  description, 
  onAction, 
  actionLabel = "New Message"
}: EmptyStateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center space-y-4">
      <div className="rounded-full bg-primary/10 p-3">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
