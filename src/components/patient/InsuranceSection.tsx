import { Card } from "@/components/ui/card";

interface InsuranceSectionProps {
  type: "primary" | "secondary" | "reserved";
  title: string;
}

export const InsuranceSection = ({ type, title }: InsuranceSectionProps) => {
  const getBgColor = () => {
    switch (type) {
      case "primary":
        return "bg-insurance-primary-bg";
      case "secondary":
        return "bg-insurance-secondary-bg";
      case "reserved":
        return "bg-insurance-reserved-bg";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "primary":
        return "text-insurance-primary-text";
      case "secondary":
        return "text-insurance-secondary-text";
      case "reserved":
        return "text-insurance-reserved-text";
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case "primary":
        return "border-insurance-primary-accent";
      case "secondary":
        return "border-insurance-secondary-accent";
      case "reserved":
        return "border-insurance-reserved-accent";
    }
  };

  return (
    <Card className={`p-6 ${getBgColor()} border-l-4 ${getAccentColor()}`}>
      <h3 className={`text-lg font-semibold mb-4 ${getTextColor()}`}>{title}</h3>
      <div className="space-y-4">
        <p className="text-gray-600">No insurance information available</p>
      </div>
    </Card>
  );
};