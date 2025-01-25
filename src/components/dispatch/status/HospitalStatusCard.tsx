import { Card } from "@/components/ui/card";

interface HospitalStatusCardProps {
  name: string;
  nedocs: number;
  type: string;
  departments: {
    name: string;
    percentage: number;
  }[];
  lastUpdated: string;
}

export function HospitalStatusCard({ name, nedocs, type, departments, lastUpdated }: HospitalStatusCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded">
              NEDOCS: {nedocs} - Critical
            </span>
            <span className="text-sm text-gray-500">{type}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">Full</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.name}>
            <div className="text-sm font-medium">{dept.name}</div>
            <div className="text-sm text-gray-600">{dept.percentage}%</div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500">
        Last updated: {lastUpdated}
      </div>
    </Card>
  );
}