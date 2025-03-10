import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/common/PhoneInput";
import { SearchBar } from "@/components/common/SearchBar";
import { 
  validateEmail,
  sanitizeString,
  formatFullName,
  truncateString
} from "@/utils/stringUtils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, CreditCard, Receipt, Save, Check, AlertCircle, Upload, Wand2, Loader2 } from "lucide-react";
import type { SearchableItem } from "@/types/common";

interface InsuranceRecord extends SearchableItem {
  id: string; // Make id required
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
  created_at?: string;
  updated_at?: string;
  patient_id?: string;
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
  created_at?: string;
  updated_at?: string;
  patient_id?: string;
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
  const [patientInfo, setPatientInfo] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    phone: ''
  });
  const [saveOptions, setSaveOptions] = useState({
    currentCheckpoint: true,
    createSupplementary: false,
    saveAllFuture: false,
    dateRange: {
      from: '',
      to: ''
    }
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchBillingSettings = async () => {
    try {
      if (!patientId) return;

      const { data, error } = await supabase
        .from('billing_settings')
        .select('*')
        .eq('patient_id', patientId)
        .single();

      if (error) {
        console.error('Error fetching billing settings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch billing settings",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const transformedData: BillingSettings = {
          ...data,
          preauth_required: isValidPreauthRequired(data.preauth_required) ? data.preauth_required : undefined,
          pricing_schema: isValidPricingSchema(data.pricing_schema) ? data.pricing_schema : undefined,
          subscription_type: isValidSubscriptionType(data.subscription_type) ? data.subscription_type : undefined
        };
        console.log('Transformed billing settings:', transformedData);
        setBillingSettings(transformedData);
      }
    } catch (err) {
      console.error('Error in fetchBillingSettings:', err);
    }
  };

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
    fetchPatientInfo();
  }, [patientId]);

  const fetchPatientInfo = async () => {
    try {
      if (!patientId) return;

      const { data, error } = await supabase
        .from('patients')
        .select('first_name, last_name, dob, gender, phone')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error fetching patient info:', error);
        return;
      }

      if (data) {
        setPatientInfo(data);
      }
    } catch (err) {
      console.error('Error in fetchPatientInfo:', err);
    }
  };

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

      const types: ('primary' | 'secondary' | 'reserved')[] = ['primary', 'secondary', 'reserved'];
      const validatedRecords: InsuranceRecord[] = types.map(type => {
        const existingRecord = (data || []).find(r => r.type === type);
        if (existingRecord) {
          return {
            ...existingRecord,
            id: existingRecord.id || `temp-${type}`, // Ensure id exists
            type: isValidInsuranceType(existingRecord.type) ? existingRecord.type : type,
            patient_relation: existingRecord.patient_relation || ''
          };
        }
        return {
          id: `temp-${type}`, // Add temporary id for new records
          type,
          carrier_type: '',
          carrier_name: '',
          policy_number: '',
          patient_relation: ''
        };
      });

      setInsuranceRecords(validatedRecords);
      console.log('Fetched and initialized insurance records:', validatedRecords);
    } catch (err) {
      console.error('Unexpected error in fetchInsuranceRecords:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching insurance records",
        variant: "destructive",
      });
    }
  };

  const analyzePayerId = async (type: 'primary' | 'secondary' | 'reserved', payerId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-payer-id', {
        body: { payerId }
      });

      if (error) {
        console.error('Error analyzing payer ID:', error);
        toast({
          title: "Error",
          description: "Failed to analyze payer ID",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setInsuranceRecords(prev => 
          prev.map(record => 
            record.type === type 
              ? { 
                  ...record, 
                  carrier_type: data.carrier_type,
                  carrier_name: data.carrier_name,
                  policy_type: data.policy_type,
                  payor_id: payerId
                }
              : record
          )
        );

        toast({
          title: "Success",
          description: "Insurance information updated based on payer ID",
        });
      }
    } catch (err) {
      console.error('Error in analyzePayerId:', err);
      toast({
        title: "Error",
        description: "An error occurred while analyzing the payer ID",
        variant: "destructive",
      });
    }
  };

  const handlePatientRelationChange = (type: 'primary' | 'secondary' | 'reserved', value: string) => {
    console.log('Handling patient relation change:', { type, value });
    setInsuranceRecords(prev => 
      prev.map(record => {
        if (record.type === type) {
          if (value === 'Self') {
            console.log('Setting self information for', type);
            return {
              ...record,
              patient_relation: value,
              policyholder_name: `${patientInfo.first_name} ${patientInfo.last_name}`,
              policyholder_dob: patientInfo.dob,
              policyholder_gender: patientInfo.gender,
              policyholder_phone: patientInfo.phone
            };
          } else {
            console.log('Clearing policyholder information for', type);
            return {
              ...record,
              patient_relation: value,
              policyholder_name: '',
              policyholder_dob: '',
              policyholder_gender: '',
              policyholder_phone: ''
            };
          }
        }
        return record;
      })
    );
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

      for (const record of insuranceRecords) {
        if (record.id) {
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

      if (billingSettings.id) {
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

  const handleFileUpload = async (type: 'primary' | 'secondary' | 'reserved', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${patientId}/${fileName}`;

      // Create a new array buffer from the file
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('insurance_cards')
        .upload(filePath, fileData, {
          contentType: file.type,
          cacheControl: '3600'
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('insurance_cards')
        .getPublicUrl(filePath);

      setIsAnalyzing(true);

      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-insurance-card', {
          body: { imageUrl: publicUrl }
        });

      if (analysisError) {
        throw analysisError;
      }

      // Update insurance record with extracted information
      setInsuranceRecords(prev => 
        prev.map(record => 
          record.type === type
            ? {
                ...record,
                carrier_name: analysisData.carrier_name || record.carrier_name,
                carrier_type: analysisData.carrier_type || record.carrier_type,
                policy_number: analysisData.policy_number || record.policy_number,
                group_number: analysisData.group_number || record.group_number,
                phone: analysisData.claims_phone || record.phone,
                payor_id: analysisData.payor_id || record.payor_id,
              }
            : record
        )
      );

      toast({
        title: "Success",
        description: "Insurance card scanned and information extracted successfully",
      });
    } catch (error) {
      console.error('Error processing insurance card:', error);
      setUploadError(error.message);
      toast({
        title: "Error",
        description: "Failed to process insurance card",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const InsuranceSection = ({ type, record }: { type: 'primary' | 'secondary' | 'reserved', record?: InsuranceRecord }) => {
    // Get background color based on insurance type
    const getBgColor = () => {
      switch (type) {
        case 'primary':
          return 'bg-blue-50'; // Light blue for primary
        case 'secondary':
          return 'bg-purple-50'; // Light purple for secondary
        case 'reserved':
          return 'bg-pink-50'; // Light pink for reserved
        default:
          return '';
      }
    };

    return (
      <Card className={`p-6 space-y-6 ${getBgColor()}`}>
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Carrier Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medicare">Medicare</SelectItem>
                  <SelectItem value="Medicaid">Medicaid [MC]</SelectItem>
                  <SelectItem value="Blue Cross">Blue Cross / Blue Shield [BL]</SelectItem>
                  <SelectItem value="Commercial">Commercial Insurance [CI]</SelectItem>
                  <SelectItem value="HMO">HMO Medicare Risk [16]</SelectItem>
                  <SelectItem value="Disability">Disability [DS]</SelectItem>
                  <SelectItem value="Federal">Federal Employees Program [F1]</SelectItem>
                  <SelectItem value="Liability">Liability Medical [LM]</SelectItem>
                  <SelectItem value="Self">Self-administered Group [SA]</SelectItem>
                  <SelectItem value="Title V">Title V [TV]</SelectItem>
                  <SelectItem value="VA">Veteran Affairs [VA]</SelectItem>
                  <SelectItem value="Workers">Workers Compensation [WC]</SelectItem>
                  <SelectItem value="Other">Other Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Policy Type</Label>
              <Select
                value={record?.policy_type}
                onValueChange={(value) => handleInsuranceChange(type, 'policy_type', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Policy Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medicare part B [MB]">Medicare part B [MB]</SelectItem>
                  <SelectItem value="Medicare part A [MA]">Medicare part A [MA]</SelectItem>
                  <SelectItem value="Medicare part C [ME]">Medicare part C / Advantage [ME]</SelectItem>
                  <SelectItem value="Medicaid [MC]">Medicaid [MC]</SelectItem>
                  <SelectItem value="Blue Cross [BL]">Blue Cross / Blue Shield [BL]</SelectItem>
                  <SelectItem value="Commercial [CI]">Commercial Insurance [CI]</SelectItem>
                  <SelectItem value="HMO [HM]">Health Maint Organization [HM]</SelectItem>
                  <SelectItem value="EPO [14]">Exclusive Prov Organization [14]</SelectItem>
                  <SelectItem value="PPO [12]">Preferred Prov Organization [12]</SelectItem>
                  <SelectItem value="POS [13]">Point Of Service [13]</SelectItem>
                  <SelectItem value="Other [47]">Other Insurance [47]</SelectItem>
                </SelectContent>
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
              <div className="flex gap-2">
                <Input
                  value={record?.payor_id}
                  onChange={(e) => handleInsuranceChange(type, 'payor_id', e.target.value)}
                  className="h-9"
                  placeholder="e.g. 10202"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => record?.payor_id && analyzePayerId(type, record.payor_id)}
                  title="Analyze Payer ID"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
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
              <PhoneInput
                value={record?.phone || ''}
                onChange={(value) => handleInsuranceChange(type, 'phone', value)}
                className="h-9"
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
              value={record?.patient_relation || ''}
              onValueChange={(value) => handlePatientRelationChange(type, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Self">Self</SelectItem>
                <SelectItem value="Spouse">Spouse</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Policyholder Information</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={record?.policyholder_name || ''}
                onChange={(e) => handleInsuranceChange(type, 'policyholder_name', e.target.value)}
                className={`h-9 ${record?.patient_relation === 'Self' ? 'bg-gray-100' : ''}`}
                placeholder="Policyholder Name"
                readOnly={record?.patient_relation === 'Self'}
                disabled={record?.patient_relation === 'Self'}
              />
              <Input
                type="date"
                value={record?.policyholder_dob || ''}
                onChange={(e) => handleInsuranceChange(type, 'policyholder_dob', e.target.value)}
                className={`h-9 ${record?.patient_relation === 'Self' ? 'bg-gray-100' : ''}`}
                readOnly={record?.patient_relation === 'Self'}
                disabled={record?.patient_relation === 'Self'}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={record?.policyholder_gender || ''}
                onValueChange={(value) => handleInsuranceChange(type, 'policyholder_gender', value)}
                disabled={record?.patient_relation === 'Self'}
              >
                <SelectTrigger className={`w-full ${record?.patient_relation === 'Self' ? 'bg-gray-100' : ''}`}>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Not recorded">Not recorded</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={record?.policyholder_phone || ''}
                onChange={(e) => handleInsuranceChange(type, 'policyholder_phone', e.target.value)}
                className={`h-9 ${record?.patient_relation === 'Self' ? 'bg-gray-100' : ''}`}
                placeholder="Phone"
                readOnly={record?.patient_relation === 'Self'}
                disabled={record?.patient_relation === 'Self'}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(type, e)}
              className="hidden"
              id={`insurance-card-${type}`}
              disabled={isUploading || isAnalyzing}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById(`insurance-card-${type}`)?.click()}
              disabled={isUploading || isAnalyzing}
              className="w-full"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : isAnalyzing ? "Analyzing..." : "Scan Insurance Card"}
            </Button>
          </div>

        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <SearchBar
        items={insuranceRecords}
        searchFields={['carrier_name', 'policy_number', 'group_name']}
        onResultsChange={(results) => console.log('Search results:', results)}
        placeholder="Search insurance records..."
        className="mb-4"
      />

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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Pricing Schema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectContent>
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
