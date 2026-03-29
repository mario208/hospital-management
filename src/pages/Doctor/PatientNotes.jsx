import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editAppointment } from '../../redux/slices/appointmentSlice';
import { authApiRequest } from '../../utils/apiClient';
import {
  ArrowLeft,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  User,
  Stethoscope,
} from 'lucide-react';

const PatientNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [appointment, setAppointment] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setIsLoading(true);
        // We'll get all appointments and filter by ID since there's no GET /:id endpoint
        const data = await authApiRequest('/appointments');
        const appts = data.appointments || data;
        const found = appts.find((a) => a._id === id);
        if (found) {
          setAppointment(found);
          setNotes(found.notes || '');
        } else {
          setError('Appointment not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await dispatch(editAppointment({ id, data: { notes } })).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => navigate('/doctor')}
          className="mt-4 btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/doctor')}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
        </button>
        <div>
          <h1 className="section-title">Patient Notes</h1>
          <p className="section-subtitle">Add notes for this appointment</p>
        </div>
      </div>

      {/* Appointment Info Card */}
      {appointment && (
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
            Appointment Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center">
                <User className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Patient</p>
                <p className="font-semibold text-secondary-900 dark:text-white">
                  {appointment.patient?.name || appointment.patient || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Doctor</p>
                <p className="font-semibold text-secondary-900 dark:text-white">
                  Dr. {appointment.doctor?.name || appointment.doctor || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Date</p>
                <p className="font-semibold text-secondary-900 dark:text-white">
                  {formatDate(appointment.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Time</p>
                <p className="font-semibold text-secondary-900 dark:text-white">
                  {formatTime(appointment.date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Form */}
      <form onSubmit={handleSave} className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
            Clinical Notes
          </h3>
        </div>

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/20 text-success-600 dark:text-success-400 text-sm animate-scale-in">
            <CheckCircle2 className="w-4 h-4" />
            Notes saved successfully!
          </div>
        )}

        {error && appointment && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400 text-sm animate-scale-in">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <textarea
          id="patient-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          className="input-field resize-none"
          placeholder="Enter diagnosis, prescription, or clinical observations..."
        />

        <button
          id="save-notes-btn"
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Notes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PatientNotes;
