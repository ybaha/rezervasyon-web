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
      available_slots: {
        Row: {
          available_staff_count: number | null
          business_id: string
          created_at: string | null
          date: string
          id: string
          is_booked: boolean | null
          service_id: string | null
          time: string
          updated_at: string | null
        }
        Insert: {
          available_staff_count?: number | null
          business_id: string
          created_at?: string | null
          date: string
          id?: string
          is_booked?: boolean | null
          service_id?: string | null
          time: string
          updated_at?: string | null
        }
        Update: {
          available_staff_count?: number | null
          business_id?: string
          created_at?: string | null
          date?: string
          id?: string
          is_booked?: boolean | null
          service_id?: string | null
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "available_slots_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "available_slots_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          business_id: string
          close_time: string
          created_at: string | null
          day_of_week: number
          id: string
          is_closed: boolean | null
          open_time: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          close_time: string
          created_at?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          open_time: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          close_time?: string
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          open_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_payment_accounts: {
        Row: {
          business_id: string
          charges_enabled: boolean | null
          created_at: string | null
          id: string
          is_onboarded: boolean | null
          metadata: Json | null
          payout_enabled: boolean | null
          stripe_account_id: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          is_onboarded?: boolean | null
          metadata?: Json | null
          payout_enabled?: boolean | null
          stripe_account_id?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          is_onboarded?: boolean | null
          metadata?: Json | null
          payout_enabled?: boolean | null
          stripe_account_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_payment_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string
          city: string
          country: string
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          industry_id: string
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          location: string
          logo_url: string | null
          longitude: number | null
          name: string
          owner_id: string
          phone: string | null
          postal_code: string | null
          price_level: number | null
          rating: number | null
          review_count: number | null
          slug: string | null
          state: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address: string
          city: string
          country: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          industry_id: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location: string
          logo_url?: string | null
          longitude?: number | null
          name: string
          owner_id: string
          phone?: string | null
          postal_code?: string | null
          price_level?: number | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          country?: string
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          industry_id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: string
          logo_url?: string | null
          longitude?: number | null
          name?: string
          owner_id?: string
          phone?: string | null
          postal_code?: string | null
          price_level?: number | null
          rating?: number | null
          review_count?: number | null
          slug?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          business_id: string
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          payment_method: string
          payment_status: string
          reservation_id: string
          stripe_payment_id: string | null
          stripe_refund_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method: string
          payment_status: string
          reservation_id: string
          stripe_payment_id?: string | null
          stripe_refund_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string
          payment_status?: string
          reservation_id?: string
          stripe_payment_id?: string | null
          stripe_refund_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          booking_reference: string
          business_id: string
          created_at: string | null
          id: string
          notes: string | null
          reservation_date: string
          reservation_time: string
          service_id: string
          slot_id: string | null
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_reference: string
          business_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          reservation_date: string
          reservation_time: string
          service_id: string
          slot_id?: string | null
          status: string
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_reference?: string
          business_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          reservation_date?: string
          reservation_time?: string
          service_id?: string
          slot_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "available_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          rating: number
          reservation_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          rating: number
          reservation_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          rating?: number
          reservation_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          duration: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          currency: string
          description: string | null
          features: Json | null
          id: string
          interval: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          interval: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          business_id: string | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          metadata: Json | null
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id?: string | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          metadata?: Json | null
          plan_id: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          metadata?: Json | null
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          is_business_owner: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          is_business_owner?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_business_owner?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      whitelabel_domains: {
        Row: {
          business_id: string
          created_at: string | null
          custom_texts: Json | null
          domain: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          theme_settings: Json | null
          updated_at: string | null
          verification_record: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          custom_texts?: Json | null
          domain: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          theme_settings?: Json | null
          updated_at?: string | null
          verification_record?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          custom_texts?: Json | null
          domain?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          theme_settings?: Json | null
          updated_at?: string | null
          verification_record?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whitelabel_domains_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
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
