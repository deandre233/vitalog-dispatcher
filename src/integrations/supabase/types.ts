export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_definitions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          requires_approval: boolean | null
          type: Database["public"]["Enums"]["action_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          requires_approval?: boolean | null
          type: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          requires_approval?: boolean | null
          type?: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      action_instances: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          definition_id: string | null
          id: string
          metadata: Json | null
          started_at: string | null
          status: Database["public"]["Enums"]["action_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          definition_id?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["action_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          definition_id?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["action_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_instances_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "action_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      actions: {
        Row: {
          action_name: string
          created_at: string | null
          event_handler: Json | null
          id: string
          linked_page_id: string | null
          linked_panel_id: string | null
          trigger_element: string
          updated_at: string | null
        }
        Insert: {
          action_name: string
          created_at?: string | null
          event_handler?: Json | null
          id?: string
          linked_page_id?: string | null
          linked_panel_id?: string | null
          trigger_element: string
          updated_at?: string | null
        }
        Update: {
          action_name?: string
          created_at?: string | null
          event_handler?: Json | null
          id?: string
          linked_page_id?: string | null
          linked_panel_id?: string | null
          trigger_element?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_linked_page_id_fkey"
            columns: ["linked_page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_linked_panel_id_fkey"
            columns: ["linked_panel_id"]
            isOneToOne: false
            referencedRelation: "panels"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_analysis_results: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          patient_id: string | null
          prediction: string | null
          recommendation: string | null
          suggestions: string[] | null
          transport_id: string | null
        }
        Insert: {
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          patient_id?: string | null
          prediction?: string | null
          recommendation?: string | null
          suggestions?: string[] | null
          transport_id?: string | null
        }
        Update: {
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          patient_id?: string | null
          prediction?: string | null
          recommendation?: string | null
          suggestions?: string[] | null
          transport_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_results_transport_id_fkey"
            columns: ["transport_id"]
            isOneToOne: false
            referencedRelation: "transport_records"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          doctor: string | null
          id: string
          location: string | null
          notes: string | null
          patient_id: string | null
          purpose: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          doctor?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          purpose?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          doctor?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          purpose?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      authorization_requests: {
        Row: {
          authorization_number: string | null
          authorized_by: string | null
          created_at: string | null
          id: string
          insurance_id: string | null
          patient_id: string | null
          requested_by: string | null
          service_type: string
          status: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          authorization_number?: string | null
          authorized_by?: string | null
          created_at?: string | null
          id?: string
          insurance_id?: string | null
          patient_id?: string | null
          requested_by?: string | null
          service_type: string
          status?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          authorization_number?: string | null
          authorized_by?: string | null
          created_at?: string | null
          id?: string
          insurance_id?: string | null
          patient_id?: string | null
          requested_by?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authorization_requests_authorized_by_fkey"
            columns: ["authorized_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authorization_requests_insurance_id_fkey"
            columns: ["insurance_id"]
            isOneToOne: false
            referencedRelation: "insurance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authorization_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authorization_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_settings: {
        Row: {
          created_at: string | null
          employer_address: string | null
          employer_name: string | null
          employer_phone: string | null
          id: string
          next_payment_date: string | null
          patient_id: string | null
          preauth_required: string | null
          pricing_schema: string | null
          subscription_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employer_address?: string | null
          employer_name?: string | null
          employer_phone?: string | null
          id?: string
          next_payment_date?: string | null
          patient_id?: string | null
          preauth_required?: string | null
          pricing_schema?: string | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employer_address?: string | null
          employer_name?: string | null
          employer_phone?: string | null
          id?: string
          next_payment_date?: string | null
          patient_id?: string | null
          preauth_required?: string | null
          pricing_schema?: string | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_settings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      centers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string | null
          status: string | null
          type: string
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      claims: {
        Row: {
          amount_claimed: number
          amount_paid: number | null
          claim_number: string
          created_at: string | null
          date_filed: string | null
          description: string | null
          id: string
          patient_id: string | null
          status: Database["public"]["Enums"]["claim_status_type"]
          updated_at: string | null
        }
        Insert: {
          amount_claimed: number
          amount_paid?: number | null
          claim_number: string
          created_at?: string | null
          date_filed?: string | null
          description?: string | null
          id?: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["claim_status_type"]
          updated_at?: string | null
        }
        Update: {
          amount_claimed?: number
          amount_paid?: number | null
          claim_number?: string
          created_at?: string | null
          date_filed?: string | null
          description?: string | null
          id?: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["claim_status_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          content: Json
          content_id: string
          content_type: string
          created_at: string | null
          created_by: string | null
          id: string
          metadata: Json | null
          version_number: number
        }
        Insert: {
          content: Json
          content_id: string
          content_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          version_number: number
        }
        Update: {
          content?: Json
          content_id?: string
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          version_number?: number
        }
        Relationships: []
      }
      corrective_action_documents: {
        Row: {
          corrective_action_id: string | null
          description: string | null
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          corrective_action_id?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          corrective_action_id?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corrective_action_documents_corrective_action_id_fkey"
            columns: ["corrective_action_id"]
            isOneToOne: false
            referencedRelation: "corrective_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corrective_action_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      corrective_actions: {
        Row: {
          acknowledgment_date: string | null
          action_type: string
          created_at: string | null
          description: string
          employee_id: string | null
          follow_up_date: string | null
          id: string
          improvement_plan: string | null
          issue_date: string | null
          issued_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          acknowledgment_date?: string | null
          action_type: string
          created_at?: string | null
          description: string
          employee_id?: string | null
          follow_up_date?: string | null
          id?: string
          improvement_plan?: string | null
          issue_date?: string | null
          issued_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          acknowledgment_date?: string | null
          action_type?: string
          created_at?: string | null
          description?: string
          employee_id?: string | null
          follow_up_date?: string | null
          id?: string
          improvement_plan?: string | null
          issue_date?: string | null
          issued_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corrective_actions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corrective_actions_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_assignments: {
        Row: {
          assignment_reason: string | null
          assignment_time: string | null
          created_at: string | null
          crew_member_id: string | null
          id: string
          transport_id: string | null
          unassignment_time: string | null
          updated_at: string | null
        }
        Insert: {
          assignment_reason?: string | null
          assignment_time?: string | null
          created_at?: string | null
          crew_member_id?: string | null
          id?: string
          transport_id?: string | null
          unassignment_time?: string | null
          updated_at?: string | null
        }
        Update: {
          assignment_reason?: string | null
          assignment_time?: string | null
          created_at?: string | null
          crew_member_id?: string | null
          id?: string
          transport_id?: string | null
          unassignment_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_assignments_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_assignments_transport_id_fkey"
            columns: ["transport_id"]
            isOneToOne: false
            referencedRelation: "transport_records"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_locations: {
        Row: {
          address: string | null
          city: string | null
          county: string | null
          created_at: string | null
          floor_room: string | null
          id: string
          location_type: string | null
          name: string
          state: string | null
          telephone: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          floor_room?: string | null
          id?: string
          location_type?: string | null
          name: string
          state?: string | null
          telephone?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          floor_room?: string | null
          id?: string
          location_type?: string | null
          name?: string
          state?: string | null
          telephone?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      dispatch_patterns: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          frequency: number | null
          id: string
          last_updated: string | null
          location_data: Json | null
          pattern_type: string
          time_patterns: Json | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          last_updated?: string | null
          location_data?: Json | null
          pattern_type: string
          time_patterns?: Json | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          last_updated?: string | null
          location_data?: Json | null
          pattern_type?: string
          time_patterns?: Json | null
        }
        Relationships: []
      }
      employee_navigation_settings: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          is_expanded: boolean | null
          is_visible: boolean | null
          navigation_item_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_expanded?: boolean | null
          is_visible?: boolean | null
          navigation_item_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_expanded?: boolean | null
          is_visible?: boolean | null
          navigation_item_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_navigation_settings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_navigation_settings_navigation_item_id_fkey"
            columns: ["navigation_item_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_payroll_history: {
        Row: {
          access_codes: string | null
          author: string | null
          created_at: string | null
          effective_date: string | null
          employee_id: string | null
          employee_type: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          pay_rate: number | null
          pay_type: string | null
          updated_at: string | null
        }
        Insert: {
          access_codes?: string | null
          author?: string | null
          created_at?: string | null
          effective_date?: string | null
          employee_id?: string | null
          employee_type?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          pay_rate?: number | null
          pay_type?: string | null
          updated_at?: string | null
        }
        Update: {
          access_codes?: string | null
          author?: string | null
          created_at?: string | null
          effective_date?: string | null
          employee_id?: string | null
          employee_type?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          pay_rate?: number | null
          pay_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_payroll_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_privileges: {
        Row: {
          can_create_reports: boolean | null
          can_delete_billing_info: boolean | null
          can_delete_dispatch_info: boolean | null
          can_delete_patient_info: boolean | null
          can_delete_reports: boolean | null
          can_edit_billing_info: boolean | null
          can_edit_dispatch_info: boolean | null
          can_edit_patient_info: boolean | null
          can_edit_reports: boolean | null
          can_use_ai_assistance: boolean | null
          can_view_billing_info: boolean | null
          can_view_dispatch_info: boolean | null
          can_view_patient_info: boolean | null
          can_view_reports: boolean | null
          created_at: string | null
          employee_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          can_create_reports?: boolean | null
          can_delete_billing_info?: boolean | null
          can_delete_dispatch_info?: boolean | null
          can_delete_patient_info?: boolean | null
          can_delete_reports?: boolean | null
          can_edit_billing_info?: boolean | null
          can_edit_dispatch_info?: boolean | null
          can_edit_patient_info?: boolean | null
          can_edit_reports?: boolean | null
          can_use_ai_assistance?: boolean | null
          can_view_billing_info?: boolean | null
          can_view_dispatch_info?: boolean | null
          can_view_patient_info?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          can_create_reports?: boolean | null
          can_delete_billing_info?: boolean | null
          can_delete_dispatch_info?: boolean | null
          can_delete_patient_info?: boolean | null
          can_delete_reports?: boolean | null
          can_edit_billing_info?: boolean | null
          can_edit_dispatch_info?: boolean | null
          can_edit_patient_info?: boolean | null
          can_edit_reports?: boolean | null
          can_use_ai_assistance?: boolean | null
          can_view_billing_info?: boolean | null
          can_view_dispatch_info?: boolean | null
          can_view_patient_info?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_privileges_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_profiles: {
        Row: {
          ai_performance_metrics: Json | null
          ai_recommendations: Json | null
          created_at: string | null
          employee_id: string | null
          id: string
          last_analysis_date: string | null
          updated_at: string | null
        }
        Insert: {
          ai_performance_metrics?: Json | null
          ai_recommendations?: Json | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_analysis_date?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_performance_metrics?: Json | null
          ai_recommendations?: Json | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_analysis_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_profiles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_roles: {
        Row: {
          can_see_non_emergent: boolean | null
          created_at: string | null
          employee_id: string | null
          id: string
          is_administrator: boolean | null
          is_biller: boolean | null
          is_crew_member: boolean | null
          is_dispatcher: boolean | null
          is_hr: boolean | null
          is_mechanic: boolean | null
          is_medical_director: boolean | null
          is_onlooker: boolean | null
          is_principal: boolean | null
          is_provisional: boolean | null
          is_qa_reviewer: boolean | null
          is_salesperson: boolean | null
          is_supervisor: boolean | null
          onlooker_city: string | null
          onlooker_county: string | null
          onlooker_facility: string | null
          supervisor_role: Database["public"]["Enums"]["supervisor_role"] | null
          updated_at: string | null
        }
        Insert: {
          can_see_non_emergent?: boolean | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_administrator?: boolean | null
          is_biller?: boolean | null
          is_crew_member?: boolean | null
          is_dispatcher?: boolean | null
          is_hr?: boolean | null
          is_mechanic?: boolean | null
          is_medical_director?: boolean | null
          is_onlooker?: boolean | null
          is_principal?: boolean | null
          is_provisional?: boolean | null
          is_qa_reviewer?: boolean | null
          is_salesperson?: boolean | null
          is_supervisor?: boolean | null
          onlooker_city?: string | null
          onlooker_county?: string | null
          onlooker_facility?: string | null
          supervisor_role?:
            | Database["public"]["Enums"]["supervisor_role"]
            | null
          updated_at?: string | null
        }
        Update: {
          can_see_non_emergent?: boolean | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_administrator?: boolean | null
          is_biller?: boolean | null
          is_crew_member?: boolean | null
          is_dispatcher?: boolean | null
          is_hr?: boolean | null
          is_mechanic?: boolean | null
          is_medical_director?: boolean | null
          is_onlooker?: boolean | null
          is_principal?: boolean | null
          is_provisional?: boolean | null
          is_qa_reviewer?: boolean | null
          is_salesperson?: boolean | null
          is_supervisor?: boolean | null
          onlooker_city?: string | null
          onlooker_county?: string | null
          onlooker_facility?: string | null
          supervisor_role?:
            | Database["public"]["Enums"]["supervisor_role"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_roles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          access_codes: string | null
          certification_level: string | null
          created_at: string | null
          employee_type: string | null
          first_hired_date: string | null
          first_name: string
          id: string
          last_name: string
          mobile: string | null
          pay_rate: number | null
          pay_type: string | null
          photo_url: string | null
          readable_id: string | null
          station: string | null
          status: string | null
          updated_at: string | null
          uses_timeclock: boolean | null
        }
        Insert: {
          access_codes?: string | null
          certification_level?: string | null
          created_at?: string | null
          employee_type?: string | null
          first_hired_date?: string | null
          first_name: string
          id?: string
          last_name: string
          mobile?: string | null
          pay_rate?: number | null
          pay_type?: string | null
          photo_url?: string | null
          readable_id?: string | null
          station?: string | null
          status?: string | null
          updated_at?: string | null
          uses_timeclock?: boolean | null
        }
        Update: {
          access_codes?: string | null
          certification_level?: string | null
          created_at?: string | null
          employee_type?: string | null
          first_hired_date?: string | null
          first_name?: string
          id?: string
          last_name?: string
          mobile?: string | null
          pay_rate?: number | null
          pay_type?: string | null
          photo_url?: string | null
          readable_id?: string | null
          station?: string | null
          status?: string | null
          updated_at?: string | null
          uses_timeclock?: boolean | null
        }
        Relationships: []
      }
      files: {
        Row: {
          bucket_name: string
          created_at: string | null
          file_name: string
          file_type: Database["public"]["Enums"]["file_type"]
          id: string
          is_public: boolean | null
          metadata: Json | null
          mime_type: string | null
          original_name: string
          related_entity_id: string | null
          related_entity_type: string | null
          size_bytes: number | null
          storage_path: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket_name: string
          created_at?: string | null
          file_name: string
          file_type?: Database["public"]["Enums"]["file_type"]
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          original_name: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          size_bytes?: number | null
          storage_path: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket_name?: string
          created_at?: string | null
          file_name?: string
          file_type?: Database["public"]["Enums"]["file_type"]
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          original_name?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      historical_entries: {
        Row: {
          created_at: string | null
          details: Json
          entered_by: string | null
          entry_date: string
          entry_type: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details: Json
          entered_by?: string | null
          entry_date: string
          entry_type: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json
          entered_by?: string | null
          entry_date?: string
          entry_type?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historical_entries_entered_by_fkey"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_carriers: {
        Row: {
          carrier_name: string
          carrier_type: string
          claims_phone: string | null
          claims_zip: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          carrier_name: string
          carrier_type: string
          claims_phone?: string | null
          claims_zip?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          carrier_name?: string
          carrier_type?: string
          claims_phone?: string | null
          claims_zip?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      insurance_groups: {
        Row: {
          carrier_id: string | null
          created_at: string | null
          group_name: string
          group_number: string
          id: string
          updated_at: string | null
        }
        Insert: {
          carrier_id?: string | null
          created_at?: string | null
          group_name: string
          group_number: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          carrier_id?: string | null
          created_at?: string | null
          group_name?: string
          group_number?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_groups_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "insurance_carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_policies: {
        Row: {
          coverage_type: string
          created_at: string | null
          end_date: string | null
          id: string
          patient_id: string | null
          policy_number: string
          provider: string
          start_date: string
          status: Database["public"]["Enums"]["insurance_status"] | null
          updated_at: string | null
        }
        Insert: {
          coverage_type: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          patient_id?: string | null
          policy_number: string
          provider: string
          start_date: string
          status?: Database["public"]["Enums"]["insurance_status"] | null
          updated_at?: string | null
        }
        Update: {
          coverage_type?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          patient_id?: string | null
          policy_number?: string
          provider?: string
          start_date?: string
          status?: Database["public"]["Enums"]["insurance_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_policies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_records: {
        Row: {
          activation_date: string | null
          carrier_id: string | null
          carrier_name: string
          carrier_type: string
          claims_zip: string | null
          created_at: string | null
          group_id: string | null
          group_name: string | null
          group_number: string | null
          id: string
          nsure_payor_code: string | null
          patient_id: string | null
          patient_relation: string | null
          payor_id: string | null
          phone: string | null
          policy_number: string
          policy_type: string | null
          policy_type_id: string | null
          policyholder_dob: string | null
          policyholder_gender: string | null
          policyholder_name: string | null
          policyholder_phone: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          activation_date?: string | null
          carrier_id?: string | null
          carrier_name: string
          carrier_type: string
          claims_zip?: string | null
          created_at?: string | null
          group_id?: string | null
          group_name?: string | null
          group_number?: string | null
          id?: string
          nsure_payor_code?: string | null
          patient_id?: string | null
          patient_relation?: string | null
          payor_id?: string | null
          phone?: string | null
          policy_number: string
          policy_type?: string | null
          policy_type_id?: string | null
          policyholder_dob?: string | null
          policyholder_gender?: string | null
          policyholder_name?: string | null
          policyholder_phone?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          activation_date?: string | null
          carrier_id?: string | null
          carrier_name?: string
          carrier_type?: string
          claims_zip?: string | null
          created_at?: string | null
          group_id?: string | null
          group_name?: string | null
          group_number?: string | null
          id?: string
          nsure_payor_code?: string | null
          patient_id?: string | null
          patient_relation?: string | null
          payor_id?: string | null
          phone?: string | null
          policy_number?: string
          policy_type?: string | null
          policy_type_id?: string | null
          policyholder_dob?: string | null
          policyholder_gender?: string | null
          policyholder_name?: string | null
          policyholder_phone?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_records_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "insurance_carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_records_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "insurance_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_records_policy_type_id_fkey"
            columns: ["policy_type_id"]
            isOneToOne: false
            referencedRelation: "policy_types"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          patient_id: string | null
          status: Database["public"]["Enums"]["invoice_status_type"]
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status_type"]
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history: {
        Row: {
          created_at: string | null
          date: string | null
          description: string
          id: string
          notes: string | null
          patient_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          created_at: string | null
          diagnosis: string | null
          id: string
          location: string | null
          notes: string | null
          patient_id: string | null
          provider: string | null
          record_date: string | null
          record_type: string
          treatment: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          diagnosis?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          provider?: string | null
          record_date?: string | null
          record_type: string
          treatment?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          diagnosis?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          provider?: string | null
          record_date?: string | null
          record_type?: string
          treatment?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          brand_names: string[] | null
          common_dosages: string[] | null
          contraindications: string[] | null
          created_at: string | null
          frequencies: string[] | null
          generic_name: string
          id: string
          indications: string[] | null
          interactions: string[] | null
          medication_class: string | null
          side_effects: string[] | null
          updated_at: string | null
        }
        Insert: {
          brand_names?: string[] | null
          common_dosages?: string[] | null
          contraindications?: string[] | null
          created_at?: string | null
          frequencies?: string[] | null
          generic_name: string
          id?: string
          indications?: string[] | null
          interactions?: string[] | null
          medication_class?: string | null
          side_effects?: string[] | null
          updated_at?: string | null
        }
        Update: {
          brand_names?: string[] | null
          common_dosages?: string[] | null
          contraindications?: string[] | null
          created_at?: string | null
          frequencies?: string[] | null
          generic_name?: string
          id?: string
          indications?: string[] | null
          interactions?: string[] | null
          medication_class?: string | null
          side_effects?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      navigation: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          link: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          link: string
          name: string
          position: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          link?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          badge_count: number | null
          created_at: string | null
          icon: string | null
          id: string
          parent_id: string | null
          position: number | null
          route: string
          title: string
          updated_at: string | null
        }
        Insert: {
          badge_count?: number | null
          created_at?: string | null
          icon?: string | null
          id?: string
          parent_id?: string | null
          position?: number | null
          route: string
          title: string
          updated_at?: string | null
        }
        Update: {
          badge_count?: number | null
          created_at?: string | null
          icon?: string | null
          id?: string
          parent_id?: string | null
          position?: number | null
          route?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          meta_data: Json | null
          name: string
          updated_at: string | null
          url: string
          user_access_level:
            | Database["public"]["Enums"]["user_access_level"]
            | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          meta_data?: Json | null
          name: string
          updated_at?: string | null
          url: string
          user_access_level?:
            | Database["public"]["Enums"]["user_access_level"]
            | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          meta_data?: Json | null
          name?: string
          updated_at?: string | null
          url?: string
          user_access_level?:
            | Database["public"]["Enums"]["user_access_level"]
            | null
        }
        Relationships: []
      }
      panels: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          linked_page_id: string | null
          name: string
          updated_at: string | null
          visibility_rule: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          linked_page_id?: string | null
          name: string
          updated_at?: string | null
          visibility_rule?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          linked_page_id?: string | null
          name?: string
          updated_at?: string | null
          visibility_rule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "panels_linked_page_id_fkey"
            columns: ["linked_page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          id: string
          name: string
          partnership_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          name: string
          partnership_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          id?: string
          name?: string
          partnership_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          allergies: string[] | null
          blood_type: string | null
          city: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          height: string | null
          id: string
          last_name: string
          last_physical: string | null
          legacy_display_id: string | null
          marital_status: string | null
          medical_conditions: string[] | null
          medications: string[] | null
          occupation: string | null
          phone: string | null
          preferred_language: string | null
          primary_care_physician: string | null
          primary_insurance: string | null
          secondary_insurance: string | null
          state: string | null
          updated_at: string | null
          usual_transport_mode: string | null
          weight: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          city?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          height?: string | null
          id?: string
          last_name: string
          last_physical?: string | null
          legacy_display_id?: string | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          occupation?: string | null
          phone?: string | null
          preferred_language?: string | null
          primary_care_physician?: string | null
          primary_insurance?: string | null
          secondary_insurance?: string | null
          state?: string | null
          updated_at?: string | null
          usual_transport_mode?: string | null
          weight?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          city?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          height?: string | null
          id?: string
          last_name?: string
          last_physical?: string | null
          legacy_display_id?: string | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          occupation?: string | null
          phone?: string | null
          preferred_language?: string | null
          primary_care_physician?: string | null
          primary_insurance?: string | null
          secondary_insurance?: string | null
          state?: string | null
          updated_at?: string | null
          usual_transport_mode?: string | null
          weight?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      payer_database: {
        Row: {
          carrier_name: string
          carrier_type: string
          confidence: number
          created_at: string | null
          id: string
          last_verified: string | null
          payer_id: string
          policy_type: string
        }
        Insert: {
          carrier_name: string
          carrier_type: string
          confidence?: number
          created_at?: string | null
          id?: string
          last_verified?: string | null
          payer_id: string
          policy_type: string
        }
        Update: {
          carrier_name?: string
          carrier_type?: string
          confidence?: number
          created_at?: string | null
          id?: string
          last_verified?: string | null
          payer_id?: string
          policy_type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string | null
          payment_amount: number
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          reference_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          payment_amount: number
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          reference_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          payment_amount?: number
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          reference_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_types: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_path: string | null
          file_type: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      route_optimizations: {
        Row: {
          created_at: string | null
          end_location: string
          id: string
          optimization_score: number | null
          route_name: string
          start_location: string
          updated_at: string | null
          waypoints: Json | null
        }
        Insert: {
          created_at?: string | null
          end_location: string
          id?: string
          optimization_score?: number | null
          route_name: string
          start_location: string
          updated_at?: string | null
          waypoints?: Json | null
        }
        Update: {
          created_at?: string | null
          end_location?: string
          id?: string
          optimization_score?: number | null
          route_name?: string
          start_location?: string
          updated_at?: string | null
          waypoints?: Json | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string | null
          priority: string | null
          request_type: string
          requested_by: string | null
          requested_date: string | null
          service_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          priority?: string | null
          request_type: string
          requested_by?: string | null
          requested_date?: string | null
          service_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          priority?: string | null
          request_type?: string
          requested_by?: string | null
          requested_date?: string | null
          service_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_records: {
        Row: {
          checklist_completed: boolean | null
          created_at: string | null
          employee_id: string | null
          end_time: string | null
          id: string
          notes: string | null
          shift_date: string
          shift_type: string
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          checklist_completed?: boolean | null
          created_at?: string | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          shift_date: string
          shift_type: string
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          checklist_completed?: boolean | null
          created_at?: string | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          shift_date?: string
          shift_type?: string
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_records: {
        Row: {
          actual_arrival: string | null
          ai_recommendations: Json | null
          behavioral_illness: boolean | null
          billing_notes: string | null
          breathing_problem: boolean | null
          caller_name: string | null
          caller_phone: string | null
          completion_time: string | null
          confined_to_bed: boolean | null
          created_at: string | null
          crew_assigned: string | null
          delay_reason: string | null
          destination_address: string | null
          destination_floor_room: string | null
          destination_type: string | null
          dispatch_id: string
          dispatch_status: Database["public"]["Enums"]["dispatch_status"] | null
          dispatcher_notes: string | null
          dnr_order: boolean | null
          dropoff_location: string
          dropoff_type: string | null
          estimated_arrival: string | null
          fresh_prepared: boolean | null
          hearing_impaired: boolean | null
          id: string
          language_barrier: boolean | null
          mileage: number | null
          notes: string | null
          origin_address: string | null
          origin_floor_room: string | null
          origin_type: string | null
          patient_id: string | null
          physically_impaired: boolean | null
          pickup_location: string
          pickup_type: string | null
          prior_auth_number: string | null
          priority_level: Database["public"]["Enums"]["priority_level"] | null
          reason_for_destination: string | null
          recurrence_day: string | null
          recurrence_end_date: string | null
          recurrence_frequency: string | null
          recurrence_times: number | null
          recurrence_type: string | null
          requires_bariatric: boolean | null
          requires_bcs: boolean | null
          requires_isolation: boolean | null
          requires_isolation_type: string | null
          requires_o2: boolean | null
          requires_ventilator: boolean | null
          return_activation_time: string | null
          return_pickup_time: string | null
          return_precise_pickup: boolean | null
          return_trip_id: string | null
          route_data: Json | null
          scheduled_time: string | null
          service_type: Database["public"]["Enums"]["service_type"] | null
          sight_impaired: boolean | null
          speech_impaired: boolean | null
          status: string
          traffic_conditions: Json | null
          transport_date: string | null
          transport_type: string | null
          trip_type: Database["public"]["Enums"]["trip_type"] | null
          unstable_impaired: boolean | null
          vehicle_number: string | null
          warnings: string[] | null
          weather_conditions: string | null
        }
        Insert: {
          actual_arrival?: string | null
          ai_recommendations?: Json | null
          behavioral_illness?: boolean | null
          billing_notes?: string | null
          breathing_problem?: boolean | null
          caller_name?: string | null
          caller_phone?: string | null
          completion_time?: string | null
          confined_to_bed?: boolean | null
          created_at?: string | null
          crew_assigned?: string | null
          delay_reason?: string | null
          destination_address?: string | null
          destination_floor_room?: string | null
          destination_type?: string | null
          dispatch_id: string
          dispatch_status?:
            | Database["public"]["Enums"]["dispatch_status"]
            | null
          dispatcher_notes?: string | null
          dnr_order?: boolean | null
          dropoff_location: string
          dropoff_type?: string | null
          estimated_arrival?: string | null
          fresh_prepared?: boolean | null
          hearing_impaired?: boolean | null
          id?: string
          language_barrier?: boolean | null
          mileage?: number | null
          notes?: string | null
          origin_address?: string | null
          origin_floor_room?: string | null
          origin_type?: string | null
          patient_id?: string | null
          physically_impaired?: boolean | null
          pickup_location: string
          pickup_type?: string | null
          prior_auth_number?: string | null
          priority_level?: Database["public"]["Enums"]["priority_level"] | null
          reason_for_destination?: string | null
          recurrence_day?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          recurrence_times?: number | null
          recurrence_type?: string | null
          requires_bariatric?: boolean | null
          requires_bcs?: boolean | null
          requires_isolation?: boolean | null
          requires_isolation_type?: string | null
          requires_o2?: boolean | null
          requires_ventilator?: boolean | null
          return_activation_time?: string | null
          return_pickup_time?: string | null
          return_precise_pickup?: boolean | null
          return_trip_id?: string | null
          route_data?: Json | null
          scheduled_time?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          sight_impaired?: boolean | null
          speech_impaired?: boolean | null
          status: string
          traffic_conditions?: Json | null
          transport_date?: string | null
          transport_type?: string | null
          trip_type?: Database["public"]["Enums"]["trip_type"] | null
          unstable_impaired?: boolean | null
          vehicle_number?: string | null
          warnings?: string[] | null
          weather_conditions?: string | null
        }
        Update: {
          actual_arrival?: string | null
          ai_recommendations?: Json | null
          behavioral_illness?: boolean | null
          billing_notes?: string | null
          breathing_problem?: boolean | null
          caller_name?: string | null
          caller_phone?: string | null
          completion_time?: string | null
          confined_to_bed?: boolean | null
          created_at?: string | null
          crew_assigned?: string | null
          delay_reason?: string | null
          destination_address?: string | null
          destination_floor_room?: string | null
          destination_type?: string | null
          dispatch_id?: string
          dispatch_status?:
            | Database["public"]["Enums"]["dispatch_status"]
            | null
          dispatcher_notes?: string | null
          dnr_order?: boolean | null
          dropoff_location?: string
          dropoff_type?: string | null
          estimated_arrival?: string | null
          fresh_prepared?: boolean | null
          hearing_impaired?: boolean | null
          id?: string
          language_barrier?: boolean | null
          mileage?: number | null
          notes?: string | null
          origin_address?: string | null
          origin_floor_room?: string | null
          origin_type?: string | null
          patient_id?: string | null
          physically_impaired?: boolean | null
          pickup_location?: string
          pickup_type?: string | null
          prior_auth_number?: string | null
          priority_level?: Database["public"]["Enums"]["priority_level"] | null
          reason_for_destination?: string | null
          recurrence_day?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?: string | null
          recurrence_times?: number | null
          recurrence_type?: string | null
          requires_bariatric?: boolean | null
          requires_bcs?: boolean | null
          requires_isolation?: boolean | null
          requires_isolation_type?: string | null
          requires_o2?: boolean | null
          requires_ventilator?: boolean | null
          return_activation_time?: string | null
          return_pickup_time?: string | null
          return_precise_pickup?: boolean | null
          return_trip_id?: string | null
          route_data?: Json | null
          scheduled_time?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          sight_impaired?: boolean | null
          speech_impaired?: boolean | null
          status?: string
          traffic_conditions?: Json | null
          transport_date?: string | null
          transport_type?: string | null
          trip_type?: Database["public"]["Enums"]["trip_type"] | null
          unstable_impaired?: boolean | null
          vehicle_number?: string | null
          warnings?: string[] | null
          weather_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_records_return_trip_id_fkey"
            columns: ["return_trip_id"]
            isOneToOne: false
            referencedRelation: "transport_records"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          dashboard_layout: Json | null
          id: string
          notification_preferences: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dashboard_layout?: Json | null
          id?: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dashboard_layout?: Json | null
          id?: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      verification_queue: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          document_type: string
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          document_type: string
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          document_type?: string
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_queue_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_logs: {
        Row: {
          created_at: string | null
          execution_details: Json | null
          id: string
          status: string
          triggered_by: string | null
          workflow_id: string | null
        }
        Insert: {
          created_at?: string | null
          execution_details?: Json | null
          id?: string
          status: string
          triggered_by?: string | null
          workflow_id?: string | null
        }
        Update: {
          created_at?: string | null
          execution_details?: Json | null
          id?: string
          status?: string
          triggered_by?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_logs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          actions: Json[]
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger_conditions: Json
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          actions: Json[]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger_conditions: Json
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json[]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_conditions?: Json
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_payer_id: {
        Args: {
          payer_id: string
        }
        Returns: Json
      }
      generate_dispatch_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_patient_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_readable_employee_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_dispatch_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      action_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "failed"
        | "cancelled"
      action_type:
        | "create"
        | "update"
        | "delete"
        | "view"
        | "approve"
        | "reject"
        | "complete"
        | "cancel"
      appointment_status: "scheduled" | "completed" | "cancelled" | "no_show"
      claim_status_type:
        | "pending"
        | "approved"
        | "rejected"
        | "in_review"
        | "appealed"
      content_status: "draft" | "published" | "archived"
      dispatch_status: "Pending" | "In Progress" | "Completed" | "Canceled"
      file_type: "document" | "image" | "pdf" | "spreadsheet" | "other"
      gender_type:
        | "male"
        | "female"
        | "non_binary"
        | "other"
        | "prefer_not_to_say"
      insurance_status: "active" | "inactive" | "pending_verification"
      invoice_status_type:
        | "paid"
        | "unpaid"
        | "overdue"
        | "cancelled"
        | "partial"
      marital_status_type:
        | "single"
        | "married"
        | "divorced"
        | "widowed"
        | "separated"
        | "other"
      notification_type:
        | "dispatch_update"
        | "crew_assignment"
        | "patient_update"
        | "billing_alert"
        | "system_alert"
      payment_method_type:
        | "credit_card"
        | "debit_card"
        | "cash"
        | "insurance"
        | "check"
        | "other"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      priority_level: "Critical" | "Emergency" | "Lower acuity" | "Scheduled"
      recurrence_type: "Disabled" | "Daily" | "Weekly" | "Monthly"
      service_type: "WC" | "BLS" | "ALS" | "MICU"
      supervisor_role:
        | "Captain"
        | "Lieutenant"
        | "Full privileges"
        | "Call-taker / Self-dispatch"
      trip_type: "One way" | "Wait-and-return" | "Round trip"
      user_access_level: "admin" | "user" | "guest"
      user_role: "admin" | "doctor" | "nurse" | "billing" | "receptionist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
