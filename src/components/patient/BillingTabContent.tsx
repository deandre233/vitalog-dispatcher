import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, CreditCard, Receipt, Save, Check, AlertCircle, Info } from "lucide-react";

interface InsuranceRecord {
  id?: string;
  type: 'primary' | 'secondary' | 'reserved';
  carrier_type: string;
  carrier_name: string;
  policy_number: string;
  phone?: string;
  claims_zip?: string;
  activation_date?: string;
}

interface BillingSettings {
  id?: string;
  preauth_required?: 'situational' | 'always' | 'never';
  pricing_schema?: 'retail' | 'insurance';
  subscription_type?: 'monthly' | 'annually';
  next_payment_date?: string;
  employer_name?: string;
  employer_phone?: string;
  employer_address?: string;
}

interface BillingTabContentProps {
  patientId: string;
}

const isValidInsuranceType = (type: string): type is InsuranceRecord['type'] => {
  return ['primary', 'secondary', 'reserved'].includes(type);
};

const isValidPreauthRequired = (value: string): value is BillingSettings['preauth_required'] => {
  return ['situational', 'always', 'never'].includes(value);
};

const isValidPricingSchema = (value: string): value is BillingSettings['pricing_schema'] => {
  return ['retail', 'insurance'].includes(value);
};

const isValidSubscriptionType = (value: string): value is BillingSettings['subscription_type'] => {
  return ['monthly', 'annually'].includes(value);
};

