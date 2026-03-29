import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientRecords } from '../../redux/slices/medicalRecordSlice';
import {
  FileText,
  Stethoscope,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const MyRecords = () => {
  const dispatch = useDispatch();
  const { records, isLoading, error } = useSelector((state) => state.medicalRecords);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchPatientRecords(user._id));
    }
  }, [dispatch, user]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">My Medical Records</h1>
        <p className="section-subtitle">View your past diagnoses and prescriptions</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/20 text-danger-600 dark:text-danger-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      )}

      {!isLoading && records.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {records.map((record) => (
            <div key={record._id} className="card p-6 flex flex-col h-full animate-slide-up hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-secondary-100 dark:border-secondary-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Date recorded</p>
                    <p className="font-bold text-secondary-900 dark:text-white">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-5">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-white mb-2 uppercase tracking-wide">
                    <FileText className="w-4 h-4 text-primary-500" />
                    Diagnosis
                  </h4>
                  <p className="bg-secondary-50 dark:bg-secondary-800/50 p-3 rounded-xl text-secondary-800 dark:text-secondary-200">
                    {record.diagnosis}
                  </p>
                </div>

                {record.prescription && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-white mb-2 uppercase tracking-wide">
                      <FileText className="w-4 h-4 text-accent-500" />
                      Prescription
                    </h4>
                    <p className="bg-secondary-50 dark:bg-secondary-800/50 p-3 rounded-xl text-secondary-800 dark:text-secondary-200">
                      {record.prescription}
                    </p>
                  </div>
                )}
                
                {record.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-secondary-900 dark:text-white mb-1">Additional Notes</h4>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-secondary-100 dark:border-secondary-700/50 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-secondary-600 dark:text-secondary-300">
                  Recorded by <span className="font-semibold">Dr. {record.doctor?.name || 'Unknown'}</span>
                </span>
                {record.doctor?.specialty && (
                  <span className="text-xs bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded-md text-secondary-600 dark:text-secondary-300 ml-auto">
                    {record.doctor.specialty}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && records.length === 0 && (
        <div className="text-center py-20 card">
          <FileText className="w-16 h-16 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-700 dark:text-secondary-300 mb-1">
            No medical records yet
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">
            When a doctor adds a diagnosis or prescription, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyRecords;
