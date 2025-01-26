import { LucideIcon } from "lucide-react";

export interface HRNavigationItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: {
    count?: number;
    text?: string;
  };
}

export type HRNavigationSection = {
  items: HRNavigationItem[];
};