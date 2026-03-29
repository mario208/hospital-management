import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync, clearError } from '../../redux/slices/authSlice';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? '/doctor' : '/patient', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAsync(formData));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">
        Welcome back
      </h2>
      <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-6">
        Sign in to your account to continue
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400 text-sm animate-scale-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="doctor@hospital.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
