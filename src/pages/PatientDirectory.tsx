import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HRLayout } from "@/components/layout/HRLayout";
import { AIInsightPanel } from "@/components/ai/AIInsightPanel";
import { analyzePatientData } from "@/utils/aiAnalysis";
import type { Patient } from "@/types/patient";
import type { AIAnalysisResult } from "@/utils/aiAnalysis";

export function PatientDirectory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('last_name', { ascending: true });

        if (error) throw error;
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to load patient directory",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  useEffect(() => {
    if (selectedPatient) {
      analyzePatientData(selectedPatient).then(result => {
        if (result) setAiAnalysis(result);
      });
    }
  }, [selectedPatient]);

  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patientId: string) => {
    setSelectedPatient(patientId);
    navigate(`/patient/${patientId}`);
  };

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
          <Button onClick={() => navigate('/patient/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/50"
                  onClick={() => handlePatientClick(patient.id)}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} />
                      <AvatarFallback>
                        {patient.first_name?.[0]}{patient.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'No DOB'}
                      </p>
                      {patient.medical_conditions && patient.medical_conditions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 justify-center">
                          {patient.medical_conditions.slice(0, 2).map((condition, index) => (
                            <Badge key={index} variant="outline">
                              {condition}
                            </Badge>
                          ))}
                          {patient.medical_conditions.length > 2 && (
                            <Badge variant="outline">
                              +{patient.medical_conditions.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredPatients.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <p className="text-gray-500">No patients found</p>
              </div>
            )}
          </div>

          {aiAnalysis && (
            <div className="w-80 hidden lg:block">
              <AIInsightPanel analysis={aiAnalysis} />
            </div>
          )}
        </div>
      </div>
    </HRLayout>
  );
}

export default PatientDirectory;