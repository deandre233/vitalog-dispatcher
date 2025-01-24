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
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { NameFilterRadioGroup, NameFilterType } from "@/components/filters/NameFilterRadioGroup";
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

export const PatientDirectory = () => {
  const navigate = useNavigate();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [nameFilter, setNameFilter] = useState<NameFilterType>("begins_with");
  const [lastName, setLastName] = useState("");
  
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
      return data || [];
    }
  });

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const handleSearchResults = useCallback((results: Patient[]) => {
    setFilteredPatients(results);
  }, []);

  const filterPatients = useCallback(() => {
    if (!patients) return;
    
    let filtered = [...patients];
    
    if (lastName) {
      filtered = filtered.filter(patient => {
        const patientLastName = patient.last_name.toLowerCase();
        const searchLastName = lastName.toLowerCase();
        
        switch (nameFilter) {
          case "begins_with":
            return patientLastName.startsWith(searchLastName);
          case "sounds_like":
            // Simple phonetic matching - could be enhanced with a proper algorithm
            return patientLastName.slice(0, 3) === searchLastName.slice(0, 3);
          case "exact":
            return patientLastName === searchLastName;
          default:
            return true;
        }
      });
    }
    
    setFilteredPatients(filtered);
  }, [patients, lastName, nameFilter]);

  React.useEffect(() => {
    filterPatients();
  }, [filterPatients]);

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
              <Card className="p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="max-w-sm"
                      placeholder="Enter last name..."
                    />
                  </div>
                  <div>
                    <NameFilterRadioGroup
                      value={nameFilter}
                      onChange={setNameFilter}
                    />
                  </div>
                </div>
              </Card>

              {isLoading && (
                <div className="text-medical-secondary animate-pulse">Loading patients...</div>
              )}

              {error && (
                <div className="text-red-500">
                  Error loading patients. Please try again later.
                </div>
              )}

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
