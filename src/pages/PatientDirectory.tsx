import React, { useState, useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/SearchBar";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Database, Import, Files, FileText, 
  Users, Download 
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

export const PatientDirectory = () => {
  const navigate = useNavigate();
  
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-gray-500" />
                      <h2 className="text-2xl font-semibold">Patient Directory</h2>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                        <Import className="h-4 w-4" />
                        Import
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                        <Download className="h-4 w-4" />
                        Export
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-end">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="search">Search:</Label>
                      <div className="flex gap-2 items-center">
                        <Database className="h-4 w-4 text-gray-500" />
                        <Input id="search" placeholder="Search by name, ID, or insurance..." className="w-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Filters:</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="hideInactive" />
                          <label htmlFor="hideInactive" className="text-sm">
                            Hide inactive patients
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="hideNotSeen" />
                          <label htmlFor="hideNotSeen" className="text-sm">
                            Hide patients not seen in the past year
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isLoading && (
                    <div className="text-gray-500">Loading patients...</div>
                  )}

                  {error && (
                    <div className="text-red-500">
                      Error loading patients. Please try again later.
                    </div>
                  )}

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              ID
                            </div>
                          </TableHead>
                          <TableHead>Last Name</TableHead>
                          <TableHead>First Name</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>DOB</TableHead>
                          <TableHead>Insurance</TableHead>
                          <TableHead>Last Seen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patients?.map((patient: Patient) => (
                          <TableRow
                            key={patient.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => navigate(`/patient/${patient.id}`)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Files className="h-4 w-4 text-gray-500" />
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
                                  <div>{patient.primary_insurance}</div>
                                )}
                                {patient.secondary_insurance && (
                                  <div className="text-sm text-gray-500">
                                    {patient.secondary_insurance}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {patient.last_physical ? formatDate(patient.last_physical) : 'N/A'}
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