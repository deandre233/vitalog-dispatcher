
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radio, RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkles, Save, Calendar, DollarSign, Clock, ArrowUpDown, Download, Trash2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { Employee } from "@/types/employee";
import { useEmployeePayroll } from "@/hooks/useEmployeePayroll";

interface PayrollTabProps {
  employee: Employee | undefined;
  isLoading: boolean;
  onSave: (data: Partial<Employee>) => void;
}

export function PayrollTab({ employee, isLoading, onSave }: PayrollTabProps) {
  const [payType, setPayType] = useState(employee?.pay_type || "hourly");
  const [payRate, setPayRate] = useState(employee?.pay_rate?.toString() || "20.00");
  const [usesTimeclock, setUsesTimeclock] = useState(employee?.uses_timeclock || false);
  const [accessCodes, setAccessCodes] = useState(employee?.access_codes || "");
  
  const { 
    payrollHistory, 
    payrollProjections, 
    isLoading: loadingPayroll, 
    aiRecommendations, 
    generatePayrollReport 
  } = useEmployeePayroll(employee?.id);

  const handleSave = () => {
    onSave({
      pay_type: payType,
      pay_rate: parseFloat(payRate),
      uses_timeclock: usesTimeclock,
      access_codes: accessCodes
    });
  };

  // Calculate service years
  const yearsOfService = employee?.first_hired_date 
    ? Math.floor((new Date().getTime() - new Date(employee.first_hired_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) 
    : 0;

  return (
    <TabsContent value="payroll" className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Payroll Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center justify-between">
                Payroll Information
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Active:</label>
                    <div className="w-2/3 flex items-center gap-2">
                      <Checkbox 
                        id="can-access" 
                        checked={true} 
                        disabled={isLoading}
                      />
                      <label htmlFor="can-access" className="text-sm">
                        Can access EmergencyTrack and perform assigned roles
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Employee type:</label>
                    <Select defaultValue={employee?.employee_type || "full-time"} disabled={isLoading}>
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Select employee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Responsibilities:</label>
                    <Select defaultValue="provider" disabled={isLoading}>
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Select responsibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="provider">Patient care provider</SelectItem>
                        <SelectItem value="dispatcher">Dispatcher</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="administrator">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Secondary role:</label>
                    <Select defaultValue="none" disabled={isLoading}>
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Select secondary role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="trainer">Trainer</SelectItem>
                        <SelectItem value="field-supervisor">Field Supervisor</SelectItem>
                        <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">First hired:</label>
                    <div className="w-2/3 flex items-center gap-2">
                      <Input 
                        type="date" 
                        value={employee?.first_hired_date ? format(new Date(employee.first_hired_date), 'yyyy-MM-dd') : ''} 
                        disabled={isLoading}
                        className="w-full"
                      />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Years of service:</label>
                    <div className="w-2/3 flex items-center gap-2">
                      <Input 
                        type="text" 
                        value={yearsOfService.toString()} 
                        disabled={true}
                        className="w-1/3 bg-gray-100"
                      />
                      <span className="text-sm text-gray-500">as of {format(new Date(), 'MM/dd/yyyy')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Pay type:</label>
                    <RadioGroup 
                      className="w-2/3 flex flex-row gap-4" 
                      value={payType} 
                      onValueChange={setPayType}
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioItem value="hourly" id="hourly" />
                        <label htmlFor="hourly" className="text-sm">Hourly</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioItem value="salary" id="salary" />
                        <label htmlFor="salary" className="text-sm">Exempt (Salaried)</label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="w-1/3"></div>
                    <div className="w-2/3 flex items-center gap-2">
                      <Checkbox 
                        id="uses-timeclock" 
                        checked={usesTimeclock} 
                        onCheckedChange={(checked) => setUsesTimeclock(!!checked)}
                        disabled={isLoading}
                      />
                      <label htmlFor="uses-timeclock" className="text-sm">
                        Uses the timeclock
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Pay rate:</label>
                    <div className="w-2/3 flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <Input 
                        type="text" 
                        value={payRate} 
                        onChange={(e) => setPayRate(e.target.value)}
                        disabled={isLoading}
                        className="w-1/3"
                      />
                      <span className="text-sm">per hour</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="w-1/3 text-sm font-medium">Keys and codes:</label>
                    <Input 
                      type="text" 
                      placeholder="optional" 
                      value={accessCodes}
                      onChange={(e) => setAccessCodes(e.target.value)}
                      disabled={isLoading}
                      className="w-2/3"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Labor Cost & AI Insights */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Labor Cost Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Daily @ 8 hours</span>
                    </div>
                    <span className="font-medium">$ {(parseFloat(payRate) * 8).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Weekly @ 40 hours</span>
                    </div>
                    <span className="font-medium">$ {(parseFloat(payRate) * 40).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Bi-weekly @ 80 hours</span>
                    </div>
                    <span className="font-medium">$ {(parseFloat(payRate) * 80).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Monthly @ 166.7 hours</span>
                    </div>
                    <span className="font-medium">$ {(parseFloat(payRate) * 166.7).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Annually @ 2000 hours</span>
                    </div>
                    <span className="font-medium">$ {(parseFloat(payRate) * 2000).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  AI Payroll Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingPayroll ? (
                    <p>Loading AI insights...</p>
                  ) : (
                    <>
                      <div className="bg-white p-3 rounded-md border border-blue-100">
                        <p className="text-sm text-blue-800 font-medium mb-1">Payroll Efficiency</p>
                        <p className="text-sm">
                          Based on timesheet analysis, this employee has consistently worked 
                          <span className="font-semibold"> 42.5 hours/week</span> over the past quarter, 
                          with <span className="font-semibold">2.5 hours</span> of overtime weekly.
                        </p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-md border border-indigo-100">
                        <p className="text-sm text-indigo-800 font-medium mb-1">Cost Analysis</p>
                        <p className="text-sm">
                          This employee's cost ratio is <span className="font-semibold">1.15x</span> compared 
                          to others with similar roles, with <span className="font-semibold">15% higher productivity</span> 
                          metrics.
                        </p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-md border border-purple-100">
                        <p className="text-sm text-purple-800 font-medium mb-1">Recommendations</p>
                        <p className="text-sm">
                          Consider initiating a <span className="font-semibold">5% merit increase</span> 
                          based on performance metrics and industry standards.
                        </p>
                      </div>
                    </>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Full AI Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payroll History */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center justify-between">
              Payroll History
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Active?</TableHead>
                  <TableHead>Emp Type</TableHead>
                  <TableHead>Keys and Codes</TableHead>
                  <TableHead>Pay Type</TableHead>
                  <TableHead>Pay Rate</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingPayroll ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">Loading payroll history...</TableCell>
                  </TableRow>
                ) : (
                  <>
                    <TableRow>
                      <TableCell className="font-medium">15</TableCell>
                      <TableCell>{format(new Date('2023-06-14'), 'yyyy-MM-dd HH:mm')}</TableCell>
                      <TableCell>[Current]</TableCell>
                      <TableCell>Baker, Justin</TableCell>
                      <TableCell>✓</TableCell>
                      <TableCell>Full-time</TableCell>
                      <TableCell>{accessCodes || "—"}</TableCell>
                      <TableCell>Hourly</TableCell>
                      <TableCell>${payRate}/hr</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">8</TableCell>
                      <TableCell>{format(new Date('2022-05-23'), 'yyyy-MM-dd HH:mm')}</TableCell>
                      <TableCell>{format(new Date('2023-06-14'), 'yyyy-MM-dd HH:mm')}</TableCell>
                      <TableCell>Administrator</TableCell>
                      <TableCell>✓</TableCell>
                      <TableCell>Full-time</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>Hourly</TableCell>
                      <TableCell>$20.00/hr</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
            <p className="text-xs text-gray-500 mt-4">
              A new row will be created whenever the settings in this tab are changed and saved.
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
