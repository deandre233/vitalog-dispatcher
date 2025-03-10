
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck2, GraduationCap } from "lucide-react";

export function HRCertificationsTab() {
  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
          Certification Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-sm font-medium">Certification</th>
                  <th className="text-center p-2 text-sm font-medium">Active</th>
                  <th className="text-center p-2 text-sm font-medium">Expiring Soon</th>
                  <th className="text-center p-2 text-sm font-medium">Expired</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-white">
                  <td className="p-2 text-sm">EMT-Basic</td>
                  <td className="p-2 text-sm text-center text-green-600">12</td>
                  <td className="p-2 text-sm text-center text-amber-500">2</td>
                  <td className="p-2 text-sm text-center text-red-500">0</td>
                </tr>
                <tr className="border-b bg-white">
                  <td className="p-2 text-sm">Paramedic</td>
                  <td className="p-2 text-sm text-center text-green-600">8</td>
                  <td className="p-2 text-sm text-center text-amber-500">1</td>
                  <td className="p-2 text-sm text-center text-red-500">0</td>
                </tr>
                <tr className="border-b bg-white">
                  <td className="p-2 text-sm">ACLS</td>
                  <td className="p-2 text-sm text-center text-green-600">15</td>
                  <td className="p-2 text-sm text-center text-amber-500">3</td>
                  <td className="p-2 text-sm text-center text-red-500">1</td>
                </tr>
                <tr className="border-b bg-white">
                  <td className="p-2 text-sm">CPR Instructor</td>
                  <td className="p-2 text-sm text-center text-green-600">4</td>
                  <td className="p-2 text-sm text-center text-amber-500">0</td>
                  <td className="p-2 text-sm text-center text-red-500">1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm">Certification Calendar</Button>
            <Button variant="outline" size="sm">
              <FileCheck2 className="mr-2 h-4 w-4" />
              Schedule Renewal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
