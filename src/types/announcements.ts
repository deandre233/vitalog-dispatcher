
export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Acknowledgment {
  userId: string;
  timestamp: Date;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  isPinned: boolean;
  priority: AnnouncementPriority;
  expiresAt?: Date;
  acknowledgments: Acknowledgment[];
  attachments?: string[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  department?: string;
  email?: string;
  isOnline?: boolean;
}
