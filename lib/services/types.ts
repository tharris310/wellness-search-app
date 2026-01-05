import { WellnessLocation } from '@/stores/searchStore';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Session {
  user: User;
  accessToken: string;
  expiresAt: Date;
}

export interface LocationService {
  search(query: string, coords: { lat: number; lon: number }): Promise<WellnessLocation[]>;
  getById(id: string): Promise<WellnessLocation | null>;
  getNearby(coords: { lat: number; lon: number }, radiusMiles: number): Promise<WellnessLocation[]>;
  getCategories(): Promise<string[]>;
}

export interface AuthService {
  signIn(email: string, password: string): Promise<{ user: User; session: Session } | null>;
  signUp(
    email: string,
    password: string,
    name?: string
  ): Promise<{ user: User; session: Session } | null>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  onAuthStateChange(callback: (session: Session | null) => void): () => void;
}
