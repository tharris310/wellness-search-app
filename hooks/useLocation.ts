import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_REGION } from '@/lib/constants';

interface LocationState {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>(DEFAULT_REGION);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function getCurrentLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});

        if (isMounted) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to get current location');
          setIsLoading(false);
        }
      }
    }

    getCurrentLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, error, isLoading };
}
