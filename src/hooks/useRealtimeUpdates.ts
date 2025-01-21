import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up transport records subscription
    const transportChannel = supabase
      .channel('transport_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transport_records' 
        }, 
        (payload) => {
          console.log('Transport record changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['transport_records'] });
          
          switch (payload.eventType) {
            case 'INSERT':
              toast.info('New transport record created');
              break;
            case 'UPDATE':
              toast.info('Transport record updated');
              break;
            case 'DELETE':
              toast.info('Transport record removed');
              break;
          }
        }
      )
      .subscribe();

    // Set up audit logs subscription
    const auditChannel = supabase
      .channel('audit_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_logs'
        },
        (payload) => {
          console.log('Audit log:', payload);
          queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transportChannel);
      supabase.removeChannel(auditChannel);
    };
  }, [queryClient]);
}