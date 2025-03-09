
import { useState } from "react";
import { useEmployeeDocuments } from "@/hooks/useEmployeeDocuments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileIcon, Shield, Calendar, Loader2, FileText, Download, Trash2, Microscope } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function DocumentsTab({ employeeId }: { employeeId: string }) {
  const { documents, isLoading, isProcessing, uploadDocument, deleteDocument, analyzeDocument } = useEmployeeDocuments(employeeId);
  const [activeTab, setActiveTab] = useState("documents");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    date: new Date(),
  });
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFormChange = (key: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return;
    }
    
    try {
      await uploadDocument({
        file: selectedFile,
        type: formData.type,
        description: formData.description,
        date: formData.date,
      });
      
      // Reset form
      setSelectedFile(null);
      setFormData({
        type: "",
        description: "",
        date: new Date(),
      });
      setActiveTab("documents");
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };
  
  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
  
  const handleAnalyze = async (documentId: string) => {
    setIsAnalyzing(true);
    try {
      await analyzeDocument(documentId);
      setSelectedDocument(null); // Reset to refresh the view
    } catch (error) {
      console.error("Error analyzing document:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "Medical Clearance":
        return "text-green-500";
      case "Training Certificate":
        return "text-blue-500";
      case "License":
        return "text-purple-500";
      case "Certification":
        return "text-indigo-500";
      case "Performance Review":
        return "text-orange-500";
      case "Doctor's Note":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  
  // Helper function to safely get document analysis data
  const getDocumentAnalysis = (document: any) => {
    if (!document.ai_analysis) return null;
    
    try {
      // Handle case where ai_analysis might be a string
      return typeof document.ai_analysis === 'string' 
        ? JSON.parse(document.ai_analysis) 
        : document.ai_analysis;
    } catch (e) {
      console.error("Error parsing document analysis:", e);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="documents" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center">
              <FileIcon className="mr-2 h-4 w-4" />
              Upload New
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="documents" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No documents found</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setActiveTab("upload")}
                >
                  Upload a Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {documents.map((document: any) => {
                const fileExt = document.filename.split('.').pop()?.toLowerCase();
                const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '');
                const isPDF = fileExt === 'pdf';
                const documentType = document.type || "Unknown Type";
                const typeColor = getDocumentTypeColor(documentType);
                const analysis = getDocumentAnalysis(document);
                
                return (
                  <Card key={document.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle>{document.filename}</CardTitle>
                            <Badge variant="outline">{documentType}</Badge>
                          </div>
                          <CardDescription className="mt-1 flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {document.date ? format(new Date(document.date), "PPP") : 
                             document.created_at ? format(new Date(document.created_at), "PPP") : "Unknown date"}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <a href={document.url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </a>
                            </DropdownMenuItem>
                            {!analysis && (
                              <DropdownMenuItem 
                                onClick={() => handleAnalyze(document.id)}
                                disabled={isAnalyzing}
                              >
                                <Microscope className="mr-2 h-4 w-4" />
                                {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => setSelectedDocument(selectedDocument === document.id ? null : document.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {selectedDocument === document.id ? "Hide Details" : "View Details"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(document.id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    {selectedDocument === document.id && (
                      <CardContent className="pt-2 pb-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{document.description || "No description provided"}</p>
                          </div>
                          
                          {isImage && (
                            <div>
                              <h4 className="font-medium mb-1">Preview</h4>
                              <div className="mt-2 rounded-md overflow-hidden border border-gray-200">
                                <a href={document.url} target="_blank" rel="noopener noreferrer">
                                  <img src={document.url} alt={document.filename} className="max-w-full h-auto" />
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {isPDF && (
                            <div>
                              <h4 className="font-medium mb-1">PDF Document</h4>
                              <Button asChild variant="outline" className="mt-2">
                                <a href={document.url} target="_blank" rel="noopener noreferrer">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Open PDF
                                </a>
                              </Button>
                            </div>
                          )}
                          
                          {analysis && (
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="ai-analysis">
                                <AccordionTrigger>
                                  <span className="flex items-center text-sm font-medium">
                                    <Shield className="mr-2 h-4 w-4" />
                                    AI Analysis
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3 p-2 text-sm">
                                    {analysis.summary && (
                                      <div>
                                        <h5 className="font-medium">Summary</h5>
                                        <p className="text-muted-foreground">{analysis.summary}</p>
                                      </div>
                                    )}
                                    
                                    {analysis.keyPoints && analysis.keyPoints.length > 0 && (
                                      <div>
                                        <h5 className="font-medium">Key Points</h5>
                                        <ul className="list-disc pl-5 text-muted-foreground">
                                          {analysis.keyPoints.map((point: string, index: number) => (
                                            <li key={index}>{point}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                                      <div>
                                        <h5 className="font-medium">Recommendations</h5>
                                        <ul className="list-disc pl-5 text-muted-foreground">
                                          {analysis.recommendations.map((rec: string, index: number) => (
                                            <li key={index}>{rec}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {analysis.expiryDate && (
                                      <div>
                                        <h5 className="font-medium">Expiry Date</h5>
                                        <p className="text-muted-foreground">{analysis.expiryDate}</p>
                                      </div>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Upload employee-related documents such as certificates, licenses, or medical clearances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="file">Select File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      required
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Document Type</Label>
                    <Select 
                      value={formData.type}
                      onValueChange={(value) => handleFormChange("type", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medical Clearance">Medical Clearance</SelectItem>
                        <SelectItem value="Training Certificate">Training Certificate</SelectItem>
                        <SelectItem value="License">License</SelectItem>
                        <SelectItem value="Certification">Certification</SelectItem>
                        <SelectItem value="Performance Review">Performance Review</SelectItem>
                        <SelectItem value="Doctor's Note">Doctor's Note</SelectItem>
                        <SelectItem value="Certification Documentation">Certification Documentation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Document Date</Label>
                    <DatePicker
                      date={formData.date}
                      onDateChange={(date) => date && handleFormChange("date", date)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                      placeholder="Enter a description of the document..."
                      rows={4}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("documents")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing || !selectedFile}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Document
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
