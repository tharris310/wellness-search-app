import { create } from 'zustand';

export interface WellnessLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  rating?: number;
  address?: string;
}

interface SearchState {
  query: string;
  results: WellnessLocation[];
  isLoading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  setResults: (results: WellnessLocation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
