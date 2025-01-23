import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { formatPhoneNumber } from '@/utils/stringUtils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  className = "",
  placeholder = "(XXX) XXX-XXXX",
  required = false
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(formatPhoneNumber(value));

  useEffect(() => {
    setDisplayValue(formatPhoneNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      maxLength={14} // (XXX) XXX-XXXX
    />
  );
}