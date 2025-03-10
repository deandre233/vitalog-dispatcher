
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeDocument, DocumentUploadParams } from "@/types/employee-documents";

export const useEmployeeDocuments = (employeeId?: string) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['employee-documents', employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      
      // Use a type assertion to tell TypeScript that this table exists
      const { data, error } = await supabase
        .from('employee_documents' as any)
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching employee documents:", error);
        toast.error("Failed to load employee documents");
        throw error;
      }
      
      return data || [];
    },
    enabled: !!employeeId
  });

  // Upload document
  const uploadDocument = async ({ file, type, description, date }: DocumentUploadParams) => {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    
    setIsProcessing(true);
    
    try {
      // 1. Upload the file to storage
      const filename = `${Date.now()}_${file.name}`;
      const filePath = `employee_documents/${employeeId}/${filename}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }
      
      // 2. Get the public URL
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData?.publicUrl;
      
      // 3. Create a record in the database
      const { data: documentData, error: documentError } = await supabase
        .from('employee_documents' as any)
        .insert([
          {
            employee_id: employeeId,
            filename: file.name,
            storage_path: filePath,
            url: publicUrl,
            type,
            description,
            date: date.toISOString(),
            document_type: type // Ensure document_type is set, as it's required
          }
        ])
        .select('*')
        .single();
      
      if (documentError) {
        console.error("Error creating document record:", documentError);
        throw documentError;
      }
      
      // 4. Analyze the document if it's a suitable type
      if (['Medical Clearance', 'Doctor\'s Note', 'Certification Documentation'].includes(type)) {
        await analyzeDocument((documentData as any).id);
      }
      
      // 5. Refresh the documents list
      queryClient.invalidateQueries({ queryKey: ['employee-documents', employeeId] });
      
      return documentData;
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete document
  const deleteDocument = async (documentId: string) => {
    if (!documentId) {
      throw new Error("Document ID is required");
    }
    
    // 1. Get the document to get the storage path
    const { data: documentData, error: fetchError } = await supabase
      .from('employee_documents' as any)
      .select('storage_path')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching document:", fetchError);
      throw fetchError;
    }
    
    // 2. Delete the file from storage
    if ((documentData as any)?.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([(documentData as any).storage_path]);
      
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue anyway to delete the record
      }
    }
    
    // 3. Delete the record from the database
    const { error: deleteError } = await supabase
      .from('employee_documents' as any)
      .delete()
      .eq('id', documentId);
    
    if (deleteError) {
      console.error("Error deleting document record:", deleteError);
      throw deleteError;
    }
    
    // 4. Refresh the documents list
    queryClient.invalidateQueries({ queryKey: ['employee-documents', employeeId] });
  };

  // Analyze document with AI
  const analyzeDocument = async (documentId: string) => {
    if (!documentId) {
      throw new Error("Document ID is required");
    }
    
    // 1. Get the document to get the URL and other details
    const { data: documentData, error: fetchError } = await supabase
      .from('employee_documents' as any)
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching document:", fetchError);
      throw fetchError;
    }
    
    // 2. Call the Supabase Edge Function to analyze the document
    const { data, error } = await supabase.functions.invoke('analyze-employee-document', {
      body: { 
        documentId,
        documentUrl: (documentData as any)?.url,
        documentType: (documentData as any)?.type,
        documentName: (documentData as any)?.filename,
        employeeId: (documentData as any)?.employee_id
      }
    });
    
    if (error) {
      console.error("Error analyzing document:", error);
      throw error;
    }
    
    // 3. Update the document with the analysis results
    const { error: updateError } = await supabase
      .from('employee_documents' as any)
      .update({ ai_analysis: data.analysis })
      .eq('id', documentId);
    
    if (updateError) {
      console.error("Error updating document with analysis:", updateError);
      throw updateError;
    }
    
    // 4. Refresh the documents list
    queryClient.invalidateQueries({ queryKey: ['employee-documents', employeeId] });
    
    return { success: true, analysis: data.analysis };
  };

  // Get AI recommendations for document types
  const getAiDocumentRecommendations = async () => {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    
    const { data, error } = await supabase.functions.invoke('get-document-recommendations', {
      body: { employeeId }
    });
    
    if (error) {
      console.error("Error getting document recommendations:", error);
      throw error;
    }
    
    return data.recommendations;
  };

  return {
    documents,
    isLoading,
    isProcessing,
    uploadDocument,
    deleteDocument,
    analyzeDocument,
    getAiDocumentRecommendations
  };
};
