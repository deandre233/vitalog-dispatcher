
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Download, FileSearch, Filter, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function AdvancedSearchSection() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [certType, setCertType] = useState("");
  const [status, setStatus] = useState("");
  const [includeExpired, setIncludeExpired] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    // Mock search functionality
    setHasSearched(true);
    
    // If nothing is entered, show empty results
    if (!searchTerm && !certType && !status) {
      setSearchResults([]);
      return;
    }
    
    // Mock results based on search parameters
    setSearchResults([
      {
        id: "1",
        cert_type: "BLS - Basic/EMT",
        cert_class: "Normal",
        state: "CA",
        status: "Active",
        expires: "2025-03-31",
        employee_name: `${employee?.first_name} ${employee?.last_name}`,
        employee_id: employeeId
      },
      {
        id: "2",
        cert_type: "CPR for Healthcare Providers",
        cert_class: "Normal",
        state: "CA",
        status: "Active",
        expires: "2024-12-15",
        employee_name: "Johnson, Michael",
        employee_id: "different-id-1"
      },
      {
        id: "3",
        cert_type: "ACLS - Advanced Cardiac Life Support",
        cert_class: "Advanced",
        state: "CA",
        status: "Expired",
        expires: "2023-05-10",
        employee_name: "Smith, Sarah",
        employee_id: "different-id-2"
      }
    ].filter(result => {
      if (certType && !result.cert_type.toLowerCase().includes(certType.toLowerCase())) {
        return false;
      }
      if (status && result.status !== status) {
        return false;
      }
      if (!includeExpired && result.status === "Expired") {
        return false;
      }
      if (searchTerm && 
          !result.cert_type.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !result.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCertType("");
    setStatus("");
    setIncludeExpired(false);
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <FileSearch className="mr-2 h-5 w-5 text-blue-600" />
            Advanced Certification Search
          </CardTitle>
          <Button variant="outline" size="sm" onClick={clearSearch}>
            <X className="mr-1 h-4 w-4" /> Clear Search
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label htmlFor="search-term">Search Term</Label>
            <Input 
              id="search-term" 
              placeholder="Search certifications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="cert-type">Certification Type</Label>
            <Select value={certType} onValueChange={setCertType}>
              <SelectTrigger id="cert-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="BLS">BLS / EMT Basic</SelectItem>
                <SelectItem value="CPR">CPR</SelectItem>
                <SelectItem value="ACLS">ACLS</SelectItem>
                <SelectItem value="PALS">PALS</SelectItem>
                <SelectItem value="EMT-I">EMT Intermediate</SelectItem>
                <SelectItem value="paramedic">Paramedic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col justify-end">
            <div className="flex items-center space-x-2 mb-4">
              <Switch 
                id="include-expired" 
                checked={includeExpired}
                onCheckedChange={setIncludeExpired}
              />
              <Label htmlFor="include-expired">Include Expired</Label>
            </div>
            
            <Button onClick={handleSearch}>
              <Search className="mr-1 h-4 w-4" /> Search Certifications
            </Button>
          </div>
        </div>
        
        {hasSearched && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Search Results</h3>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-6 border rounded-md bg-gray-50">
                <p className="text-gray-500">No matching certifications found</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Certification</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Class</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">State</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Expires</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Employee</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((result) => (
                      <tr key={result.id} className="border-t">
                        <td className="p-3 text-sm">{result.cert_type}</td>
                        <td className="p-3 text-sm">{result.cert_class}</td>
                        <td className="p-3 text-sm">{result.state}</td>
                        <td className="p-3 text-sm">
                          <Badge variant={
                            result.status === "Active" ? "success" :
                            result.status === "Expired" ? "destructive" :
                            result.status === "Pending" ? "warning" : "secondary"
                          }>
                            {result.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{result.expires}</td>
                        <td className="p-3 text-sm">{result.employee_name}</td>
                        <td className="p-3 text-sm">
                          <Button variant="ghost" size="sm" className="h-8 pl-1.5 pr-1.5">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" disabled={searchResults.length === 0}>
                <Download className="mr-1 h-4 w-4" /> Export Results
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
