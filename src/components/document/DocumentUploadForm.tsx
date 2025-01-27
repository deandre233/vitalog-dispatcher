import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PatientSearch } from "./PatientSearch";

interface DocumentUploadFormProps {
  onSuccess?: () => void;
}

export function DocumentUploadForm({ onSuccess }: DocumentUploadFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  const [documentType, setDocumentType] = useState("");
  const [provider, setProvider] = useState("");
  const [comments, setComments] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [extractImages, setExtractImages] = useState(true);
  const [convertToGrayscale, setConvertToGrayscale] = useState(true);
  const [directives, setDirectives] = useState({
    notRecorded: false,
    doNotIntubate: false,
    noIVFluids: false,
    comfortMeasures: false
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedPatient || !file || !date || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${selectedPatient.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('patient_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record in database
      const { error: dbError } = await supabase
        .from('patient_documents')
        .insert({
          patient_id: selectedPatient.id,
          file_name: file.name,
          file_path: filePath,
          document_type: documentType,
          document_date: format(date, 'yyyy-MM-dd'),
          provider,
          comments,
          directive_type: Object.entries(directives)
            .filter(([_, value]) => value)
            .map(([key]) => key),
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      // Reset form
      setFile(null);
      setDate(undefined);
      setDocumentType("");
      setProvider("");
      setComments("");
      setDirectives({
        notRecorded: false,
        doNotIntubate: false,
        noIVFluids: false,
        comfortMeasures: false
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Attach Document to Patient</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Patient Search</Label>
              <PatientSearch onSelect={setSelectedPatient} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Document Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advanced_directive">Advanced Directive</SelectItem>
                    <SelectItem value="medical_record">Medical Record</SelectItem>
                    <SelectItem value="lab_result">Lab Result</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="insurance">Insurance Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Provider</Label>
              <Input
                placeholder="Provider name (optional)"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Comments</Label>
              <Textarea
                placeholder="Add any comments about this document"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Directive Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notRecorded"
                    checked={directives.notRecorded}
                    onCheckedChange={(checked) => 
                      setDirectives(prev => ({ ...prev, notRecorded: checked as boolean }))
                    }
                  />
                  <label htmlFor="notRecorded">Not recorded</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="doNotIntubate"
                    checked={directives.doNotIntubate}
                    onCheckedChange={(checked) => 
                      setDirectives(prev => ({ ...prev, doNotIntubate: checked as boolean }))
                    }
                  />
                  <label htmlFor="doNotIntubate">Do not intubate</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noIVFluids"
                    checked={directives.noIVFluids}
                    onCheckedChange={(checked) => 
                      setDirectives(prev => ({ ...prev, noIVFluids: checked as boolean }))
                    }
                  />
                  <label htmlFor="noIVFluids">No IV fluids</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comfortMeasures"
                    checked={directives.comfortMeasures}
                    onCheckedChange={(checked) => 
                      setDirectives(prev => ({ ...prev, comfortMeasures: checked as boolean }))
                    }
                  />
                  <label htmlFor="comfortMeasures">Comfort measures only</label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extractImages"
                  checked={extractImages}
                  onCheckedChange={(checked) => setExtractImages(checked as boolean)}
                />
                <label htmlFor="extractImages">Extract images from PDFs for easier retrieval</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="convertGrayscale"
                  checked={convertToGrayscale}
                  onCheckedChange={(checked) => setConvertToGrayscale(checked as boolean)}
                />
                <label htmlFor="convertGrayscale">Convert images to grayscale for faster transmission</label>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Scanned Pages</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop files here to attach
                  </p>
                </div>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="max-w-xs mx-auto"
                />
                {file && (
                  <p className="text-sm text-green-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading || !file || !selectedPatient}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}