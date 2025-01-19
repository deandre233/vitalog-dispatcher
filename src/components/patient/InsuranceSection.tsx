import { Card } from "@/components/ui/card";

interface InsuranceRecord {
  id: string;
  carrier_name: string;
  carrier_type: string;
  policy_number: string;
  group_number?: string;
  group_name?: string;
  policyholder_name?: string;
}

interface InsuranceSectionProps {
  type: "primary" | "secondary" | "reserved";
  title: string;
  records: InsuranceRecord[];
}

export const InsuranceSection = ({ type, title, records }: InsuranceSectionProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "primary":
        return "bg-purple-50";
      case "secondary":
        return "bg-blue-50";
      case "reserved":
        return "bg-pink-50";
      default:
        return "bg-gray-50";
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "primary":
        return "border-purple-200";
      case "secondary":
        return "border-blue-200";
      case "reserved":
        return "border-pink-200";
      default:
        return "border-gray-200";
    }
  };

  console.log(`Rendering ${type} insurance section with records:`, records);

  return (
    <Card className={`p-4 ${getBackgroundColor()} border ${getBorderColor()}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {records && records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Carrier Name</p>
                  <p className="text-sm">{record.carrier_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Carrier Type</p>
                  <p className="text-sm">{record.carrier_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Policy Number</p>
                  <p className="text-sm">{record.policy_number}</p>
                </div>
                {record.group_number && (
                  <div>
                    <p className="text-sm font-medium">Group Number</p>
                    <p className="text-sm">{record.group_number}</p>
                  </div>
                )}
                {record.group_name && (
                  <div>
                    <p className="text-sm font-medium">Group Name</p>
                    <p className="text-sm">{record.group_name}</p>
                  </div>
                )}
                {record.policyholder_name && (
                  <div>
                    <p className="text-sm font-medium">Policyholder</p>
                    <p className="text-sm">{record.policyholder_name}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No {type} insurance information available</p>
      )}
    </Card>
  );
};