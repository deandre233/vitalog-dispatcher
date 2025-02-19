
export interface Bulletin {
  id: number;
  title: string;
  author: string;
  expiry: string;
  targetGroups: string[];
  status: 'active' | 'expired';
  requiresSignature: boolean;
  seenBy: number;
  priority: 'low' | 'medium' | 'high';
}
