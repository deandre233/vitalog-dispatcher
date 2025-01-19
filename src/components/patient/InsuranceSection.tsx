import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";

interface InsuranceSectionProps {
  type: "primary" | "secondary" | "reserved";
  title: string;
}

export const InsuranceSection = ({ type, title }: InsuranceSectionProps) => {
  const bgColor = {
    primary: "bg-insurance-primary-bg",
    secondary: "bg-insurance-secondary-bg",
    reserved: "bg-insurance-reserved-bg",
  }[type];

  const accentColor = {
    primary: "text-insurance-primary-accent",
    secondary: "text-insurance-secondary-accent",
    reserved: "text-insurance-reserved-accent",
  }[type];

  const textColor = {
    primary: "text-insurance-primary-text",
    secondary: "text-insurance-secondary-text",
    reserved: "text-insurance-reserved-text",
  }[type];

  const borderColor = {
    primary: "border-insurance-primary-accent/20",
    secondary: "border-insurance-secondary-accent/20",
    reserved: "border-insurance-reserved-accent/20",
  }[type];

  return (
    <Card className={`p-6 ${bgColor} border ${borderColor}`}>
      <div className="flex items-center gap-2 mb-6">
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`text-sm ${textColor}`}>Carrier Type</label>
          <Select>
            <option>Select...</option>
          </Select>
        </div>
        <div>
          <label className={`text-sm ${textColor}`}>Policy Type</label>
          <Select>
            <option>Select...</option>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <label className={`text-sm ${textColor}`}>Company Name</label>
        <Input placeholder="e.g. Medicare Georgia" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className={`text-sm ${textColor}`}>Payor ID</label>
          <Input placeholder="e.g. 1024" />
        </div>
        <div>
          <label className={`text-sm ${textColor}`}>NSure Payor Code</label>
          <Input placeholder="e.g. 00472" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className={`text-sm ${textColor}`}>Group Number</label>
          <Input />
        </div>
        <div>
          <label className={`text-sm ${textColor}`}>Group Name</label>
          <Input />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className={`text-sm ${textColor}`}>Claims Phone</label>
          <Input placeholder="(877) 567-72" />
        </div>
        <div>
          <label className={`text-sm ${textColor}`}>Claims ZIP</label>
          <Input placeholder="#####" />
        </div>
      </div>

      <div className="mt-4">
        <label className={`text-sm ${textColor}`}>Patient Relation</label>
        <Select>
          <option>Select Relation</option>
        </Select>
      </div>

      <div className="mt-6">
        <h4 className={`text-sm font-medium mb-4 ${textColor}`}>Policyholder Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Policyholder Name" />
          <Input type="date" placeholder="mm/dd/yyyy" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select>
            <option>Select...</option>
          </Select>
          <Input placeholder="Phone" />
        </div>
      </div>

      <Button 
        variant="outline" 
        className={`w-full mt-6 ${accentColor} hover:bg-${type}-accent/10`}
      >
        <Scan className="w-4 h-4 mr-2" />
        Scan Insurance Card
      </Button>
    </Card>
  );
};