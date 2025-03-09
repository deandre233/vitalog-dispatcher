
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StatisticsSection() {
  const [startDate, setStartDate] = useState("12/09/2024");
  const [endDate, setEndDate] = useState("03/10/2025");

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Statistics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span>For all dates on or after</span>
          <div className="relative">
            <Input 
              type="text" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="w-32 pr-8"
            />
            <Calendar className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <span>but before</span>
          <div className="relative">
            <Input 
              type="text" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="w-32 pr-8"
            />
            <Calendar className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <span>=</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center bg-slate-100 py-2">As an employee</h3>
            <Table>
              <TableBody>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">On-Duty Hours Within Period</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">On-Call Hours Within Period</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Tardies - Minor</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tardies - Major</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Absences - Excused</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Absences - Unexcused</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Absence Hours</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Came in to Cover</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Clockout with Unfinished Reports</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Incidents Where Blamed</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Crew Member Statistics */}
          <div>
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold mb-4 text-center bg-slate-100 py-2 flex-grow">As a crew member</h3>
              <h3 className="text-lg font-semibold mb-4 text-center bg-slate-100 py-2 flex-grow">QA objection rates</h3>
              <div className="flex items-center justify-center mb-4 bg-slate-100 py-2 px-3">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <Table>
              <TableBody>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Dispatches - WC</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Dispatches - BLS+</TableCell>
                  <TableCell className="text-right">318</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Dispatches - BLS+ as Attending</TableCell>
                  <TableCell className="text-right">174</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Attending Rate</TableCell>
                  <TableCell className="text-right">54%</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Dispatches per Hour</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Average Hours to Finish Report</TableCell>
                  <TableCell className="text-right">7</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Perfect Report Rate</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Average QA Failures per Dispatch</TableCell>
                  <TableCell className="text-right">0.0</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Average QA Objections per Failed Report</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Dispatches with Missing GPS Pins</TableCell>
                  <TableCell className="text-right">166 (52%)</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Dispatches with Leg Times Edits</TableCell>
                  <TableCell className="text-right">87 (27%)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Dispatches with Bogus Leg Times</TableCell>
                  <TableCell className="text-right">17 (9%)</TableCell>
                </TableRow>
                <TableRow className="bg-slate-200">
                  <TableCell className="font-medium">Dispatches with Bogus Odometers</TableCell>
                  <TableCell className="text-right">23 (13%)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Incomplete Checklists</TableCell>
                  <TableCell className="text-right">0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
