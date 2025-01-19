import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    fetchInsuranceRecords();
    fetchBillingSettings();
  }, [patientId]);

  const fetchInsuranceRecords = async () => {
    const { data, error } = await supabase
      .from('insurance_records')
      .select('*')
      .eq('patient_id', patientId);

    if (error) {
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
  };

  const fetchBillingSettings = async () => {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('*')
      .eq('patient_id', patientId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
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

      toast({
        title: "Success",
        description: "Billing information saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save billing information",
        variant: "destructive",
      });
    }
  };

  const InsuranceSection = ({ type, record }: { type: 'primary' | 'secondary' | 'reserved', record?: InsuranceRecord }) => (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 capitalize">{type} Insurance</h3>
      <div className="space-y-4">
        <div>
          <Label>Carrier Type</Label>
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
          <Label>Carrier Name</Label>
          <Input
            value={record?.carrier_name}
            onChange={(e) => handleInsuranceChange(type, 'carrier_name', e.target.value)}
          />
        </div>
        <div>
          <Label>Policy Number</Label>
          <Input
            value={record?.policy_number}
            onChange={(e) => handleInsuranceChange(type, 'policy_number', e.target.value)}
          />
        </div>
        <div>
          <Label>Claims Phone</Label>
          <Input
            value={record?.phone}
            onChange={(e) => handleInsuranceChange(type, 'phone', e.target.value)}
          />
        </div>
        <div>
          <Label>Claims ZIP</Label>
          <Input
            value={record?.claims_zip}
            onChange={(e) => handleInsuranceChange(type, 'claims_zip', e.target.value)}
          />
        </div>
        <div>
          <Label>Activation Date</Label>
          <Input
            type="date"
            value={record?.activation_date}
            onChange={(e) => handleInsuranceChange(type, 'activation_date', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
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

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Save Insurance Info</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={saveOptions.currentCheckpoint}
              onCheckedChange={(checked) => 
                setSaveOptions(prev => ({ ...prev, currentCheckpoint: checked as boolean }))
              }
            />
            <Label>Save to currently selected checkpoint (2025-01-06)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={saveOptions.createSupplementary}
              onCheckedChange={(checked) => 
                setSaveOptions(prev => ({ ...prev, createSupplementary: checked as boolean }))
              }
            />
            <Label>Create a supplementary checkpoint for the current dispatch</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={saveOptions.saveAllFuture}
              onCheckedChange={(checked) => 
                setSaveOptions(prev => ({ ...prev, saveAllFuture: checked as boolean }))
              }
            />
            <Label>Save all changes to future records</Label>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Preauth & Pricing</h3>
        <div className="space-y-4">
          <div>
            <Label>Preauth Required</Label>
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
            <Label>Pricing Schema</Label>
            <Select
              value={billingSettings.pricing_schema}
              onValueChange={(value) => handleBillingSettingsChange('pricing_schema', value)}
            >
              <option value="retail">Retail</option>
              <option value="insurance">Insurance</option>
            </Select>
          </div>
          <div>
            <Label>Subscription Type</Label>
            <Select
              value={billingSettings.subscription_type}
              onValueChange={(value) => handleBillingSettingsChange('subscription_type', value)}
            >
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </Select>
          </div>
          <div>
            <Label>Next Payment Date</Label>
            <Input
              type="date"
              value={billingSettings.next_payment_date}
              onChange={(e) => handleBillingSettingsChange('next_payment_date', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Employer Information</h3>
        <div className="space-y-4">
          <div>
            <Label>Employer Name</Label>
            <Input
              value={billingSettings.employer_name}
              onChange={(e) => handleBillingSettingsChange('employer_name', e.target.value)}
            />
          </div>
          <div>
            <Label>Employer Phone</Label>
            <Input
              value={billingSettings.employer_phone}
              onChange={(e) => handleBillingSettingsChange('employer_phone', e.target.value)}
            />
          </div>
          <div>
            <Label>Employer Address</Label>
            <Input
              value={billingSettings.employer_address}
              onChange={(e) => handleBillingSettingsChange('employer_address', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
