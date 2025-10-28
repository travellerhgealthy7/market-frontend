import { create } from 'zustand';
import { fetchNearbyShops } from '../services/shopService.js';

const useShopStore = create((set, get) => ({
  shops: [],
  isLoading: false,
  error: '',
  location: null,
  setLocation: (location) => set({ location }),
  fetchShops: async ({ lat, lng, radius }) => {
    try {
      set({ isLoading: true, error: '' });
      const shops = await fetchNearbyShops({ lat, lng, radius });
      set({ shops });
    } catch (err) {
      set({ error: err.response?.data?.message ?? 'Failed to load shops' });
    } finally {
      set({ isLoading: false });
    }
  },
  clear: () => set({ shops: [], error: '' }),
}));

export default useShopStore;
