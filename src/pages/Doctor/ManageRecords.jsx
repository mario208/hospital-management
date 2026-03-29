import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicalRecords, addMedicalRecord } from '../../redux/slices/medicalRecordSlice';
import { fetchPatients } from '../../redux/slices/patientSlice';
import { fetchDoctors } from '../../redux/slices/doctorSlice';
import {
  FileText,
  User,
  Stethoscope,
  Calendar,
  Loader2,
  AlertCircle,
  Plus,
  CheckCircle2,
} from 'lucide-react';

const ManageRecords = () => {
  const dispatch = useDispatch();
  const { records, isLoading, error } = useSelector((state) => state.medicalRecords);
  const { patients } = useSelector((state) => state.patients);
  const { user } = useSelector((state) => state.auth);
  
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    diagnosis: '',
    prescription: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchMedicalRecords());
    dispatch(fetchPatients());
    // Also fetch doctors so we can map doctor IDs internally if needed? 
    // Usually the user (doctor) is what we record against, but we might want the full list.
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await dispatch(
        addMedicalRecord({
          ...formData,
          // Since the logged in user is the Doctor, we assign their ID. 
          // If the backend expects a true Doctor _id, we use the user._id 
          // (assuming doctors and users share the same _id logic in this simplified app or we pass it directly).
          doctor: user._id, 
        })
      ).unwrap();
      
      setSuccess(true);
      setShowForm(false);
      setFormData({ patient: '', diagnosis: '', prescription: '', notes: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // redudant catch because of unwrap and reducer handling
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Medical Records</h1>
          <p className="section-subtitle">Manage patient diagnoses and prescriptions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Record'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/20 text-success-600 dark:text-success-400 text-sm animate-scale-in">
          <CheckCircle2 className="w-4 h-4" />
          Medical record added successfully!
        </div>
      )}

      {/* New Record Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 space-y-4 animate-slide-down">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Create Medical Record
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              Select Patient
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <select
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                className="input-field pl-10 appearance-none bg-white cursor-pointer"
                required
              >
                <option value="">Choose a patient...</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              Diagnosis
            </label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Acute Bronchitis"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              Prescription
            </label>
            <input
              type="text"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Amoxicillin 500mg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
              Clinical Notes <span className="text-secondary-400">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Additional observations..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Save Medical Record'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {isLoading && !showForm && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      )}

      {/* Records List */}
      {!isLoading && records.length > 0 && (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="card p-5 animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary-500" />
                    <span className="font-bold text-secondary-900 dark:text-white">
                      Patient: {record.patient?.name || 'Unknown Patient'}
                    </span>
                    <span className="text-secondary-400 mx-2">|</span>
                    <Calendar className="w-4 h-4 text-secondary-400" />
                    <span className="text-sm text-secondary-600 dark:text-secondary-300">
                      {formatDate(record.createdAt)}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-700 dark:text-secondary-300">
                    <div>
                      <p className="font-semibold text-secondary-900 dark:text-white mb-1">Diagnosis</p>
                      <p className="bg-secondary-50 dark:bg-secondary-800 p-2 rounded-lg">
                        {record.diagnosis}
                      </p>
                    </div>
                    {record.prescription && (
                      <div>
                        <p className="font-semibold text-secondary-900 dark:text-white mb-1">Prescription</p>
                        <p className="bg-secondary-50 dark:bg-secondary-800 p-2 rounded-lg">
                          {record.prescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {record.notes && (
                    <div className="mt-4 text-sm">
                      <p className="font-semibold text-secondary-900 dark:text-white mb-1">Notes</p>
                      <p className="text-secondary-600 dark:text-secondary-400">{record.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="shrink-0 flex items-center gap-2 bg-secondary-50 dark:bg-secondary-800 px-3 py-1.5 rounded-lg border border-secondary-100 dark:border-secondary-700">
                  <Stethoscope className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
                    Dr. {record.doctor?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && records.length === 0 && (
        <div className="text-center py-20 card">
          <FileText className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
            No medical records found
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">
            You haven&apos;t created any patient medical records yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageRecords;
