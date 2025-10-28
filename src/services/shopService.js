import httpClient from './httpClient.js';

export const fetchNearbyShops = async ({ lat, lng, radius = 5 }) => {
  const response = await httpClient.get('/shops/nearby', {
    params: { lat, lng, radius },
  });
  return response.data.shops ?? [];
};

export const registerShop = async (payload) => {
  const response = await httpClient.post('/shops/register', payload);
  return response.data.shop;
};
