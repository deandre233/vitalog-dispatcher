
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpDown, CreditCard, DollarSign, Clock, Calendar, BarChart3, Wallet, ChevronRight, AlertCircle } from "lucide-react";
import { useEmployeePayroll } from "@/hooks/useEmployeePayroll";
import type { Employee } from "@/types/employee";

interface PayrollTabProps {
  employee: Employee | undefined;
  isLoading: boolean;
  onSave: (data: Partial<Employee>) => void;
}

export function PayrollTab({ employee, isLoading, onSave }: PayrollTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    pay_type: employee?.pay_type || "hourly",
    pay_rate: employee?.pay_rate || 0,
    uses_timeclock: employee?.uses_timeclock || true,
    access_codes: employee?.access_codes || ""
  });

  const { 
    payrollHistory, 
    payrollProjections, 
    aiRecommendations, 
    updatePayroll, 
    generatePayrollReport 
  } = useEmployeePayroll(employee?.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleRadioChange = (value: string) => {
    setFormData({
      ...formData,
      pay_type: value
    });
  };

  const handleSave = () => {
    onSave({
      pay_type: formData.pay_type,
      pay_rate: Number(formData.pay_rate),
      uses_timeclock: formData.uses_timeclock,
      access_codes: formData.access_codes
    });
    
    updatePayroll.mutate({
      employee_id: employee?.id,
      pay_type: formData.pay_type,
      pay_rate: Number(formData.pay_rate),
      uses_timeclock: formData.uses_timeclock,
      access_codes: formData.access_codes,
      effective_date: new Date().toISOString()
    });
    
    setIsEditing(false);
  };

  return (
    <TabsContent value="payroll" className="mt-0 animate-in fade-in-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Payroll Information</h3>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pay Type</Label>
                    <RadioGroup 
                      value={formData.pay_type} 
                      onValueChange={handleRadioChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="hourly" />
                        <Label htmlFor="hourly" className="cursor-pointer">Hourly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="salary" id="salary" />
                        <Label htmlFor="salary" className="cursor-pointer">Salary</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pay_rate">
                      {formData.pay_type === "hourly" ? "Hourly Rate ($)" : "Annual Salary ($)"}
                    </Label>
                    <Input 
                      id="pay_rate"
                      name="pay_rate"
                      type="number"
                      value={formData.pay_rate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="uses_timeclock"
                      name="uses_timeclock"
                      checked={formData.uses_timeclock}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="uses_timeclock">Uses Time Clock</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="access_codes">Access Codes</Label>
                    <Input 
                      id="access_codes"
                      name="access_codes"
                      placeholder="Enter building access codes"
                      value={formData.access_codes}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Pay Type</span>
                      <div className="font-medium capitalize">
                        {employee?.pay_type || "Hourly"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Pay Rate</span>
                      <div className="font-medium">
                        ${employee?.pay_rate?.toFixed(2) || "0.00"}
                        {employee?.pay_type === "hourly" ? "/hr" : "/year"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="font-medium">
                        {employee?.status || "Active"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Time Clock</span>
                      <div className="font-medium">
                        {employee?.uses_timeclock ? "Enabled" : "Disabled"}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Access Codes</span>
                    <div className="font-medium font-mono">
                      {employee?.access_codes || "No access codes assigned"}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Labor Cost Overview</h3>
              
              {payrollProjections && payrollProjections.length > 0 ? (
                <div className="space-y-4">
                  {payrollProjections.map((projection, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="text-sm">{projection.period}</div>
                      <div className="text-right">
                        <div className="font-medium">${projection.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{projection.hours} hours</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  No payroll projections available.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
              
              {aiRecommendations && aiRecommendations.length > 0 ? (
                <div className="space-y-4">
                  {aiRecommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-md border border-blue-100">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-blue-800">{rec.type}</div>
                          <div className="text-sm text-blue-700">{rec.description}</div>
                          <div className="text-xs text-blue-600 mt-1">
                            Confidence: {(rec.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  No AI recommendations available.
                </div>
              )}
              
              <Button 
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => generatePayrollReport()}
              >
                Generate Full AI Analysis
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Payroll History</h3>
              
              {payrollHistory && payrollHistory.length > 0 ? (
                <div className="space-y-6">
                  {payrollHistory.map((entry, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {new Date(entry.effective_date).toLocaleDateString()}
                          </span>
                          {entry.is_active && (
                            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                              Current
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Pay Type</div>
                          <div>{entry.pay_type}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Pay Rate</div>
                          <div>${entry.pay_rate.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Employee Type</div>
                          <div>{entry.employee_type}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Entered By</div>
                          <div>{entry.author}</div>
                        </div>
                      </div>
                      {entry.end_date && (
                        <div className="px-4 py-2 bg-gray-50 border-t text-sm">
                          <span className="text-gray-500">End Date:</span> {new Date(entry.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No payroll history records available.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payroll Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-md p-3 flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-700">Average Hours</div>
                    <div className="text-lg font-semibold">38.5 hrs/week</div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-md p-3 flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <div className="text-sm text-green-700">YTD Earnings</div>
                    <div className="text-lg font-semibold">$18,240.00</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-md p-3 flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <ArrowUpDown className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-sm text-purple-700">Increase</div>
                    <div className="text-lg font-semibold">+5.2% YoY</div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Earnings Trend (Last 6 Months)</h4>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Full Report
                  </Button>
                </div>
                
                <div className="h-40 flex items-end space-x-2">
                  {[65, 40, 75, 50, 85, 90].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-100 rounded-t" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs mt-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-medium">Direct Deposit</div>
                      <div className="text-sm text-gray-500">Bank of America ••••3456</div>
                    </div>
                  </div>
                  <Badge>Primary</Badge>
                </div>
                
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Wallet className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-medium">Pay Card</div>
                      <div className="text-sm text-gray-500">Visa ••••5678</div>
                    </div>
                  </div>
                  <Badge variant="outline">Backup</Badge>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
}
