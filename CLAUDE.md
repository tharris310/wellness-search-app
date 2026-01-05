# Wellness Search App - Claude Code Instructions

Project-specific instructions for this Expo React Native application.

---

## Tech Stack

| Layer      | Technology                                                  |
|------------|-------------------------------------------------------------|
| Framework  | Expo SDK 54 (Managed Workflow)                              |
| Navigation | Expo Router 6.x                                             |
| State      | Zustand 5.x                                                 |
| Maps       | react-native-maps 1.20.x (not expo-maps - requires iOS 17+) |
| Backend    | Supabase                                                    |
| Language   | TypeScript                                                  |

---

## Project Structure

```
wellness-search-app/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/             # Tab navigator group
│   ├── (auth)/             # Auth flow screens
│   ├── _layout.tsx         # Root layout
│   └── index.tsx           # Entry point
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI primitives
│   └── map/                # Map-related components
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand state stores
├── lib/                    # Utilities and configurations
│   ├── supabase.ts         # Supabase client
│   └── constants.ts        # App constants
├── types/                  # TypeScript type definitions
└── assets/                 # Static assets (images, fonts)
```

---

## Code Conventions

### Expo Router 4.x

- Use file-based routing in `app/` directory
- Group routes with parentheses: `(tabs)`, `(auth)`, `(modal)`
- Use `_layout.tsx` for nested layouts
- Prefer `<Link>` component over `router.push()` for navigation
- Use typed routes with `href` prop

```typescript
// Correct
import { Link } from 'expo-router';
<Link href="/search">Go to Search</Link>

// For programmatic navigation
import { router } from 'expo-router';
router.push('/details/[id]', { id: '123' });
```

### Zustand 5.x

- One store per domain/feature
- Use slices pattern for complex stores
- Prefer selectors for derived state
- Keep stores in `stores/` directory

```typescript
// stores/searchStore.ts
import { create } from 'zustand';

interface SearchState {
  query: string;
  results: WellnessLocation[];
  isLoading: boolean;
  setQuery: (query: string) => void;
  search: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isLoading: false,
  setQuery: (query) => set({ query }),
  search: async () => {
    set({ isLoading: true });
    // ... search logic
    set({ results, isLoading: false });
  },
}));

// Usage with selector (prevents unnecessary re-renders)
const query = useSearchStore((state) => state.query);
```

### react-native-maps 1.20.x

- Import from `react-native-maps` (not expo-maps)
- Always provide `initialRegion` or `region` prop
- Use `Marker` and `Callout` for location pins
- Handle permissions with `expo-location`

```typescript
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import * as Location from 'expo-location';

// Request permissions
const { status } = await Location.requestForegroundPermissionsAsync();

// Map component
<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  showsUserLocation
  showsMyLocationButton
>
  <Marker coordinate={{ latitude, longitude }}>
    <Callout>
      <Text>{location.name}</Text>
    </Callout>
  </Marker>
</MapView>
```

### Supabase

- Initialize client in `lib/supabase.ts`
- Use React Query or custom hooks for data fetching
- Handle auth state with Supabase Auth
- Use Row Level Security (RLS) for data protection

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

---

## Component Guidelines

### Functional Components Only

```typescript
// Correct
export function SearchBar({ onSearch }: SearchBarProps) {
  return <View>...</View>;
}

// Also acceptable
export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return <View>...</View>;
};
```

### Props Interface Naming

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
```

### Error Boundaries

Wrap screens with error boundaries for graceful error handling:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <SearchScreen />
</ErrorBoundary>
```

---

## Environment Variables

Use Expo's environment variable system:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

Access in code:
```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
```

---

## Testing

- Use Jest + React Native Testing Library
- Test files: `*.test.tsx` or `__tests__/` directory
- Mock Supabase client for unit tests
- Use Maestro for E2E testing (optional)

```typescript
// components/__tests__/SearchBar.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('calls onSearch when submitted', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={onSearch} placeholder="Search..." />
    );

    fireEvent.changeText(getByPlaceholderText('Search...'), 'yoga');
    fireEvent.submitEditing(getByPlaceholderText('Search...'));

    expect(onSearch).toHaveBeenCalledWith('yoga');
  });
});
```

---

## Common Commands

```bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Install dependencies
npx expo install <package-name>

# Generate Supabase types
npx supabase gen types typescript --project-id <project-id> > types/database.ts

# Prebuild native projects (if needed)
npx expo prebuild

# Run tests
npm test
```

---

## Gotchas & Tips

1. **react-native-maps vs expo-maps**: We use `react-native-maps` because `expo-maps` requires iOS 17+. This is intentional.

2. **Expo Router Typed Routes**: Generate types with `npx expo customize tsconfig.json` and enable `typed routes`.

3. **Supabase Realtime**: For real-time features, use Supabase subscriptions:
   ```typescript
   const subscription = supabase
     .channel('locations')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, handler)
     .subscribe();
   ```

4. **Map Performance**: Use `tracksViewChanges={false}` on Markers for better performance with many pins.

5. **Zustand Persistence**: For persisted state, use zustand/middleware:
   ```typescript
   import { persist, createJSONStorage } from 'zustand/middleware';
   import AsyncStorage from '@react-native-async-storage/async-storage';

   create(persist(storeConfig, {
     name: 'search-storage',
     storage: createJSONStorage(() => AsyncStorage),
   }));
   ```

6. **Deep Linking**: Configure in `app.json` under `expo.scheme` for universal links.

---

## MCP Server Usage

For this project, prefer these MCP tools:

| Task | Tool |
|------|------|
| Expo/React Native docs | Context7 with library lookup |
| Database queries | Postgres MCP |
| Complex state design | Sequential Thinking |
| E2E testing flows | Playwright (web) or manual testing (native) |
