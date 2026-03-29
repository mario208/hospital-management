import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerAsync, clearError } from '../../redux/slices/authSlice';
import { Mail, Lock, User, ArrowRight, Loader2, Stethoscope, Phone, MapPin, Calendar, Activity, GraduationCap, DollarSign } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false,
    // Patient fields
    age: '',
    gender: 'Male',
    address: '',
    // Shared / Doctor fields
    phone: '',
    specialty: '',
    experienceYears: '',
    price: 250,
    available: true,
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
    
    // Cleanse data based on role
    let submissionData = { ...formData };
    
    if (formData.isAdmin) {
      // Doctor: remove patient-only fields
      delete submissionData.age;
      delete submissionData.gender;
      delete submissionData.address;
    } else {
      // Patient: remove doctor-only fields
      delete submissionData.specialty;
      delete submissionData.experienceYears;
      delete submissionData.price;
      delete submissionData.available;
    }
    
    dispatch(registerAsync(submissionData));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">
        Create Account
      </h2>
      <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-6">
        Register as a doctor or patient
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400 text-sm animate-scale-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Toggle */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            I am registering as
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isAdmin: false })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                !formData.isAdmin
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'border-secondary-200 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-500'
              }`}
            >
              <User className="w-4 h-4" />
              Patient
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isAdmin: true })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                formData.isAdmin
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'border-secondary-200 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-500'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Doctor
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="register-username" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              id="register-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="John Doe"
              required
              minLength={2}
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              id="register-password"
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

        {/* Dynamic Doctor Fields */}
        {formData.isAdmin && (
          <div className="space-y-4 animate-slide-down border-t border-secondary-200 dark:border-secondary-700/50 pt-4 mt-2">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white pb-1">Doctor Professional Profile</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                Specialty
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="e.g. Cardiology, Pediatrics"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Experience (Years)
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="e.g. 5"
                    required
                    min={1}
                    max={50}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Consultation Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="250"
                    required
                    min={0}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="01xxxxxxxxx"
                  required
                  minLength={10}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Patient Fields */}
        {!formData.isAdmin && (
          <div className="space-y-4 animate-slide-down border-t border-secondary-200 dark:border-secondary-700/50 pt-4 mt-2">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white pb-1">Patient Profile</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="e.g. 25"
                    required
                    min={1}
                    max={100}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Gender
                </label>
                <div className="relative">
                  <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field pl-10 appearance-none bg-white dark:bg-secondary-900 cursor-pointer"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="01xxxxxxxxx"
                  required
                  minLength={10}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Street name, City"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
            </div>
          </div>
        )}

        <button
          id="register-submit-btn"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
