import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { UIPanel, UIAction } from '@/types/ui'

export function useUIData() {
  const { data: panels, isLoading: panelsLoading } = useQuery({
    queryKey: ['panels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('panels')
        .select('*')
        .eq('is_active', true)
      
      if (error) throw error
      return data as UIPanel[]
    }
  })

  const { data: actions, isLoading: actionsLoading } = useQuery({
    queryKey: ['actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
      
      if (error) throw error
      return data as UIAction[]
    }
  })

  return {
    panels: panels || [],
    actions: actions || [],
    isLoading: panelsLoading || actionsLoading
  }
}