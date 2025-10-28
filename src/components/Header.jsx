import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    logout: state.logout,
  }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-semibold text-white">
            SE
          </span>
          <span className="text-xl font-semibold tracking-tight text-slate-900">ShopEase</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                {user?.mobile ?? 'Logged in'}
              </span>
              {!user?.isProfileComplete && (
                <Link to="/profile" className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Complete profile
                </Link>
              )}
              {location.pathname !== '/' && (
                <Link to="/" className="hover:text-brand-600">
                  Discover Shops
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white shadow-card transition hover:bg-brand-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white shadow-card transition hover:bg-brand-600"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