export const BillingTabContent = ({ patientId }: BillingTabContentProps) => {
  const { toast } = useToast();
  const [insuranceRecords, setInsuranceRecords] = useState<InsuranceRecord[]>([]);
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({});
  const [saveOptions, setSaveOptions] = useState({
    currentCheckpoint: true,
    createSupplementary: false,
    saveAllFuture: false
  });

  useEffect(() => {
    if (!patientId) {
      console.error('No patient ID provided');
      toast({
        title: "Error",
        description: "Patient ID is required to fetch billing information",
        variant: "destructive",
      });
      return;
    }
    
    fetchInsuranceRecords();
    fetchBillingSettings();
  }, [patientId]);

  const fetchInsuranceRecords = async () => {
    try {
      if (!patientId) return;

      const { data, error } = await supabase
        .from('insurance_records')
        .select('*')
        .eq('patient_id', patientId);

      if (error) {
        console.error('Error fetching insurance records:', error);
        toast({
          title: "Error",
          description: "Failed to fetch insurance records",
          variant: "destructive",
        });
        return;
      }

      // Validate and transform the data
      const validatedRecords: InsuranceRecord[] = (data || []).map(record => ({
        ...record,
        type: isValidInsuranceType(record.type) ? record.type : 'primary'
      }));

      setInsuranceRecords(validatedRecords);
    } catch (err) {
      console.error('Unexpected error in fetchInsuranceRecords:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching insurance records",
        variant: "destructive",
      });
    }
  };

  const fetchBillingSettings = async () => {
    try {
      if (!patientId) return;

      const { data, error } = await supabase
        .from('billing_settings')
        .select('*')
        .eq('patient_id', patientId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching billing settings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch billing settings",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const validatedSettings: BillingSettings = {
          ...data,
          preauth_required: isValidPreauthRequired(data.preauth_required) ? data.preauth_required : undefined,
          pricing_schema: isValidPricingSchema(data.pricing_schema) ? data.pricing_schema : undefined,
          subscription_type: isValidSubscriptionType(data.subscription_type) ? data.subscription_type : undefined
        };
        setBillingSettings(validatedSettings);
      }
    } catch (err) {
      console.error('Unexpected error in fetchBillingSettings:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching billing settings",
        variant: "destructive",
      });
    }
  };

  const handleInsuranceChange = (type: 'primary' | 'secondary' | 'reserved', field: keyof InsuranceRecord, value: string) => {
    setInsuranceRecords(prev => 
      prev.map(record => 
        record.type === type 
          ? { ...record, [field]: value }
          : record
      )
    );
  };

  const handleBillingSettingsChange = (field: keyof BillingSettings, value: string) => {
    setBillingSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const saveToast = toast({
        title: "Saving...",
        description: <div className="flex items-center gap-2"><Save className="animate-spin" size={16} /> Saving billing information</div>,
      });

      // Update insurance records
      for (const record of insuranceRecords) {
        if (record.id) {
          await supabase
            .from('insurance_records')
            .update(record)
            .eq('id', record.id);
        } else {
          await supabase
            .from('insurance_records')
            .insert({ ...record, patient_id: patientId });
        }
      }

      // Update billing settings
      if (billingSettings.id) {
        await supabase
          .from('billing_settings')
          .update(billingSettings)
          .eq('id', billingSettings.id);
      } else {
        await supabase
          .from('billing_settings')
          .insert({ ...billingSettings, patient_id: patientId });
      }

      saveToast.dismiss();
      toast({
        title: "Success",
        description: <div className="flex items-center gap-2"><Check className="text-green-500" size={16} /> Billing information saved successfully</div>,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: <div className="flex items-center gap-2"><AlertCircle className="text-red-500" size={16} /> Failed to save billing information</div>,
        variant: "destructive",
      });
    }
  };

  const InsuranceSection = ({ type, record }: { type: 'primary' | 'secondary' | 'reserved', record?: InsuranceRecord }) => (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold capitalize">{type} Insurance</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Carrier Type</Label>
            <Select
              value={record?.carrier_type}
              onValueChange={(value) => handleInsuranceChange(type, 'carrier_type', value)}
            >
              <option value="Medicare">Medicare</option>
              <option value="Medicaid">Medicaid</option>
              <option value="Private">Private Insurance</option>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Carrier Name</Label>
            <Input
              value={record?.carrier_name}
              onChange={(e) => handleInsuranceChange(type, 'carrier_name', e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Policy Number</Label>
            <Input
              value={record?.policy_number}
              onChange={(e) => handleInsuranceChange(type, 'policy_number', e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Claims Phone</Label>
            <Input
              value={record?.phone}
              onChange={(e) => handleInsuranceChange(type, 'phone', e.target.value)}
              className="h-9"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Claims ZIP</Label>
            <Input
              value={record?.claims_zip}
              onChange={(e) => handleInsuranceChange(type, 'claims_zip', e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Activation Date</Label>
            <Input
              type="date"
              value={record?.activation_date}
              onChange={(e) => handleInsuranceChange(type, 'activation_date', e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <InsuranceSection 
          type="primary" 
          record={insuranceRecords.find(r => r.type === 'primary')} 
        />
        <InsuranceSection 
          type="secondary" 
          record={insuranceRecords.find(r => r.type === 'secondary')} 
        />
        <InsuranceSection 
          type="reserved" 
          record={insuranceRecords.find(r => r.type === 'reserved')} 
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Save className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Save Insurance Info</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={saveOptions.currentCheckpoint}
              onCheckedChange={(checked) => 
                setSaveOptions(prev => ({ ...prev, currentCheckpoint: checked as boolean }))
              }
            />
            <Label className="text-sm">Save to currently selected checkpoint (2025-01-06)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={saveOptions.createSupplementary}
              onCheckedChange={(checked) => 
                setSaveOptions(prev => ({ ...prev, createSupplementary: checked as boolean }))
              }
            />
            <Label className="text-sm">Create a supplementary checkpoint for the current dispatch</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={saveOptions.saveAllFuture}
              onCheckedChange={(checked) => 
                setSaveOptions(prev => ({ ...prev, saveAllFuture: checked as boolean }))
              }
            />
            <Label className="text-sm">Save all changes to future records</Label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Preauth & Pricing</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium">Preauth Required</Label>
            <Select
              value={billingSettings.preauth_required}
              onValueChange={(value) => handleBillingSettingsChange('preauth_required', value)}
            >
              <option value="situational">Situational</option>
              <option value="always">Always</option>
              <option value="never">Never</option>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Pricing Schema</Label>
            <Select
              value={billingSettings.pricing_schema}
              onValueChange={(value) => handleBillingSettingsChange('pricing_schema', value)}
            >
              <option value="retail">Retail</option>
              <option value="insurance">Insurance</option>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Subscription Type</Label>
            <Select
              value={billingSettings.subscription_type}
              onValueChange={(value) => handleBillingSettingsChange('subscription_type', value)}
            >
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Next Payment Date</Label>
            <Input
              type="date"
              value={billingSettings.next_payment_date}
              onChange={(e) => handleBillingSettingsChange('next_payment_date', e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Employer Information</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium">Employer Name</Label>
            <Input
              value={billingSettings.employer_name}
              onChange={(e) => handleBillingSettingsChange('employer_name', e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Employer Phone</Label>
            <Input
              value={billingSettings.employer_phone}
              onChange={(e) => handleBillingSettingsChange('employer_phone', e.target.value)}
              className="h-9"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm font-medium">Employer Address</Label>
            <Input
              value={billingSettings.employer_address}
              onChange={(e) => handleBillingSettingsChange('employer_address', e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};
