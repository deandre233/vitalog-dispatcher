
export interface AgencyProfile {
  id: string;
  name: string;
  subdomain: string;
  npi_number?: string;
  subscription_tier: 'basic' | 'pro' | 'enterprise';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  branding_config: Record<string, any>;
  billing_email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  is_active: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  features: Record<string, boolean>;
  monthly_price: number;
  annual_price: number;
  stripe_price_id_monthly?: string;
  stripe_price_id_annual?: string;
  created_at: string;
}

export interface AIConfiguration {
  id: string;
  agency_id: string;
  module_type: string;
  settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClearinghouseConfig {
  id: string;
  agency_id: string;
  provider: string;
  credentials: Record<string, any>;
  settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
