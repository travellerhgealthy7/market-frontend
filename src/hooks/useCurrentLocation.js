import { useEffect, useState } from 'react';

const DEFAULT_LOCATION = {
  lat: 27.7172, // Kathmandu
  lng: 85.324,
};

const useCurrentLocation = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator?.geolocation) {
      setIsLoading(false);
      setError('Geolocation not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (geoError) => {
        setIsLoading(false);
        setError(geoError.message ?? 'Failed to fetch your location. Showing popular shops nearby.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, isLoading, error };
};

export default useCurrentLocation;
