import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ResourceDocumentsParams {
  patientLastName: string;
  patientDOB?: Date;
  beforeDate?: Date;
  hideDeleted: boolean;
  returnYoungest: boolean;
  selectedTypes: string[];
}

export function useResourceDocuments({
  patientLastName,
  patientDOB,
  beforeDate,
  hideDeleted,
  returnYoungest,
  selectedTypes
}: ResourceDocumentsParams) {
  return useQuery({
    queryKey: ['resourceDocuments', patientLastName, patientDOB, beforeDate, hideDeleted, returnYoungest, selectedTypes],
    queryFn: async () => {
      let query = supabase
        .from('patient_documents')
        .select(`
          id,
          patient_id,
          document_type,
          document_date,
          provider,
          comments,
          extraction_status,
          is_active,
          patients (
            first_name,
            last_name
          )
        `)
        .eq('is_active', true);

      if (patientLastName) {
        query = query.ilike('patients.last_name', `${patientLastName}%`);
      }

      if (patientDOB) {
        query = query.eq('patients.dob', patientDOB.toISOString());
      }

      if (beforeDate) {
        query = query.lte('document_date', beforeDate.toISOString());
      }

      if (hideDeleted) {
        query = query.eq('is_active', true);
      }

      if (selectedTypes.length > 0) {
        query = query.in('document_type', selectedTypes);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data for display
      return data.map(doc => ({
        id: doc.id,
        patient: `${doc.patients?.last_name}, ${doc.patients?.first_name}`,
        documentType: doc.document_type,
        age: doc.document_date ? `${new Date(doc.document_date).toLocaleDateString()}` : 'N/A',
        comments: doc.comments || '',
        content: doc.extraction_status,
        attached: 'Yes',
        status: doc.is_active ? 'Active' : 'Inactive'
      }));
    },
    enabled: Boolean(patientLastName || patientDOB)
  });
}