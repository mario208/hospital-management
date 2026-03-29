import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import ThemeToggle from '../ThemeToggle';
import {
  Heart,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Calendar,
  Home,
  ClipboardList,
} from 'lucide-react';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
        : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-white'
    }`;

  const getNavLinks = () => {
    if (!user) return [];

    if (user.isAdmin) {
      return [
        { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
        { path: '/doctor/records', label: 'Medical Records', icon: ClipboardList },
      ];
    }

    return [
      { path: '/patient', label: 'Home', icon: Home },
      { path: '/patient/appointments', label: 'My Appointments', icon: Calendar },
      { path: '/patient/book', label: 'Book Appointment', icon: Calendar },
      { path: '/patient/records', label: 'Medical Records', icon: ClipboardList },
    ];
  };

  const links = getNavLinks();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-xl border-b border-secondary-200/50 dark:border-secondary-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={user ? (user.isAdmin ? '/doctor' : '/patient') : '/login'}
            className="flex items-center gap-2.5 group"
          >
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow duration-300">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-secondary-900 dark:text-white">
              Medi<span className="text-primary-600">Care</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary-50 dark:bg-secondary-800">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-secondary-900 dark:text-white leading-tight">
                      {user.username}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-tight">
                      {user.isAdmin ? 'Doctor' : 'Patient'}
                    </p>
                  </div>
                </div>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-secondary-500 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-secondary-200 dark:border-secondary-700 animate-slide-down bg-white dark:bg-secondary-900">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={navLinkClass(link.path)}
                onClick={() => setIsMobileOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="border-t border-secondary-200 dark:border-secondary-700 my-2 pt-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-secondary-900 dark:text-white">
                        {user.username}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {user.isAdmin ? 'Doctor' : 'Patient'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="border-t border-secondary-200 dark:border-secondary-700 my-2 pt-2 space-y-2">
                <Link
                  to="/login"
                  className="block btn-secondary text-sm text-center"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block btn-primary text-sm text-center"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
