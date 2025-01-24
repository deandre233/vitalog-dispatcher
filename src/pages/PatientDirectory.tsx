import React, { useState, useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Database, Import, Files, FileText, 
  Users, Download, CircuitBoard 
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;
type NameFilterType = 'begins' | 'sounds' | 'exact';

export const PatientDirectory = () => {
  const navigate = useNavigate();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [nameFilterType, setNameFilterType] = useState<NameFilterType>('begins');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [hideNonContract, setHideNonContract] = useState(false);
  const [hideInactive, setHideInactive] = useState(false);
  const [hideNotSeen, setHideNotSeen] = useState(false);
  const [hideAnonymous, setHideAnonymous] = useState(false);
  
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
        throw error;
      }

      console.log('Fetched patients:', data);
      return data;
    }
  });

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const handleSearchResults = useCallback((results: Patient[]) => {
    setFilteredPatients(results);
  }, []);

  const searchFields: (keyof Patient)[] = [
    'last_name',
    'first_name',
    'dob',
    'address',
    'city',
    'state'
  ];

  const displayedPatients = filteredPatients.length > 0 ? filteredPatients : patients || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-card-start to-medical-card-end">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              {isLoading && (
                <div className="text-medical-secondary animate-pulse">Loading patients...</div>
              )}

              {error && (
                <div className="text-red-500">
                  Error loading patients. Please try again later.
                </div>
              )}

              <div className="mb-6">
                <Card className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input 
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter first name..."
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <div className="space-y-2">
                          <Input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name..."
                            className="w-full"
                          />
                          <RadioGroup 
                            defaultValue="begins" 
                            onValueChange={(value) => setNameFilterType(value as NameFilterType)}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="begins" id="begins" />
                              <Label htmlFor="begins">Begins with</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sounds" id="sounds" />
                              <Label htmlFor="sounds">Sounds like</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="exact" id="exact" />
                              <Label htmlFor="exact">Is exactly</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Search</Label>
                        <SearchBar 
                          items={patients || []}
                          searchFields={searchFields}
                          onResultsChange={handleSearchResults}
                          placeholder="Search patients..."
                          className="w-full"
                        />
                      </div>
                    </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input 
                      type="date" 
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-[200px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Facility</Label>
                    <div className="flex gap-2 items-center">
                      <Select onValueChange={setSelectedFacility}>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Any facility or street address" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Facilities</SelectItem>
                          <SelectItem value="hospital">Main Hospital</SelectItem>
                          <SelectItem value="clinic">Downtown Clinic</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hideNonContract" 
                          checked={hideNonContract}
                          onCheckedChange={(checked) => setHideNonContract(checked as boolean)}
                        />
                        <Label htmlFor="hideNonContract">Hide non-contract facilities</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hideInactive" 
                      checked={hideInactive}
                      onCheckedChange={(checked) => setHideInactive(checked as boolean)}
                    />
                    <Label htmlFor="hideInactive">Hide inactive or deceased patients</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hideNotSeen" 
                      checked={hideNotSeen}
                      onCheckedChange={(checked) => setHideNotSeen(checked as boolean)}
                    />
                    <Label htmlFor="hideNotSeen">Hide patients not seen in the past year</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hideAnonymous" 
                      checked={hideAnonymous}
                      onCheckedChange={(checked) => setHideAnonymous(checked as boolean)}
                    />
                    <Label htmlFor="hideAnonymous">Hide anonymous records</Label>
                  </div>
                </div>

                  </div>
                </Card>
              </div>

              <div className="glass-panel rounded-lg border border-medical-secondary/20">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-medical-secondary/5">
                      <TableHead>
                        <div className="flex items-center gap-2 text-medical-secondary">
                          <FileText className="h-4 w-4" />
                          ID
                        </div>
                      </TableHead>
                      <TableHead className="text-medical-secondary">Last Name</TableHead>
                      <TableHead className="text-medical-secondary">First Name</TableHead>
                      <TableHead className="text-medical-secondary">Gender</TableHead>
                      <TableHead className="text-medical-secondary">DOB</TableHead>
                      <TableHead className="text-medical-secondary">Insurance</TableHead>
                      <TableHead className="text-medical-secondary">Home Facility</TableHead>
                      <TableHead className="text-medical-secondary">Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedPatients.map((patient: Patient) => (
                      <TableRow
                        key={patient.id}
                        className="cursor-pointer hover:bg-medical-highlight transition-colors duration-300"
                        onClick={() => navigate(`/patient/${patient.id}`)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Files className="h-4 w-4 text-medical-secondary" />
                            {patient.legacy_display_id || patient.id.slice(0, 8)}
                          </div>
                        </TableCell>
                        <TableCell>{patient.last_name}</TableCell>
                        <TableCell>{patient.first_name}</TableCell>
                        <TableCell>{patient.gender || 'N/A'}</TableCell>
                        <TableCell>{formatDate(patient.dob)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {patient.primary_insurance && (
                              <div className="text-medical-primary">{patient.primary_insurance}</div>
                            )}
                            {patient.secondary_insurance && (
                              <div className="text-sm text-medical-secondary">
                                {patient.secondary_insurance}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.usual_transport_mode || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-between gap-4">
                            <div>{patient.last_physical ? formatDate(patient.last_physical) : 'N/A'}</div>
                            <div className="flex gap-2 text-sm">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/dispatch/${patient.id}`);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                Dispatch
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/report/${patient.id}`);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                Report
                              </button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDirectory;
