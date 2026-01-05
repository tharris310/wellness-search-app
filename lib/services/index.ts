import { mockLocationService } from './mockLocationService';
import { mockAuthService } from './mockAuthService';
// Future: import supabase implementations
// import { supabaseLocationService } from './supabaseLocationService';
// import { supabaseAuthService } from './supabaseAuthService';

const USE_MOCK =
  !process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export const locationService = USE_MOCK ? mockLocationService : mockLocationService; // Replace with supabaseLocationService when ready

export const authService = USE_MOCK ? mockAuthService : mockAuthService; // Replace with supabaseAuthService when ready

export * from './types';
