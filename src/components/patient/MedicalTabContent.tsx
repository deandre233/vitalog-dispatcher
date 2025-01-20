import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MedicalHistorySearch } from "./MedicalHistorySearch";

interface MedicalTabContentProps {
  patientId?: string;
}

export const MedicalTabContent = ({ patientId: propPatientId }: MedicalTabContentProps) => {
  const { toast } = useToast();
  const { name } = useParams();
  const [patientId, setPatientId] = useState<string | undefined>(propPatientId);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("known");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentType, setDocumentType] = useState("facesheet");
  const [medicationSearchTerm, setMedicationSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<Array<{ code: string; description: string }>>([]);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);

  // First, fetch the patient ID if not provided as a prop
  useEffect(() => {
    const fetchPatientId = async () => {
      if (propPatientId) {
        setPatientId(propPatientId);
        setIsLoadingPatient(false);
        return;
      }

      if (!name) {
        toast({
          title: "Error",
          description: "Patient name is required",
          variant: "destructive",
        });
        setIsLoadingPatient(false);
        return;
      }

      try {
        // Decode the URL-encoded name and split into first and last name
        const decodedName = decodeURIComponent(name);
        const [lastName, firstName] = decodedName.split(", ");

        const { data, error } = await supabase
          .from('patients')
          .select('id')
          .eq('first_name', firstName)
          .eq('last_name', lastName)
          .single();

        if (error) throw error;

        if (data) {
          setPatientId(data.id);
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        toast({
          title: "Error",
          description: "Failed to fetch patient information",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPatient(false);
      }
    };

    fetchPatientId();
  }, [name, propPatientId, toast]);

  // Add predictive search effect
  useEffect(() => {
    const getPredictions = async () => {
      if (medicationSearchTerm.length >= 2) {
        try {
          const { data, error } = await supabase.functions.invoke('predict-medications', {
            body: { searchTerm: medicationSearchTerm }
          });

          if (error) throw error;
          setPredictions(data.suggestions || []);
        } catch (error) {
          console.error('Error getting predictions:', error);
        }
      } else {
        setPredictions([]);
      }
    };

    const timeoutId = setTimeout(getPredictions, 300);
    return () => clearTimeout(timeoutId);
  }, [medicationSearchTerm]);

  const handleSearch = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required to search medications",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-medical-search', {
        body: { searchTerm: medicationSearchTerm, type: 'medication' }
      });

      if (error) throw error;

      setSearchResults(data.results);
      toast({
        title: "Search Results",
        description: `Found ${data.results.length} matching medications`,
      });

    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Error",
        description: "Failed to search medications",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCondition = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required to add condition",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: patient, error: fetchError } = await supabase
        .from('patients')
        .select('medical_conditions')
        .eq('id', patientId)
        .single();

      if (fetchError) throw fetchError;

      const updatedConditions = [...(patient.medical_conditions || []), searchTerm];

      const { error: updateError } = await supabase
        .from('patients')
        .update({ medical_conditions: updatedConditions })
        .eq('id', patientId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Medical condition has been added to the patient's record.",
      });

      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding condition:', error);
      toast({
        title: "Error",
        description: "Failed to add medical condition",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        
        toast({
          title: `Processing ${documentType}`,
          description: "AI is analyzing the document...",
        });

        const { data, error } = await supabase.functions.invoke('analyze-medical-documents', {
          body: { fileContent, documentType }
        });

        if (error) throw error;

        const { error: updateError } = await supabase
          .from('patients')
          .update({
            medical_conditions: data.medicalConditions,
            medications: data.medications,
            allergies: data.allergies
          })
          .eq('id', patientId);

        if (updateError) throw updateError;

        toast({
          title: "Analysis complete",
          description: `Found ${data.medicalConditions.length} conditions, ${data.medications.length} medications, and ${data.allergies.length} allergies.`,
        });
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "Error",
        description: "Failed to process the medical document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHistoryAdd = async (history: { code: string; description: string }) => {
    try {
      const { error } = await supabase
        .from('medical_history')
        .insert({
          patient_id: patientId,
          type: 'condition',
          description: `${history.code} - ${history.description}`
        });

      if (error) throw error;

      setMedicalHistory([...medicalHistory, history]);
      toast({
        title: "Success",
        description: "Medical history has been added to the patient's record.",
      });
    } catch (error) {
      console.error('Error adding medical history:', error);
      toast({
        title: "Error",
        description: "Failed to add medical history",
        variant: "destructive",
      });
    }
  };

  if (isLoadingPatient) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Unable to load patient information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Medical and Surgical History</h3>
          <RadioGroup
            defaultValue={selectedStatus}
            onValueChange={setSelectedStatus}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="known" id="known" />
              <Label htmlFor="known">Known</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unknown" id="unknown" />
              <Label htmlFor="unknown">Unknown</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">None</Label>
            </div>
          </RadioGroup>

          {selectedStatus === "known" && (
            <MedicalHistorySearch
              patientId={patientId}
              onHistoryAdd={handleHistoryAdd}
            />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Medications</h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search medications (e.g., 'Lisinopril' or 'diabetes')"
                  value={medicationSearchTerm}
                  onChange={(e) => setMedicationSearchTerm(e.target.value)}
                  className="w-full"
                />
                {predictions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {predictions.map((prediction, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setMedicationSearchTerm(prediction);
                          setPredictions([]);
                          handleSearch();
                        }}
                      >
                        {prediction}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                variant="secondary" 
                onClick={handleSearch}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              <Button onClick={() => handleAddCondition()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[200px] border rounded-md p-4">
            {searchResults.map((med, index) => (
              <div key={index} className="py-2 border-b last:border-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{med.generic_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {med.brand_names?.join(", ")} - {med.medication_class}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>Common dosages: {med.common_dosages?.join(", ")}</p>
                    <p>Frequency: {med.frequencies?.join(", ")}</p>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {med.indications?.map((indication: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {indication}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Document Upload</h3>
          <div className="space-y-4">
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facesheet">Face Sheet</SelectItem>
                <SelectItem value="discharge">Discharge Summary</SelectItem>
                <SelectItem value="history">Medical History</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
