// Supabase Database Schema Types for IQOO NavX
// Derived from live Supabase schema inspection

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface SavedPlaceRow {
  id: string;
  user_id: string;
  name: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface SavedPlaceInsert {
  id?: string;
  user_id?: string;
  name: string;
  latitude: number;
  longitude: number;
  created_at?: string;
}

export interface SavedPlaceUpdate {
  id?: string;
  user_id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface NavigationPreferencesRow {
  id: string;
  user_id: string;
  voice_enabled: boolean;
  dark_mode: boolean;
  created_at: string;
}

export interface NavigationPreferencesInsert {
  id?: string;
  user_id?: string;
  voice_enabled?: boolean;
  dark_mode?: boolean;
  created_at?: string;
}

export interface NavigationPreferencesUpdate {
  id?: string;
  user_id?: string;
  voice_enabled?: boolean;
  dark_mode?: boolean;
  created_at?: string;
}

export interface RecentRouteRow {
  id: string;
  user_id: string;
  destination_name: string;
  distance: number;
  duration: number;
  created_at: string;
}

export interface RecentRouteInsert {
  id?: string;
  user_id?: string;
  destination_name: string;
  distance: number;
  duration: number;
  created_at?: string;
}

export interface RecentRouteUpdate {
  id?: string;
  user_id?: string;
  destination_name?: string;
  distance?: number;
  duration?: number;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      saved_places: {
        Row: SavedPlaceRow;
        Insert: SavedPlaceInsert;
        Update: SavedPlaceUpdate;
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      navigation_preferences: {
        Row: NavigationPreferencesRow;
        Insert: NavigationPreferencesInsert;
        Update: NavigationPreferencesUpdate;
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      recent_routes: {
        Row: RecentRouteRow;
        Insert: RecentRouteInsert;
        Update: RecentRouteUpdate;
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
