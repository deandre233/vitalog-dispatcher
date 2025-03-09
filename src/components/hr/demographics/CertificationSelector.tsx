
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface CertificationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface CertificationOption {
  id: string;
  title: string;
  description: string;
  level: "basic" | "intermediate" | "advanced" | "specialized";
}

const certificationOptions: CertificationOption[] = [
  {
    id: "EMR",
    title: "EMR (Emergency Medical Responder)",
    description: "Basic emergency care, CPR, and first aid",
    level: "basic"
  },
  {
    id: "EMT-Basic",
    title: "EMT-Basic",
    description: "Patient assessment, transport, and non-invasive interventions",
    level: "basic"
  },
  {
    id: "EMT-Intermediate",
    title: "EMT-Intermediate",
    description: "Advanced airway management and limited medication administration",
    level: "intermediate"
  },
  {
    id: "AEMT",
    title: "AEMT (Advanced EMT)",
    description: "IV access, additional medications, advanced assessment skills",
    level: "intermediate"
  },
  {
    id: "Paramedic",
    title: "Paramedic",
    description: "Advanced cardiac & trauma care, comprehensive medication administration",
    level: "advanced"
  },
  {
    id: "Critical Care Paramedic",
    title: "Critical Care Paramedic",
    description: "Critical care transports, advanced monitoring, ventilator management",
    level: "specialized"
  },
  {
    id: "Flight Paramedic",
    title: "Flight Paramedic",
    description: "Aeromedical care, specialized transport protocols, austere environment management",
    level: "specialized"
  }
];

export function CertificationSelector({ value, onChange }: CertificationSelectorProps) {
  return (
    <RadioGroup 
      value={value} 
      onValueChange={onChange}
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      {certificationOptions.map((option) => (
        <div key={option.id} className="col-span-1">
          <RadioGroupItem
            value={option.title}
            id={option.id}
            className="peer sr-only"
          />
          <Label
            htmlFor={option.id}
            className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="flex w-full justify-between">
              <div className="font-medium">{option.title}</div>
              <Badge 
                variant={
                  option.level === "basic" ? "outline" : 
                  option.level === "intermediate" ? "secondary" : 
                  option.level === "advanced" ? "default" : 
                  "destructive"
                }
              >
                {option.level}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {option.description}
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
