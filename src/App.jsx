import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import ShopsPage from './pages/ShopsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import useAuthStore from './stores/authStore.js';
import Header from './components/Header.jsx';

const ProtectedRoute = ({ children, requireCompletedProfile = false }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireCompletedProfile && !user?.isProfileComplete) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

const App = () => {
  const initializeFromStorage = useAuthStore((state) => state.initializeFromStorage);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute requireCompletedProfile>
                <ShopsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
