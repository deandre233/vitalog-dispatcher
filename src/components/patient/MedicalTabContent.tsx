import React from 'react';
import { Card } from "@/components/ui/card";
import { MedicalHistorySearch } from './MedicalHistorySearch';

interface MedicalTabContentProps {
  patientId: string;
}

export const MedicalTabContent: React.FC<MedicalTabContentProps> = ({ patientId }) => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Medical History Search</h3>
        <MedicalHistorySearch patientId={patientId} />
      </Card>
    </div>
  );
};