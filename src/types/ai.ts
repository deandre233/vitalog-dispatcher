
export interface AIRecommendation {
  recommendation: string;
  confidence: number;
  source?: string;
  context?: string;
  timestamp?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastActive?: string;
}

export interface TeamMessage {
  id: string;
  senderId: string;
  channelId: string;
  message: string;
  isImportant: boolean;
  createdAt: string;
}

export interface EmployeeNotification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'achievement' | 'message';
  isRead: boolean;
  createdAt: string;
  aiMetadata?: AIRecommendation;
  teamMessageId?: string;
}
