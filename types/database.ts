// Generated types from Supabase
// Run: npx supabase gen types typescript --project-id <project-id> > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Add your table types here after generating from Supabase
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
