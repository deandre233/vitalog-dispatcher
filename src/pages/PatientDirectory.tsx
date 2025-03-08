import { useState, useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PatientFilters } from "@/components/patient/PatientFilters";
import { PatientInsights } from "@/components/patient/PatientInsights";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, AlertTriangle } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { formatPhoneNumber } from "@/utils/stringUtils";

type Patient = Tables<"patients">;

export function PatientDirectory() {
  const navigate = useNavigate();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [hideInactive, setHideInactive] = useState(false);
  const [hideNotSeen, setHideNotSeen] = useState(false);
  const [hideAnonymous, setHideAnonymous] = useState(false);
  
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients...');
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          medical_records (*),
          insurance_policies (*),
          appointments (*)
        `)
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

  const handleNameFilter = useCallback(({ type, query }: { type: string; query: string }) => {
    if (!patients) return;
    
    const filtered = patients.filter(patient => {
      if (!query) return true;
      
      const lastName = patient.last_name.toLowerCase();
      const searchQuery = query.toLowerCase();
      
      switch (type) {
        case 'begins_with':
          return lastName.startsWith(searchQuery);
        case 'sounds_like':
          // Simple phonetic matching - you might want to use a proper phonetic algorithm
          return lastName.includes(searchQuery);
        case 'is_exactly':
          return lastName === searchQuery;
        default:
          return true;
      }
    });
    
    setFilteredPatients(filtered);
  }, [patients]);

  const getStatusBadge = (patient: Patient) => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const lastPhysical = patient.last_physical ? new Date(patient.last_physical) : null;
    
    if (!lastPhysical) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          No Records
        </Badge>
      );
    }
    
    if (lastPhysical < lastYear) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Due Visit
        </Badge>
      );
    }
    
    return (
      <Badge variant="success" className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  const displayedPatients = filteredPatients.length > 0 ? filteredPatients : (patients || []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-card-start to-medical-card-end">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-medical-primary mb-6">
                  Patient Directory
                </h1>
                <PatientInsights />
              </div>
              
              <PatientFilters
                onNameFilterChange={handleNameFilter}
                onHideInactiveChange={setHideInactive}
                onHideNotSeenChange={setHideNotSeen}
                onHideAnonymousChange={setHideAnonymous}
                hideInactive={hideInactive}
                hideNotSeen={hideNotSeen}
                hideAnonymous={hideAnonymous}
              />

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
                      <TableHead className="text-medical-secondary">ID</TableHead>
                      <TableHead className="text-medical-secondary">Name</TableHead>
                      <TableHead className="text-medical-secondary">Contact</TableHead>
                      <TableHead className="text-medical-secondary">Insurance</TableHead>
                      <TableHead className="text-medical-secondary">Last Visit</TableHead>
                      <TableHead className="text-medical-secondary">Status</TableHead>
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
                          {patient.legacy_display_id || patient.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{patient.last_name}, {patient.first_name}</div>
                            <div className="text-sm text-gray-500">
                              DOB: {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{formatPhoneNumber(patient.phone || '')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{patient.email || 'N/A'}</span>
                            </div>
                          </div>
                        </TableCell>
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
                          {patient.last_physical ? (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{new Date(patient.last_physical).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            'No records'
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(patient)}</TableCell>
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
}

export default PatientDirectory;