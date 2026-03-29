import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';
import {
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  Loader2,
  AlertCircle,
  CalendarX2,
} from 'lucide-react';

const AppointmentsList = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading, error } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge-confirmed">Confirmed</span>;
      case 'cancelled':
        return <span className="badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge-pending">Pending</span>;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter only this user's appointments (patient flow)
  const myAppointments = appointments;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">My Appointments</h1>
        <p className="section-subtitle">View and track your appointment history</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Appointments List */}
      {!isLoading && !error && myAppointments.length > 0 && (
        <div className="space-y-4">
          {myAppointments.map((appt) => (
            <div
              key={appt._id}
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-slide-up"
            >
              {/* Date Badge */}
              <div className="flex items-center gap-4 sm:w-48 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-secondary-900 dark:text-white">
                    {formatDate(appt.date)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                    <Clock className="w-3 h-3" />
                    {formatTime(appt.date)}
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Stethoscope className="w-4 h-4 text-primary-500" />
                  <p className="font-semibold text-secondary-900 dark:text-white truncate">
                    Dr. {appt.doctor?.name || appt.doctor || 'N/A'}
                  </p>
                </div>
                {appt.notes && (
                  <div className="flex items-start gap-2 mt-1">
                    <FileText className="w-4 h-4 text-secondary-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 line-clamp-2">
                      {appt.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="sm:ml-auto shrink-0">
                {getStatusBadge(appt.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && myAppointments.length === 0 && (
        <div className="text-center py-20">
          <CalendarX2 className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
            No appointments yet
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-4">
            You haven&apos;t booked any appointments. Browse available doctors to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
