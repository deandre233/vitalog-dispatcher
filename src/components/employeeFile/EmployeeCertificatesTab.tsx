
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText, AlertTriangle, Clock } from "lucide-react";
import { getCapabilityDisplay } from "@/utils/capabilityUtils";
import type { Employee } from "@/types/employee";

interface EmployeeCertificatesTabProps {
  employee: Employee;
  isEditing: boolean;
}

// Mock data for certificates - in a real app, this would come from the API
const mockCertificates = [
  { id: '1', name: 'CPR', expiryDate: '2025-12-31', status: 'valid' },
  { id: '2', name: 'ACLS', expiryDate: '2023-10-15', status: 'expired' },
  { id: '3', name: 'PALS', expiryDate: '2024-06-30', status: 'valid' },
  { id: '4', name: 'BLS', expiryDate: '2024-01-15', status: 'expiring-soon' },
];

export const EmployeeCertificatesTab: React.FC<EmployeeCertificatesTabProps> = ({
  employee,
  isEditing
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Certifications & Capabilities</h3>
          {isEditing && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {employee.capabilities && employee.capabilities.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {employee.capabilities.map(cap => (
                <div key={cap} className="inline-block">
                  {getCapabilityDisplay(cap)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No capabilities recorded for this employee.</p>
          )}

          <div className="border rounded-md">
            <div className="grid grid-cols-4 gap-4 p-3 font-medium bg-gray-50 rounded-t-md">
              <div>Certificate</div>
              <div>Issued Date</div>
              <div>Expiry Date</div>
              <div>Status</div>
            </div>
            <div className="divide-y">
              {mockCertificates.map((cert) => (
                <div key={cert.id} className="grid grid-cols-4 gap-4 p-3 items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    {cert.name}
                  </div>
                  <div>01/01/2023</div>
                  <div>{new Date(cert.expiryDate).toLocaleDateString()}</div>
                  <div>
                    {cert.status === 'valid' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Valid</Badge>
                    )}
                    {cert.status === 'expired' && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Expired
                      </Badge>
                    )}
                    {cert.status === 'expiring-soon' && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">Upload Certificate</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
