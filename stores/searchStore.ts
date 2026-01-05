import { create } from 'zustand';
import { locationService } from '@/lib/services';

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
  categories: string[];
  isLoading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  search: (coords: { lat: number; lon: number }) => Promise<void>;
  searchNearby: (coords: { lat: number; lon: number }, radiusMiles: number) => Promise<void>;
  loadCategories: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  query: '',
  results: [],
  categories: [],
  isLoading: false,
  error: null,
};

export const useSearchStore = create<SearchState>((set, get) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  search: async (coords) => {
    const { query } = get();
    set({ isLoading: true, error: null });
    try {
      const results = await locationService.search(query, coords);
      set({ results });
    } catch {
      set({ error: 'Failed to search locations' });
    } finally {
      set({ isLoading: false });
    }
  },

  searchNearby: async (coords, radiusMiles) => {
    set({ isLoading: true, error: null });
    try {
      const results = await locationService.getNearby(coords, radiusMiles);
      set({ results });
    } catch {
      set({ error: 'Failed to fetch nearby locations' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadCategories: async () => {
    try {
      const categories = await locationService.getCategories();
      set({ categories });
    } catch {
      // Silently fail - categories are not critical
    }
  },

  reset: () => set(initialState),
}));
