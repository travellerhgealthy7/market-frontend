import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
};

const defaultOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const MapView = ({ center, shops, onMarkerClick }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const markers = useMemo(
    () =>
      shops.map((shop) => ({
        id: shop._id ?? shop.id,
        position: {
          lat: shop.location?.coordinates?.[1] ?? center.lat,
          lng: shop.location?.coordinates?.[0] ?? center.lng,
        },
        title: shop.name,
      })),
    [shops, center]
  );

  if (loadError) {
    return (
      <div className="grid h-[400px] place-items-center rounded-xl bg-white shadow-card">
        <p className="text-sm text-red-500">Failed to load the map. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="grid h-[400px] place-items-center rounded-xl bg-white shadow-card">
        <span className="text-sm text-slate-500">Loading map…</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      options={defaultOptions}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          title={marker.title}
          onClick={() => onMarkerClick?.(shops.find((shop) => (shop._id ?? shop.id) === marker.id))}
        />
      ))}
      <Marker position={center} icon={{ url: '/assets/location-pin.svg' }} />
    </GoogleMap>
  );
};

export default MapView;
