
export interface ModuleConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  features: ModuleFeature[];
  aiEnabled: boolean;
}

export interface ModuleFeature {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  badge?: {
    text: string;
    variant: 'default' | 'outline' | 'secondary' | 'destructive';
  };
}
