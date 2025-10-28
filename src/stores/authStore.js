import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken } from '../services/httpClient.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      initializeFromStorage: () => {
        const { token } = get();
        setAuthToken(token);
      },
      login: ({ token, user }) => {
        set({ token, user, isAuthenticated: true });
        setAuthToken(token);
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        setAuthToken(null);
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'shopease-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
