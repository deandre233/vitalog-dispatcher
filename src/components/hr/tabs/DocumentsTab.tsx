
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  FileText, 
  Upload, 
  Folder, 
  Clock, 
  Calendar,
  CheckCircle2, 
  AlertTriangle, 
  FileQuestion,
  Brain,
  Search,
  Download,
  Trash2,
  Plus,
  FileUp,
  Paperclip
} from "lucide-react";
import { format } from "date-fns";
import { useEmployeeDocuments } from "@/hooks/useEmployeeDocuments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export function DocumentsTab() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee } = useEmployeeDetails(employeeId);
  const { 
    documents, 
    isLoading, 
    uploadDocument, 
    deleteDocument, 
    analyzeDocument 
  } = useEmployeeDocuments(employeeId);
  
  const [activeTab, setActiveTab] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [documentDate, setDocumentDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const employeeName = `${employee?.first_name || ''} ${employee?.last_name || ''}`;
  
  const documentTypes = [
    "Medical Clearance",
    "Certification Documentation",
    "Doctor's Note",
    "Performance Review",
    "Training Record",
    "Accommodation Request",
    "Incident Report",
    "Corrective Action",
    "Commendation",
    "Compliance Documentation",
    "Equipment Sign-off",
    "Other"
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Auto-detect document type based on filename if possible
    if (file) {
      const filename = file.name.toLowerCase();
      
      if (filename.includes("cert") || filename.includes("certification")) {
        setDocumentType("Certification Documentation");
      } else if (filename.includes("doctor") || filename.includes("medical") || filename.includes("health")) {
        setDocumentType("Doctor's Note");
      } else if (filename.includes("review") || filename.includes("performance")) {
        setDocumentType("Performance Review");
      } else if (filename.includes("training")) {
        setDocumentType("Training Record");
      } else if (filename.includes("incident")) {
        setDocumentType("Incident Report");
      } else if (filename.includes("compliance")) {
        setDocumentType("Compliance Documentation");
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedFile || !documentType) {
      toast.error("Please select a file and document type");
      return;
    }
    
    setIsUploading(true);
    
    try {
      await uploadDocument({
        file: selectedFile,
        type: documentType,
        description: description,
        date: documentDate || new Date(),
      });
      
      toast.success("Document uploaded successfully");
      setShowUploadDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setDocumentType("");
    setDocumentDate(undefined);
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleAnalyze = async (documentId: string) => {
    setIsAnalyzing(documentId);
    
    try {
      const result = await analyzeDocument(documentId);
      
      if (result?.success) {
        toast.success("Document analyzed successfully");
      } else {
        toast.error("Failed to analyze document");
      }
    } catch (error) {
      console.error("Error analyzing document:", error);
      toast.error("Failed to analyze document");
    } finally {
      setIsAnalyzing(null);
    }
  };
  
  const handleDelete = async (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(documentId);
        toast.success("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document");
      }
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Medical Clearance":
      case "Doctor's Note":
        return <FileText className="h-8 w-8 text-blue-600" />;
      case "Certification Documentation":
        return <CheckCircle2 className="h-8 w-8 text-green-600" />;
      case "Performance Review":
        return <FileText className="h-8 w-8 text-purple-600" />;
      case "Training Record":
        return <FileText className="h-8 w-8 text-orange-600" />;
      case "Incident Report":
        return <AlertTriangle className="h-8 w-8 text-red-600" />;
      case "Corrective Action":
        return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case "Commendation":
        return <CheckCircle2 className="h-8 w-8 text-emerald-600" />;
      default:
        return <FileQuestion className="h-8 w-8 text-gray-600" />;
    }
  };
  
  const filteredDocuments = documents.filter(doc => {
    // Filter by tab
    if (activeTab !== "all" && doc.type !== activeTab) {
      return false;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doc.type.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.filename.toLowerCase().includes(query) ||
        (doc.ai_analysis && JSON.stringify(doc.ai_analysis).toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const renderDocumentList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary"></div>
        </div>
      );
    }
    
    if (filteredDocuments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Folder className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm mt-2">
            {searchQuery 
              ? "Try adjusting your search query" 
              : activeTab !== "all" 
                ? `No ${activeTab} documents uploaded yet` 
                : "Upload documents to get started"}
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setShowUploadDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <div className="flex items-center p-4 bg-gray-50 border-b">
              {getDocumentIcon(doc.type)}
              <div className="ml-3 flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {doc.filename}
                </h3>
                <Badge variant="outline" className="mt-1">
                  {doc.type}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(doc.date), "MMM d, yyyy")}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {format(new Date(doc.created_at), "MMM d, yyyy")}
                </div>
                
                <p className="text-sm text-gray-700">
                  {doc.description || "No description provided"}
                </p>
                
                {doc.ai_analysis && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-center mb-1">
                      <Brain className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="text-xs font-medium text-blue-700">AI Analysis</span>
                    </div>
                    <p className="text-xs text-blue-800">
                      {typeof doc.ai_analysis === 'string' 
                        ? doc.ai_analysis 
                        : doc.ai_analysis.summary || JSON.stringify(doc.ai_analysis)}
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAnalyze(doc.id)}
                    disabled={!!isAnalyzing}
                  >
                    {isAnalyzing === doc.id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-1" />
                    ) : (
                      <Brain className="h-4 w-4 mr-1" />
                    )}
                    Analyze
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Employee Documents: {employeeName}
            </CardTitle>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Brain className="h-4 w-4 text-blue-700" />
            <AlertTitle className="text-blue-800">AI-Powered Document Processing</AlertTitle>
            <AlertDescription className="text-blue-700">
              Upload medical clearances, doctor's notes, and other documents. Our AI will analyze the content, 
              extract important information, and flag any critical items for attention.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Medical Clearance">Medical</TabsTrigger>
                <TabsTrigger value="Doctor's Note">Notes</TabsTrigger>
                <TabsTrigger value="Certification Documentation">Certs</TabsTrigger>
                <TabsTrigger value="Performance Review">Performance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="h-[600px] rounded-md">
            {renderDocumentList()}
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Upload Employee Document</DialogTitle>
            <DialogDescription>
              Upload a document for {employeeName}. The system will automatically process and analyze the document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Document File</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 flex flex-col items-center justify-center border-dashed"
                >
                  <FileUp className="h-8 w-8 mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "Click to select a file"}
                  </span>
                  {selectedFile && (
                    <span className="text-xs text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                </Button>
                <input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="date">Document Date</Label>
              <DatePicker
                date={documentDate}
                onDateChange={setDocumentDate}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description of the document"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading || !selectedFile || !documentType}>
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Uploading...
                </>
              ) : (
                <>
                  <Paperclip className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
