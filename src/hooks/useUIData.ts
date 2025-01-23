import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UIPage {
  id: string;
  name: string;
  url: string;
  content: any;
  user_access_level: 'admin' | 'user' | 'guest';
  meta_data: {
    description?: string;
    category?: string;
    [key: string]: any;
  };
}

interface UIPanel {
  id: string;
  name: string;
  content: any;
  visibility_rule?: string;
  linked_page_id?: string;
  is_active: boolean;
}

interface UIAction {
  id: string;
  action_name: string;
  trigger_element: string;
  linked_page_id?: string;
  linked_panel_id?: string;
  event_handler: any;
}

export function useUIData(pageId?: string) {
  const queryClient = useQueryClient();

  // Fetch page data
  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['page', pageId],
    queryFn: async () => {
      if (!pageId) return null;

      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) {
        console.error('Error fetching page:', error);
        toast.error('Failed to fetch page data');
        throw error;
      }

      return data as UIPage;
    },
    enabled: !!pageId
  });

  // Fetch related panels
  const { data: panels, isLoading: panelsLoading } = useQuery({
    queryKey: ['panels', pageId],
    queryFn: async () => {
      if (!pageId) return [];

      const { data, error } = await supabase
        .from('panels')
        .select('*')
        .eq('linked_page_id', pageId);

      if (error) {
        console.error('Error fetching panels:', error);
        toast.error('Failed to fetch panels');
        throw error;
      }

      return data as UIPanel[];
    },
    enabled: !!pageId
  });

  // Fetch related actions
  const { data: actions, isLoading: actionsLoading } = useQuery({
    queryKey: ['actions', pageId],
    queryFn: async () => {
      if (!pageId) return [];

      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('linked_page_id', pageId);

      if (error) {
        console.error('Error fetching actions:', error);
        toast.error('Failed to fetch actions');
        throw error;
      }

      return data as UIAction[];
    },
    enabled: !!pageId
  });

  // Create new page with auto-populated data
  const createPage = useMutation({
    mutationFn: async (pageData: Partial<UIPage>) => {
      const autoGeneratedData = {
        name: pageData.name || 'New Page',
        url: pageData.url || `/page-${Date.now()}`,
        meta_data: {
          description: `Description for ${pageData.name || 'New Page'}`,
          category: 'general',
          ...pageData.meta_data
        },
        user_access_level: pageData.user_access_level || 'user'
      };

      const { data, error } = await supabase
        .from('pages')
        .insert([{ ...autoGeneratedData, ...pageData }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page'] });
      toast.success('Page created successfully');
    },
    onError: (error) => {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
    }
  });

  // Create panel with auto-linking
  const createPanel = useMutation({
    mutationFn: async (panelData: Partial<UIPanel>) => {
      // Ensure required fields are present
      const panel = {
        name: panelData.name || 'New Panel',
        content: panelData.content || {},
        is_active: panelData.is_active ?? true,
        ...panelData
      };

      const { data, error } = await supabase
        .from('panels')
        .insert([panel])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['panels'] });
      toast.success('Panel created successfully');
    },
    onError: (error) => {
      console.error('Error creating panel:', error);
      toast.error('Failed to create panel');
    }
  });

  // Create action with auto-linking
  const createAction = useMutation({
    mutationFn: async (actionData: Partial<UIAction>) => {
      // Ensure required fields are present
      const action = {
        action_name: actionData.action_name || 'New Action',
        trigger_element: actionData.trigger_element || 'default-trigger',
        event_handler: actionData.event_handler || {},
        ...actionData
      };

      const { data, error } = await supabase
        .from('actions')
        .insert([action])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      toast.success('Action created successfully');
    },
    onError: (error) => {
      console.error('Error creating action:', error);
      toast.error('Failed to create action');
    }
  });

  return {
    page,
    panels,
    actions,
    isLoading: pageLoading || panelsLoading || actionsLoading,
    createPage,
    createPanel,
    createAction
  };
}