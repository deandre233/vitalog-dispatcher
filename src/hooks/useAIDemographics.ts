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

  return {
    isValidating,
    validateField,
    handleZipCodeChange,
    handlePhoneChange,
    handleEmailChange,
    handleDateChange,
  };
};