import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, CreditCard, Receipt, Save, Check, AlertCircle, Upload } from "lucide-react";

interface InsuranceRecord {
  id?: string;
  type: 'primary' | 'secondary' | 'reserved';
  carrier_type: string;
  carrier_name: string;
  policy_type?: string;
  group_number?: string;
  group_name?: string;
  policy_number: string;
  phone?: string;
  claims_zip?: string;
  activation_date?: string;
  patient_relation?: string;
  policyholder_name?: string;
  policyholder_dob?: string;
  policyholder_gender?: string;
  policyholder_phone?: string;
  payor_id?: string;
  nsure_payor_code?: string;
}

interface BillingSettings {
  id?: string;
  preauth_required?: 'situational' | 'always' | 'never';
  pricing_schema?: 'retail' | 'insurance';
  subscription_type?: 'none' | 'monthly' | 'annually';
  subscription_amount?: number;
  next_payment_date?: string;
  employer_name?: string;
  employer_phone?: string;
  employer_address?: string;
  patient_notes?: string;
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
  return ['none', 'monthly', 'annually'].includes(value);
};

export const BillingTabContent = ({ patientId }: BillingTabContentProps) => {
  const { toast } = useToast();
  const [insuranceRecords, setInsuranceRecords] = useState<InsuranceRecord[]>([]);
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({});
  const [saveOptions, setSaveOptions] = useState({
    currentCheckpoint: true,
    createSupplementary: false,
    saveAllFuture: false,
    dateRange: {
      from: '',
      to: ''
    }
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

  const handleBillingSettingsChange = (field: keyof BillingSettings, value: string | number) => {
    setBillingSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAttachCards = () => {
    toast({
      title: "Coming Soon",
      description: "Insurance card upload functionality will be available soon",
    });
  };

  const handleSave = async () => {
    try {
      if (!patientId) {
        toast({
          title: "Error",
          description: "Patient ID is required to save billing information",
          variant: "destructive",
        });
        return;
      }

      // Update insurance records
      for (const record of insuranceRecords) {
        if (record.id) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('insurance_records')
            .update({
              carrier_type: record.carrier_type,
              carrier_name: record.carrier_name,
              policy_type: record.policy_type,
              group_number: record.group_number,
              group_name: record.group_name,
              policy_number: record.policy_number,
              phone: record.phone,
              claims_zip: record.claims_zip,
              activation_date: record.activation_date,
              patient_relation: record.patient_relation,
              policyholder_name: record.policyholder_name,
              policyholder_dob: record.policyholder_dob,
              policyholder_gender: record.policyholder_gender,
              policyholder_phone: record.policyholder_phone,
              payor_id: record.payor_id,
              nsure_payor_code: record.nsure_payor_code,
            })
            .eq('id', record.id);

          if (updateError) {
            console.error('Error updating insurance record:', updateError);
            toast({
              title: "Error",
              description: "Failed to update insurance record",
              variant: "destructive",
            });
            return;
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('insurance_records')
            .insert({
              patient_id: patientId,
              type: record.type,
              carrier_type: record.carrier_type,
              carrier_name: record.carrier_name,
              policy_type: record.policy_type,
              group_number: record.group_number,
              group_name: record.group_name,
              policy_number: record.policy_number,
              phone: record.phone,
              claims_zip: record.claims_zip,
              activation_date: record.activation_date,
              patient_relation: record.patient_relation,
              policyholder_name: record.policyholder_name,
              policyholder_dob: record.policyholder_dob,
              policyholder_gender: record.policyholder_gender,
              policyholder_phone: record.policyholder_phone,
              payor_id: record.payor_id,
              nsure_payor_code: record.nsure_payor_code,
            });

          if (insertError) {
            console.error('Error inserting insurance record:', insertError);
            toast({
              title: "Error",
              description: "Failed to create insurance record",
              variant: "destructive",
            });
            return;
          }
        }
      }

      // Update billing settings
      if (billingSettings.id) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('billing_settings')
          .update({
            preauth_required: billingSettings.preauth_required,
            pricing_schema: billingSettings.pricing_schema,
            subscription_type: billingSettings.subscription_type,
            subscription_amount: billingSettings.subscription_amount,
            next_payment_date: billingSettings.next_payment_date,
            employer_name: billingSettings.employer_name,
            employer_phone: billingSettings.employer_phone,
            employer_address: billingSettings.employer_address,
            patient_notes: billingSettings.patient_notes,
          })
          .eq('id', billingSettings.id);

        if (updateError) {
          console.error('Error updating billing settings:', updateError);
          toast({
            title: "Error",
            description: "Failed to update billing settings",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('billing_settings')
          .insert({
            patient_id: patientId,
            preauth_required: billingSettings.preauth_required,
            pricing_schema: billingSettings.pricing_schema,
            subscription_type: billingSettings.subscription_type,
            subscription_amount: billingSettings.subscription_amount,
            next_payment_date: billingSettings.next_payment_date,
            employer_name: billingSettings.employer_name,
            employer_phone: billingSettings.employer_phone,
            employer_address: billingSettings.employer_address,
            patient_notes: billingSettings.patient_notes,
          });

        if (insertError) {
          console.error('Error inserting billing settings:', insertError);
          toast({
            title: "Error",
            description: "Failed to create billing settings",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Success",
        description: "Billing information saved successfully",
      });

      // Refresh the data
      fetchInsuranceRecords();
      fetchBillingSettings();
    } catch (err) {
      console.error('Unexpected error in handleSave:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving billing information",
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
            <Label className="text-sm font-medium">Policy Type</Label>
            <Select
              value={record?.policy_type}
              onValueChange={(value) => handleInsuranceChange(type, 'policy_type', value)}
            >
              <option value="Medicare part B [MB]">Medicare part B [MB]</option>
              <option value="Medicaid [MC]">Medicaid [MC]</option>
              <option value="Other">Other insurance is primary [47]</option>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Company Name</Label>
          <Input
            value={record?.carrier_name}
            onChange={(e) => handleInsuranceChange(type, 'carrier_name', e.target.value)}
            className="h-9"
            placeholder="e.g. Medicare Georgia"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Payor ID</Label>
            <Input
              value={record?.payor_id}
              onChange={(e) => handleInsuranceChange(type, 'payor_id', e.target.value)}
              className="h-9"
              placeholder="e.g. 10202"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">NSure Payor Code</Label>
            <Input
              value={record?.nsure_payor_code}
              onChange={(e) => handleInsuranceChange(type, 'nsure_payor_code', e.target.value)}
              className="h-9"
              placeholder="e.g. 00472"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Group Number</Label>
            <Input
              value={record?.group_number}
              onChange={(e) => handleInsuranceChange(type, 'group_number', e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Group Name</Label>
            <Input
              value={record?.group_name}
              onChange={(e) => handleInsuranceChange(type, 'group_name', e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Claims Phone</Label>
            <Input
              value={record?.phone}
              onChange={(e) => handleInsuranceChange(type, 'phone', e.target.value)}
              className="h-9"
              placeholder="(877) 567-7271"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Claims ZIP</Label>
            <Input
              value={record?.claims_zip}
              onChange={(e) => handleInsuranceChange(type, 'claims_zip', e.target.value)}
              className="h-9"
              placeholder="#####"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Patient Relation</Label>
          <Select
            value={record?.patient_relation}
            onValueChange={(value) => handleInsuranceChange(type, 'patient_relation', value)}
          >
            <option value="Self">Self</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Policyholder Information</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={record?.policyholder_name}
              onChange={(e) => handleInsuranceChange(type, 'policyholder_name', e.target.value)}
              className="h-9"
              placeholder="Policyholder Name"
            />
            <Input
              type="date"
              value={record?.policyholder_dob}
              onChange={(e) => handleInsuranceChange(type, 'policyholder_dob', e.target.value)}
              className="h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={record?.policyholder_gender}
              onValueChange={(value) => handleInsuranceChange(type, 'policyholder_gender', value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Not recorded">Not recorded</option>
            </Select>
            <Input
              value={record?.policyholder_phone}
              onChange={(e) => handleInsuranceChange(type, 'policyholder_phone', e.target.value)}
              className="h-9"
              placeholder="Phone"
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
          <Upload className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Insurance Cards</h3>
        </div>
        <Button onClick={handleAttachCards} className="w-full">
          + Attach a Scan of Insurance Cards
        </Button>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Save className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Save Insurance Info</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroup
              value={saveOptions.currentCheckpoint ? "current" : saveOptions.createSupplementary ? "supplementary" : "future"}
              onValueChange={(value) => {
                setSaveOptions({
                  ...saveOptions,
                  currentCheckpoint: value === "current",
                  createSupplementary: value === "supplementary",
                  saveAllFuture: value === "future"
                });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current">Currently selected checkpoint (2025-01-06)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supplementary" id="supplementary" />
                <Label htmlFor="supplementary">Create a supplementary checkpoint for the current dispatch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="future" id="future" />
                <Label htmlFor="future">All checkpoints after the currently selected checkpoint</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="pl-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={Boolean(saveOptions.dateRange.from)}
                onCheckedChange={(checked) => 
                  setSaveOptions(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      from: checked ? '01/01/2025' : ''
                    }
                  }))
                }
              />
              <Label>All checkpoints that cover dates on or after</Label>
              <Input
                type="date"
                value={saveOptions.dateRange.from}
                onChange={(e) => 
                  setSaveOptions(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      from: e.target.value
                    }
                  }))
                }
                className="h-8 w-40"
              />
              <Label>but before</Label>
              <Input
                type="date"
                value={saveOptions.dateRange.to}
                onChange={(e) => 
                  setSaveOptions(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      to: e.target.value
                    }
                  }))
                }
                className="h-8 w-40"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Preauth & Pricing</h3>
        </div>
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Preauth Required</Label>
            <RadioGroup
              value={billingSettings.preauth_required || 'situational'}
              onValueChange={(value: 'situational' | 'always' | 'never') => 
                handleBillingSettingsChange('preauth_required', value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="situational" id="situational" />
                <Label htmlFor="situational">Situational</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="always" id="always" />
                <Label htmlFor="always">Always</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never">Never</Label>
              </div>
            </RadioGroup>
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

          <div className="space-y-4">
            <Label className="text-sm font-medium">Subscription</Label>
            <RadioGroup
              value={billingSettings.subscription_type || 'none'}
              onValueChange={(value: 'none' | 'monthly' | 'annually') => 
                handleBillingSettingsChange('subscription_type', value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None / No flat fee for this price schema</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly for $</Label>
                <Input
                  type="number"
                  value={billingSettings.subscription_type === 'monthly' ? billingSettings.subscription_amount : ''}
                  onChange={(e) => handleBillingSettingsChange('subscription_amount', parseFloat(e.target.value))}
                  className="h-8 w-24"
                  disabled={billingSettings.subscription_type !== 'monthly'}
                />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annually" id="annually" />
                <Label htmlFor="annually">Annually for $</Label>
                <Input
                  type="number"
                  value={billingSettings.subscription_type === 'annually' ? billingSettings.subscription_amount : ''}
                  onChange={(e) => handleBillingSettingsChange('subscription_amount', parseFloat(e.target.value))}
                  className="h-8 w-24"
                  disabled={billingSettings.subscription_type !== 'annually'}
                />
              </div>
            </RadioGroup>
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
          <h3 className="text-lg font-semibold">Patient Notes</h3>
        </div>
        <Textarea
          value={billingSettings.patient_notes}
          onChange={(e) => handleBillingSettingsChange('patient_notes', e.target.value)}
          placeholder="Notes are for internal billing use: they never appear in any report or invoice."
          className="min-h-[100px]"
        />
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
