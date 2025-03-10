
import { Bell, CheckCircle, AlertTriangle, InfoIcon, MessageSquare } from "lucide-react";
import { ReactNode } from "react";
import type { AIInsight as ServiceQueueAIInsight } from "@/types/service-queue";
import type { AIInsight as AiTsAIInsight } from "@/types/ai";

// Type adapters to convert between different AIInsight formats
export const adaptAIInsightToServiceQueue = (insight: AiTsAIInsight): ServiceQueueAIInsight => {
  return {
    type: insight.type === 'info' ? 'optimization' : 
           insight.type === 'warning' ? 'warning' : 'prediction',
    message: insight.description,
    confidence: typeof insight.severity === 'string' ? 
               (insight.severity === 'high' ? 0.9 : 
                insight.severity === 'medium' ? 0.7 : 0.5) : 0.7,
    impact: typeof insight.severity === 'string' ? 
            insight.severity as 'low' | 'medium' | 'high' : 'medium'
  };
};

export const adaptLegacyInsightToServiceQueue = (insight: any): ServiceQueueAIInsight => {
  // Ensure we have all required fields with sensible defaults
  return {
    type: insight.type || 'optimization',
    message: insight.message || insight.description || "No message available",
    confidence: insight.confidence_score ? insight.confidence_score / 100 : 
               insight.confidence || 0.7,
    impact: insight.impact || insight.severity || 'medium'
  };
};

export const getNotificationIcon = (type: string): JSX.Element => {
  switch (type) {
    case 'info':
      return <InfoIcon className="h-4 w-4 text-blue-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'achievement':
      return <Bell className="h-4 w-4 text-purple-500" />;
    case 'message':
      return <MessageSquare className="h-4 w-4 text-indigo-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export const getRelativeTime = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
};

export const mapNotificationData = (data: any, employeeId: string) => {
  return {
    id: data.id,
    employeeId: employeeId,
    title: data.title,
    message: data.message,
    type: data.type,
    isRead: data.is_read,
    createdAt: data.created_at,
    aiMetadata: data.ai_metadata,
    teamMessageId: data.team_message_id,
    sender_name: data.sender_name || ''
  };
};
