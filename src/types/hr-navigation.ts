import { LucideIcon } from "lucide-react";

export interface HRNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: {
    text: string;
  };
}