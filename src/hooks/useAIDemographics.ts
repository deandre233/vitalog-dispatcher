import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAIDemographics = (patientData: any) => {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateField = async (field: string, value: string) => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-demographics', {
        body: { field, value, patientData }
      });

      if (error) throw error;

      if (data.type === 'warning') {
        toast({
          title: "Warning",
          description: data.message,
          variant: "default",
        });
      } else if (data.type === 'error') {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }

      return data;
    } catch (error) {
      console.error('Error validating field:', error);
      toast({
        title: "Error",
        description: "Failed to validate field",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleZipCodeChange = async (zipCode: string) => {
    if (zipCode.length === 5) {
      const result = await validateField('zip', zipCode);
      if (result?.type === 'success' && result.data) {
        return result.data;
      }
    }
    return null;
  };

  const handlePhoneChange = async (phone: string, field: string = 'phone') => {
    if (phone.length === 14) { // (XXX) XXX-XXXX
      return await validateField(field, phone);
    }
    return null;
  };

  const handleEmailChange = async (email: string) => {
    if (email.includes('@')) {
      return await validateField('email', email);
    }
    return null;
  };

  const handleDateChange = async (date: string, field: string = 'dob') => {
    if (date) {
      return await validateField(field, date);
    }
    return null;
  };

  const handleNameChange = async (name: string, field: string) => {
    if (name.length > 1) {
      return await validateField(field, name);
    }
    return null;
  };

  const handleAddressChange = async (address: string) => {
    if (address.length > 5) {
      return await validateField('address', address);
    }
    return null;
  };

  const handleGenderChange = async (gender: string) => {
    if (gender) {
      return await validateField('gender', gender);
    }
    return null;
  };

  const handleMedicalConditionChange = async (conditions: string[]) => {
    if (conditions.length > 0) {
      return await validateField('medicalConditions', conditions.join(','));
    }
    return null;
  };

  const handleAllergiesChange = async (allergies: string[]) => {
    if (allergies.length > 0) {
      return await validateField('allergies', allergies.join(','));
    }
    return null;
  };

  const handleMedicationsChange = async (medications: string[]) => {
    if (medications.length > 0) {
      return await validateField('medications', medications.join(','));
    }
    return null;
  };

  const handleEmergencyContactChange = async (contact: { name: string; phone: string; relation: string }) => {
    if (contact.name && contact.phone) {
      return await validateField('emergencyContact', JSON.stringify(contact));
    }
    return null;
  };

  return {
    isValidating,
    validateField,
    handleZipCodeChange,
    handlePhoneChange,
    handleEmailChange,
    handleDateChange,
    handleNameChange,
    handleAddressChange,
    handleGenderChange,
    handleMedicalConditionChange,
    handleAllergiesChange,
    handleMedicationsChange,
    handleEmergencyContactChange,
  };
};