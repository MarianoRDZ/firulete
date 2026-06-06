export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
        };
      };
      pets_reports: {
        Row: {
          id: string;
          user_id: string;
          type: 'lost' | 'found' | 'adoption';
          species: 'dog' | 'cat' | 'other';
          breed: string | null;
          colors: string[];
          size: 'small' | 'medium' | 'large' | null;
          name: string | null;
          description: string | null;
          last_seen_at: string | null;
          location: unknown;
          is_anonymous: boolean;
          status: 'active' | 'resolved';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'lost' | 'found' | 'adoption';
          species: 'dog' | 'cat' | 'other';
          breed?: string | null;
          colors?: string[];
          size?: 'small' | 'medium' | 'large' | null;
          name?: string | null;
          description?: string | null;
          last_seen_at?: string | null;
          location: unknown;
          is_anonymous?: boolean;
          status?: 'active' | 'resolved';
        };
        Update: {
          type?: 'lost' | 'found' | 'adoption';
          species?: 'dog' | 'cat' | 'other';
          breed?: string | null;
          colors?: string[];
          size?: 'small' | 'medium' | 'large' | null;
          name?: string | null;
          description?: string | null;
          last_seen_at?: string | null;
          location?: unknown;
          is_anonymous?: boolean;
          status?: 'active' | 'resolved';
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
