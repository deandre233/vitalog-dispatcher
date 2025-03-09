
import { DocumentUploadForm } from "@/components/document/DocumentUploadForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Brain, FileText, CheckCircle, Clock } from "lucide-react";

export const DocumentUpload = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentUploadForm />
        </div>
        
        <div className="space-y-6">
          <Card className="p-4 shadow-md border-l-4 border-l-medical-secondary bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-medical-primary" />
              <h3 className="font-semibold text-lg text-medical-primary">Document AI</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload medical documents and our AI will automatically:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Extract key patient information
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Categorize document types
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Identify medical conditions
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Flag critical information
              </li>
            </ul>
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Supported Document Types</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Patient records, PCR forms, PCS documents, insurance cards, 
                    medical history, patient transfer forms
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 shadow-md border border-gray-200">
            <h3 className="font-semibold text-lg text-medical-primary mb-3">Recent Processing</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                <div className="bg-blue-100 p-1.5 rounded">
                  <FileText className="h-4 w-4 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">Patient_Transfer_Form_123.pdf</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Processed 4 minutes ago</span>
                  </div>
                </div>
                <div className="bg-green-100 px-2 py-1 rounded text-xs text-green-700">
                  Completed
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                <div className="bg-blue-100 p-1.5 rounded">
                  <FileText className="h-4 w-4 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">Insurance_Card_Smith_Jane.jpg</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Processed 15 minutes ago</span>
                  </div>
                </div>
                <div className="bg-green-100 px-2 py-1 rounded text-xs text-green-700">
                  Completed
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                <div className="bg-blue-100 p-1.5 rounded">
                  <FileText className="h-4 w-4 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">Medical_History_Johnson.pdf</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Processed 32 minutes ago</span>
                  </div>
                </div>
                <div className="bg-green-100 px-2 py-1 rounded text-xs text-green-700">
                  Completed
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentUpload;
