import { useEffect } from 'react';

const ShopCard = ({ shop, onVisible }) => {
  useEffect(() => {
    if (onVisible) {
      onVisible();
    }
  }, [onVisible]);

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lg">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{shop.name}</h3>
          <p className="text-sm text-slate-500">{shop.location?.address ?? 'Address not available'}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600">
          {shop.distanceInMeters ? `${(shop.distanceInMeters / 1000).toFixed(1)} km` : 'Nearby'}
        </span>
      </header>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          {shop.ratings?.average ? `${shop.ratings.average.toFixed(1)} (${shop.ratings.count})` : 'New shop'}
        </span>
        <span>{shop.shopType?.toUpperCase()}</span>
      </div>
      {shop.deliveryEnabled ? (
        <span className="text-sm text-green-600">Delivery available within {shop.deliveryRadius} km</span>
      ) : (
        <span className="text-sm text-slate-500">Visit in-store for trials and pickups</span>
      )}
    </article>
  );
};

export default ShopCard;
