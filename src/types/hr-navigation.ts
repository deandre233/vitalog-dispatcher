export interface HRNavigationItem {
  label: string;
  icon: string;
  href: string;
  badge?: {
    count?: number;
    text?: string;
  };
}

export type HRNavigationSection = {
  items: HRNavigationItem[];
};