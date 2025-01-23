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
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Database, Import, Files, FileText, 
  Users, Download, CircuitBoard, Plus,
  FileSpreadsheet, Ambulance
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

// Mock data for development and testing
const mockPatients: Patient[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    first_name: "John",
    last_name: "Smith",
    dob: "1985-03-15",
    gender: "Male",
    address: "123 Medical Center Dr",
    city: "Atlanta",
    state: "GA",
    zip: "30308",
    phone: "(404) 555-0123",
    email: "john.smith@email.com",
    primary_insurance: "Blue Cross Blue Shield",
    secondary_insurance: "Medicare",
    medical_conditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin"],
    medications: ["Metformin", "Lisinopril"],
    emergency_contact_name: "Jane Smith",
    emergency_contact_phone: "(404) 555-0124",
    legacy_display_id: "PAT-12345",
    last_physical: "2023-11-15T14:30:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    blood_type: "O+",
    height: "5'10\"",
    weight: "180",
    marital_status: "Married",
    occupation: "Engineer",
    preferred_language: "English",
    primary_care_physician: "Dr. Wilson",
    usual_transport_mode: "Car"
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174000",
    first_name: "Maria",
    last_name: "Garcia",
    dob: "1992-07-22",
    gender: "Female",
    address: "456 Healthcare Ave",
    city: "Atlanta",
    state: "GA",
    zip: "30309",
    phone: "(404) 555-0125",
    email: "maria.garcia@email.com",
    primary_insurance: "Aetna",
    secondary_insurance: null,
    medical_conditions: ["Asthma"],
    allergies: ["Latex", "Pollen"],
    medications: ["Albuterol"],
    emergency_contact_name: "Carlos Garcia",
    emergency_contact_phone: "(404) 555-0126",
    legacy_display_id: "PAT-12346",
    last_physical: "2024-01-10T09:15:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    blood_type: "A+",
    height: "5'4\"",
    weight: "135",
    marital_status: "Single",
    occupation: "Teacher",
    preferred_language: "Spanish",
    primary_care_physician: "Dr. Martinez",
    usual_transport_mode: "Ambulance"
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174000",
    first_name: "Robert",
    last_name: "Johnson",
    dob: "1978-11-30",
    gender: "Male",
    address: "789 Wellness Pkwy",
    city: "Atlanta",
    state: "GA",
    zip: "30310",
    phone: "(404) 555-0127",
    email: "robert.johnson@email.com",
    primary_insurance: "United Healthcare",
    secondary_insurance: "Medicaid",
    medical_conditions: ["Arthritis", "High Cholesterol"],
    allergies: ["Sulfa Drugs"],
    medications: ["Lipitor", "Celebrex"],
    emergency_contact_name: "Mary Johnson",
    emergency_contact_phone: "(404) 555-0128",
    legacy_display_id: "PAT-12347",
    last_physical: "2023-12-20T11:45:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    blood_type: "B-",
    height: "6'0\"",
    weight: "200",
    marital_status: "Divorced",
    occupation: "Accountant",
    preferred_language: "English",
    primary_care_physician: "Dr. Thompson",
    usual_transport_mode: "Wheelchair Van"
  }
];

// String constants
const STRINGS = {
  title: "Patient Directory",
  searchPlaceholder: "Search by last name, DOB, address, or facility...",
  hideInactive: "Hide inactive patients",
  hideNotSeen: "Hide patients not seen in the past year",
  addPatient: "Add New Patient",
  viewReport: "View Report",
  viewDispatch: "Last Dispatch",
  import: "Import",
  export: "Export",
  loading: "Loading patients...",
  error: "Error loading patients. Please try again later.",
  noData: "No patients found"
};

export const PatientDirectory = () => {
  const navigate = useNavigate();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  
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

      const combinedData = data?.length ? data : mockPatients;
      console.log('Fetched patients:', combinedData);
      return combinedData;
    }
  });

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const handleSearchResults = useCallback((results: Patient[]) => {
    setFilteredPatients(results);
  }, []);

  const handleAddPatient = () => {
    navigate('/patient/new');
  };

  const handleViewReport = (patientId: string) => {
    navigate(`/patient/${patientId}/report`);
  };

  const handleViewDispatch = (patientId: string) => {
    navigate(`/patient/${patientId}/dispatch`);
  };

  const searchFields: (keyof Patient)[] = [
    'last_name',
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
              <Card className="futuristic-panel p-6 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CircuitBoard className="h-6 w-6 text-medical-secondary animate-pulse" />
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
                        {STRINGS.title}
                      </h2>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        onClick={handleAddPatient}
                        className="flex items-center gap-2 bg-medical-primary hover:bg-medical-primary/90 text-white"
                      >
                        <Plus className="h-4 w-4" />
                        {STRINGS.addPatient}
                      </Button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-medical-secondary hover:text-medical-primary transition-colors duration-300 glass-panel">
                        <Import className="h-4 w-4" />
                        {STRINGS.import}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-medical-secondary hover:text-medical-primary transition-colors duration-300 glass-panel">
                        <Download className="h-4 w-4" />
                        {STRINGS.export}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-end">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="search" className="text-medical-primary">Search:</Label>
                      <div className="flex gap-2 items-center">
                        <Database className="h-4 w-4 text-medical-secondary" />
                        <SearchBar
                          items={patients || []}
                          searchFields={searchFields}
                          onResultsChange={handleSearchResults}
                          placeholder={STRINGS.searchPlaceholder}
                          className="w-full glass-panel"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-medical-primary">Filters:</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="hideInactive" />
                          <label htmlFor="hideInactive" className="text-sm text-medical-primary/80">
                            {STRINGS.hideInactive}
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="hideNotSeen" />
                          <label htmlFor="hideNotSeen" className="text-sm text-medical-primary/80">
                            {STRINGS.hideNotSeen}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isLoading && (
                    <div className="text-medical-secondary animate-pulse">{STRINGS.loading}</div>
                  )}

                  {error && (
                    <div className="text-red-500">
                      {STRINGS.error}
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
                          <TableHead className="text-medical-secondary">Last Seen</TableHead>
                          <TableHead className="text-medical-secondary">Actions</TableHead>
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
                              {patient.last_physical ? formatDate(patient.last_physical) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewReport(patient.id)}
                                  className="flex items-center gap-1"
                                >
                                  <FileSpreadsheet className="h-4 w-4" />
                                  {STRINGS.viewReport}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDispatch(patient.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Ambulance className="h-4 w-4" />
                                  {STRINGS.viewDispatch}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDirectory;

