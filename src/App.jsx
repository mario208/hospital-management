import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Patient Pages
import PatientHome from './pages/Patient/PatientHome';
import AppointmentsList from './pages/Patient/AppointmentsList';
import BookingPage from './pages/Patient/BookingPage';
import MyRecords from './pages/Patient/MyRecords';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import PatientNotes from './pages/Doctor/PatientNotes';
import ManageRecords from './pages/Doctor/ManageRecords';

// Root redirect component
const RootRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.isAdmin ? '/doctor' : '/patient'} replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute requirePatient>
                <PatientHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute requirePatient>
                <AppointmentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book"
            element={
              <ProtectedRoute requirePatient>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/records"
            element={
              <ProtectedRoute requirePatient>
                <MyRecords />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute requireAdmin>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute requireAdmin>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute requireAdmin>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/notes/:id"
            element={
              <ProtectedRoute requireAdmin>
                <PatientNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/records"
            element={
              <ProtectedRoute requireAdmin>
                <ManageRecords />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
