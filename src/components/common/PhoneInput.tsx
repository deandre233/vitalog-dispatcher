
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { formatPhoneNumber } from '@/utils/stringUtils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean; // Added disabled prop instead of readOnly
}

export function PhoneInput({
  value,
  onChange,
  className = "",
  placeholder = "(XXX) XXX-XXXX",
  required = false,
  disabled = false // Initialize with default value
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(formatPhoneNumber(value));

  useEffect(() => {
    setDisplayValue(formatPhoneNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Don't process changes if disabled
    
    const newValue = e.target.value;
    const formatted = formatPhoneNumber(newValue);
    setDisplayValue(formatted);
    
    // Pass only numbers to parent
    onChange(newValue.replace(/\D/g, ''));
  };

  return (
    <Input
      type="tel"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      disabled={disabled} // Use disabled prop instead of readOnly
      maxLength={14} // (XXX) XXX-XXXX
    />
  );
}
