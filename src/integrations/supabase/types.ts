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
      insurance_records: {
        Row: {
          activation_date: string | null
          carrier_name: string
          carrier_type: string
          claims_zip: string | null
          created_at: string | null
          id: string
          patient_id: string | null
          phone: string | null
          policy_number: string
          type: string
          updated_at: string | null
        }
        Insert: {
          activation_date?: string | null
          carrier_name: string
          carrier_type: string
          claims_zip?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          phone?: string | null
          policy_number: string
          type: string
          updated_at?: string | null
        }
        Update: {
          activation_date?: string | null
          carrier_name?: string
          carrier_type?: string
          claims_zip?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          phone?: string | null
          policy_number?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_records_patient_id_fkey"
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
      [_ in never]: never
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
