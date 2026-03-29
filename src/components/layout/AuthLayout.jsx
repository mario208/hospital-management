import { Outlet } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { Heart } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 px-4 py-8">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-400/10 dark:bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-xl shadow-primary-500/25 mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Medi<span className="text-primary-600">Care</span>
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">
            Hospital Management System
          </p>
        </div>

        {/* Auth card */}
        <div className="glass-card p-8 animate-slide-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
