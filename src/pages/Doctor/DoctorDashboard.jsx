import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  CalendarX2,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { appointments, isLoading, error } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats.total,
      icon: ClipboardList,
      color: 'from-primary-400 to-primary-600',
      shadow: 'shadow-primary-500/20',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'from-warning-400 to-warning-500',
      shadow: 'shadow-warning-500/20',
      bg: 'bg-warning-50 dark:bg-warning-500/10',
    },
    {
      label: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle2,
      color: 'from-success-400 to-success-500',
      shadow: 'shadow-success-500/20',
      bg: 'bg-success-50 dark:bg-success-500/10',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: CalendarX2,
      color: 'from-danger-400 to-danger-500',
      shadow: 'shadow-danger-500/20',
      bg: 'bg-danger-50 dark:bg-danger-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary-800 to-secondary-900 dark:from-secondary-800 dark:to-secondary-950 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary-400 text-sm font-medium mb-2">
            <TrendingUp className="w-4 h-4" />
            Doctor Dashboard
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome, Dr. {user?.username || 'Doctor'} 👋
          </h1>
          <p className="text-secondary-300 max-w-lg">
            Manage your appointments and add patient notes from your dashboard.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className={`card p-5 ${stat.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} ${stat.shadow} shadow-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-xl">Recent Appointments</h2>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && appointments.length > 0 && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary-50 dark:bg-secondary-800/50">
                    <th className="text-left px-5 py-3 font-semibold text-secondary-600 dark:text-secondary-300">
                      Patient
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary-600 dark:text-secondary-300">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary-600 dark:text-secondary-300">
                      Time
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary-600 dark:text-secondary-300">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-secondary-600 dark:text-secondary-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700/50">
                  {appointments.map((appt) => (
                    <tr
                      key={appt._id}
                      className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                            <Users className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                          </div>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {appt.patient?.name || appt.patient || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-secondary-600 dark:text-secondary-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-secondary-400" />
                          {formatDate(appt.date)}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-secondary-600 dark:text-secondary-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-secondary-400" />
                          {formatTime(appt.date)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(appt.status)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/doctor/notes/${appt._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Add Notes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <div className="text-center py-16 card">
            <CalendarX2 className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
              No appointments yet
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm">
              Appointments will appear here when patients book with you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
