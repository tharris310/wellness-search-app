import { LocationService } from './types';
import { MOCK_LOCATIONS, CATEGORIES } from '../data/mockLocations';

function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const mockLocationService: LocationService = {
  search: async (query, coords) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 300));

    const q = query.toLowerCase().trim();

    // Return all if empty query
    if (!q) {
      return MOCK_LOCATIONS;
    }

    return MOCK_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.category.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q)
    );
  },

  getById: async (id) => {
    await new Promise((r) => setTimeout(r, 100));
    return MOCK_LOCATIONS.find((loc) => loc.id === id) ?? null;
  },

  getNearby: async (coords, radiusMiles) => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_LOCATIONS.filter(
      (loc) => getDistanceMiles(coords.lat, coords.lon, loc.latitude, loc.longitude) <= radiusMiles
    ).sort(
      (a, b) =>
        getDistanceMiles(coords.lat, coords.lon, a.latitude, a.longitude) -
        getDistanceMiles(coords.lat, coords.lon, b.latitude, b.longitude)
    );
  },

  getCategories: async () => {
    await new Promise((r) => setTimeout(r, 100));
    return CATEGORIES;
  },
};
