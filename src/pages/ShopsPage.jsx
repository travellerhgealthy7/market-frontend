import { useEffect, useMemo } from 'react';
import MapView from '../components/shops/MapView.jsx';
import ShopCard from '../components/shops/ShopCard.jsx';
import useCurrentLocation from '../hooks/useCurrentLocation.js';
import useShopStore from '../stores/shopStore.js';
import { logInteraction } from '../services/interactionService.js';

const ShopsPage = () => {
  const { location, isLoading: isLocating, error: locationError } = useCurrentLocation();
  const { shops, isLoading, error, fetchShops, setLocation } = useShopStore((state) => ({
    shops: state.shops,
    isLoading: state.isLoading,
    error: state.error,
    fetchShops: state.fetchShops,
    setLocation: state.setLocation,
  }));

  useEffect(() => {
    if (location) {
      setLocation(location);
      fetchShops({ lat: location.lat, lng: location.lng, radius: 8 });
    }
  }, [location, setLocation, fetchShops]);

  const heroCopy = useMemo(() => {
    if (isLocating) {
      return 'Let’s locate nearby pasals for you…';
    }
    if (locationError) {
      return 'Showing popular pasals around Kathmandu. Enable location for hyper-local picks.';
    }
    return 'Curated pasals around you with try-on, delivery, and home haul options.';
  }, [isLocating, locationError]);

  return (
    <section className="flex flex-1 flex-col gap-8 py-8">
      <div className="grid gap-4">
        <div className="inline-flex max-w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
          Nearest experiences
        </div>
        <div className="grid gap-2">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Discover pasals tailored to you</h1>
          <p className="max-w-2xl text-sm text-slate-500 sm:text-base">{heroCopy}</p>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          {isLoading ? (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 w-full animate-pulse rounded-xl bg-slate-200"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : shops.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-card">
              No pasals found within 8 km. Try widening your radius or exploring recommendations.
            </div>
          ) : (
            <div className="grid gap-4">
              {shops.map((shop) => (
                <ShopCard
                  key={shop._id ?? shop.id}
                  shop={shop}
                  onVisible={() =>
                    logInteraction({
                      eventType: 'shop.view',
                      metadata: { shopId: shop._id ?? shop.id, source: 'web:list' },
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
        <div className="order-1 lg:order-2">
          <MapView
            center={location}
            shops={shops}
            onMarkerClick={(shop) =>
              logInteraction({
                eventType: 'shop.marker_click',
                metadata: { shopId: shop._id ?? shop.id, source: 'web:map' },
              })
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ShopsPage;
