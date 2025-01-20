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
      ai_analysis_results: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          patient_id: string | null
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
      patients: {
        Row: {
          address: string | null
          allergies: string[] | null
          city: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          medical_conditions: string[] | null
          medications: string[] | null
          phone: string | null
          primary_insurance: string | null
          secondary_insurance: string | null
          state: string | null
          updated_at: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string[] | null
          city?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          phone?: string | null
          primary_insurance?: string | null
          secondary_insurance?: string | null
          state?: string | null
          updated_at?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string[] | null
          city?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          phone?: string | null
          primary_insurance?: string | null
          secondary_insurance?: string | null
          state?: string | null
          updated_at?: string | null
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
      transport_records: {
        Row: {
          created_at: string | null
          crew_assigned: string | null
          destination_address: string | null
          dispatch_id: string
          dispatch_status: Database["public"]["Enums"]["dispatch_status"] | null
          dropoff_location: string
          dropoff_type: string | null
          id: string
          notes: string | null
          origin_address: string | null
          patient_id: string | null
          pickup_location: string
          pickup_type: string | null
          recurrence_day: string | null
          recurrence_frequency: string | null
          recurrence_type: string | null
          return_trip_id: string | null
          scheduled_time: string | null
          status: string
          transport_date: string | null
          warnings: string[] | null
        }
        Insert: {
          created_at?: string | null
          crew_assigned?: string | null
          destination_address?: string | null
          dispatch_id: string
          dispatch_status?:
            | Database["public"]["Enums"]["dispatch_status"]
            | null
          dropoff_location: string
          dropoff_type?: string | null
          id?: string
          notes?: string | null
          origin_address?: string | null
          patient_id?: string | null
          pickup_location: string
          pickup_type?: string | null
          recurrence_day?: string | null
          recurrence_frequency?: string | null
          recurrence_type?: string | null
          return_trip_id?: string | null
          scheduled_time?: string | null
          status: string
          transport_date?: string | null
          warnings?: string[] | null
        }
        Update: {
          created_at?: string | null
          crew_assigned?: string | null
          destination_address?: string | null
          dispatch_id?: string
          dispatch_status?:
            | Database["public"]["Enums"]["dispatch_status"]
            | null
          dropoff_location?: string
          dropoff_type?: string | null
          id?: string
          notes?: string | null
          origin_address?: string | null
          patient_id?: string | null
          pickup_location?: string
          pickup_type?: string | null
          recurrence_day?: string | null
          recurrence_frequency?: string | null
          recurrence_type?: string | null
          return_trip_id?: string | null
          scheduled_time?: string | null
          status?: string
          transport_date?: string | null
          warnings?: string[] | null
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
      generate_patient_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      dispatch_status: "Pending" | "In Progress" | "Completed" | "Canceled"
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
