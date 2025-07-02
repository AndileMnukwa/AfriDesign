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
      invoices: {
        Row: {
          business_info: Json
          client_info: Json
          created_at: string
          id: string
          invoice_number: string
          items: Json
          notes: string | null
          total: number
          user_id: string
        }
        Insert: {
          business_info: Json
          client_info: Json
          created_at?: string
          id?: string
          invoice_number: string
          items: Json
          notes?: string | null
          total: number
          user_id: string
        }
        Update: {
          business_info?: Json
          client_info?: Json
          created_at?: string
          id?: string
          invoice_number?: string
          items?: Json
          notes?: string | null
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      poster_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          poster_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          poster_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          poster_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poster_analytics_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "posters"
            referencedColumns: ["id"]
          },
        ]
      }
      posters: {
        Row: {
          brand_personality: string | null
          business_name: string
          content: Json | null
          created_at: string
          cultural_context: string | null
          custom_images: Json | null
          description: string
          export_formats: string[] | null
          id: string
          industry: string | null
          language: string | null
          performance_score: number | null
          phone_number: string | null
          slogan: string
          social_shares: number | null
          target_audience: string | null
          theme: string | null
          title: string
          tone: string | null
          user_id: string
          visual_settings: Json | null
        }
        Insert: {
          brand_personality?: string | null
          business_name: string
          content?: Json | null
          created_at?: string
          cultural_context?: string | null
          custom_images?: Json | null
          description: string
          export_formats?: string[] | null
          id?: string
          industry?: string | null
          language?: string | null
          performance_score?: number | null
          phone_number?: string | null
          slogan: string
          social_shares?: number | null
          target_audience?: string | null
          theme?: string | null
          title: string
          tone?: string | null
          user_id: string
          visual_settings?: Json | null
        }
        Update: {
          brand_personality?: string | null
          business_name?: string
          content?: Json | null
          created_at?: string
          cultural_context?: string | null
          custom_images?: Json | null
          description?: string
          export_formats?: string[] | null
          id?: string
          industry?: string | null
          language?: string | null
          performance_score?: number | null
          phone_number?: string | null
          slogan?: string
          social_shares?: number | null
          target_audience?: string | null
          theme?: string | null
          title?: string
          tone?: string | null
          user_id?: string
          visual_settings?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          brand_personality: string | null
          business_name: string | null
          created_at: string
          cultural_context: string | null
          full_name: string | null
          id: string
          industry: string | null
          preferred_language: string | null
          subscription_tier: string | null
          target_audience: string | null
          user_id: string
        }
        Insert: {
          brand_personality?: string | null
          business_name?: string | null
          created_at?: string
          cultural_context?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          preferred_language?: string | null
          subscription_tier?: string | null
          target_audience?: string | null
          user_id: string
        }
        Update: {
          brand_personality?: string | null
          business_name?: string | null
          created_at?: string
          cultural_context?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          preferred_language?: string | null
          subscription_tier?: string | null
          target_audience?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          monthly_invoices_used: number | null
          monthly_posters_used: number | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          usage_reset_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          monthly_invoices_used?: number | null
          monthly_posters_used?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_reset_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          monthly_invoices_used?: number | null
          monthly_posters_used?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_reset_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string | null
          features: Json
          id: string
          limits: Json
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          currency?: string | null
          features: Json
          id?: string
          limits: Json
          name: string
          price: number
        }
        Update: {
          created_at?: string
          currency?: string | null
          features?: Json
          id?: string
          limits?: Json
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string | null
          started_at: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
