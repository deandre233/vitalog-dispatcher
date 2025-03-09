
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ClipboardCopy, Shield, ShieldAlert, AlertTriangle, CalendarClock, KeyRound, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Employee } from "@/types/employee";

interface IdentityTabProps {
  employee: Employee;
  isLoading: boolean;
  onSave: (data: Partial<Employee>) => void;
}

export function IdentityTab({ employee, isLoading, onSave }: IdentityTabProps) {
  const [formData, setFormData] = useState({
    first_name: employee?.first_name || "",
    last_name: employee?.last_name || "",
    mobile: employee?.mobile || "",
    emergency_contact: "",
    login_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSave({
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile: formData.mobile,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <TabsContent value="identity" className="mt-0 animate-in fade-in-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-center">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={employee?.photo_url} />
                <AvatarFallback className="text-2xl bg-primary">
                  {getInitials(`${employee?.first_name} ${employee?.last_name}`)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold">{employee?.first_name} {employee?.last_name}</h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {employee?.certification_level || "No Certification"}
                </Badge>
                <div className="text-sm text-gray-500">Employee ID: {employee?.readable_id || employee?.id?.substring(0, 8)}</div>
                <div className="pt-3">
                  <Button variant="outline" className="w-full">Update Portrait</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Last Login</span>
                  </div>
                  <span className="text-sm text-gray-600">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Authentication</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Password Status</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Expires in 45 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Account Lockouts</span>
                  </div>
                  <span className="text-sm text-gray-600">0 in last 90 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarClock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Account Created</span>
                  </div>
                  <span className="text-sm text-gray-600">{new Date(employee?.created_at || "").toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input 
                    id="last_name" 
                    name="last_name" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input 
                    id="mobile" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input 
                    id="emergency_contact" 
                    name="emergency_contact" 
                    value={formData.emergency_contact} 
                    onChange={handleChange} 
                    placeholder="Name and phone number" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">Assigned Station</Label>
                  <Input 
                    id="station" 
                    value={employee?.station || ""} 
                    readOnly 
                    className="bg-gray-50" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uuid">System ID</Label>
                  <div className="relative">
                    <Input 
                      id="uuid" 
                      value={employee?.id || ""} 
                      readOnly 
                      className="bg-gray-50 pr-10" 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => copyToClipboard(employee?.id || "", "System ID")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="login_name">Login Name</Label>
                  <Input 
                    id="login_name" 
                    name="login_name" 
                    value={formData.login_name} 
                    onChange={handleChange}
                    placeholder={`${employee?.first_name?.toLowerCase() || ''}${employee?.last_name?.toLowerCase().charAt(0) || ''}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="password" 
                      type="password" 
                      value="••••••••••••" 
                      readOnly 
                      className="bg-gray-50" 
                    />
                    <Button variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app_token">Application Token</Label>
                  <div className="relative">
                    <Input 
                      id="app_token" 
                      value="EOE43B1E7" 
                      readOnly 
                      className="bg-gray-50 pr-10 font-mono" 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => copyToClipboard("EOE43B1E7", "App Token")}
                    >
                      <ClipboardCopy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_ping">Last System Ping</Label>
                  <Input 
                    id="last_ping" 
                    value={new Date().toLocaleString()} 
                    readOnly 
                    className="bg-gray-50" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Communication Preferences</h3>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">Primary Messaging</div>
                    <Badge>SMS</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      value={employee?.mobile || ""} 
                      placeholder="Phone number for SMS"
                    />
                    <Button variant="outline">Verify Number</Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">Secondary Messaging</div>
                    <Badge>Email</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="Email address"
                      value={`${employee?.first_name?.toLowerCase() || ''}${employee?.last_name?.toLowerCase().charAt(0) || ''}@ambulance.org`}
                    />
                    <Button variant="outline">Verify Email</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
