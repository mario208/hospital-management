import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchDoctors } from '../../redux/slices/doctorSlice';
import { bookAppointment } from '../../redux/slices/appointmentSlice';
import {
  Calendar,
  Stethoscope,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get('doctor');

  const [formData, setFormData] = useState({
    doctor: preselectedDoctor || '',
    patient: '',
    date: '',
    notes: '',
  });
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, isLoading: loadingDoctors } = useSelector((state) => state.doctors);
  const { isLoading: loadingBooking, error } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (preselectedDoctor) {
      setFormData((prev) => ({ ...prev, doctor: preselectedDoctor }));
    }
  }, [preselectedDoctor]);

  const availableDoctors = doctors.filter((d) => d.available);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    const appointmentData = {
      doctor: formData.doctor,
      patient: formData.patient || user?._id,
      date: new Date(formData.date).toISOString(),
      notes: formData.notes,
    };

    try {
      await dispatch(bookAppointment(appointmentData)).unwrap();
      setSuccess(true);
      setFormData({ doctor: '', patient: '', date: '', notes: '' });
    } catch {
      // error handled by Redux
    }
  };

  const selectedDoctor = doctors.find((d) => d._id === formData.doctor);

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-success-50 dark:bg-success-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-success-500" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Appointment Booked!
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mb-6">
          Your appointment has been successfully booked. You will receive a confirmation shortly.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/patient/appointments')}
            className="btn-primary"
          >
            View Appointments
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({ doctor: '', patient: '', date: '', notes: '' });
            }}
            className="btn-secondary"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
        </button>
        <div>
          <h1 className="section-title">Book an Appointment</h1>
          <p className="section-subtitle">Choose a doctor and select your preferred date</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400 animate-scale-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Doctor Select */}
        <div>
          <label htmlFor="booking-doctor" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Select Doctor
          </label>
          <div className="relative">
            <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <select
              id="booking-doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="input-field pl-10 appearance-none cursor-pointer"
              required
            >
              <option value="">Choose a doctor...</option>
              {availableDoctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.name} — {doc.specialty} ({doc.price} EGP)
                </option>
              ))}
            </select>
          </div>
          {loadingDoctors && (
            <p className="mt-1 text-xs text-secondary-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading doctors...
            </p>
          )}
        </div>

        {/* Selected Doctor Card */}
        {selectedDoctor && (
          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-secondary-900 dark:text-white">
                  Dr. {selectedDoctor.name}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {selectedDoctor.specialty} · {selectedDoctor.experienceYears} yrs exp · {selectedDoctor.price} EGP
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Patient ID (hidden for patient, they book for themselves) */}
        <input type="hidden" name="patient" value={user?._id || ''} />

        {/* Date */}
        <div>
          <label htmlFor="booking-date" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Appointment Date & Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              id="booking-date"
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field pl-10"
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="booking-notes" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
            Notes <span className="text-secondary-400">(optional)</span>
          </label>
          <textarea
            id="booking-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Describe your symptoms or reason for visit..."
          />
        </div>

        {/* Submit */}
        <button
          id="booking-submit-btn"
          type="submit"
          disabled={loadingBooking}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingBooking ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              Confirm Booking
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
