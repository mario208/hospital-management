import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDoctors } from '../../redux/slices/doctorSlice';
import {
  Stethoscope,
  Star,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useState } from 'react';

const PatientHome = () => {
  const dispatch = useDispatch();
  const { doctors, isLoading, error } = useSelector((state) => state.doctors);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.username || 'Patient'} 👋
          </h1>
          <p className="text-primary-100 max-w-lg">
            Browse our available doctors and book your next appointment with ease.
            Your health is our priority.
          </p>
          <Link
            to="/patient/book"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors duration-200"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="section-title">Available Doctors</h2>
          <p className="section-subtitle">Find the right specialist for your needs</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            id="search-doctors"
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Doctors Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="card p-6 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
                <span className={doctor.available ? 'badge-available' : 'badge-unavailable'}>
                  {doctor.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2.5 mb-5">
                <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-300">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>{doctor.experienceYears} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-300">
                  <Phone className="w-4 h-4 text-secondary-400" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-300">
                  <Mail className="w-4 h-4 text-secondary-400" />
                  <span className="truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  <DollarSign className="w-4 h-4" />
                  <span>{doctor.price} EGP / visit</span>
                </div>
              </div>

              {/* Action */}
              {doctor.available && (
                <Link
                  to={`/patient/book?doctor=${doctor._id}`}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredDoctors.length === 0 && (
        <div className="text-center py-20">
          <Stethoscope className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
            No doctors found
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'No doctors are currently registered'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientHome;
