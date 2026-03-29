import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Calendar,
  Home,
  BookOpen,
  FileText,
  Users,
  ClipboardList,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const doctorLinks = [
    { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { path: '/doctor/patients', label: 'Patients', icon: Users },
    { path: '/doctor/records', label: 'Medical Records', icon: ClipboardList },
  ];

  const patientLinks = [
    { path: '/patient', label: 'Home', icon: Home, end: true },
    { path: '/patient/appointments', label: 'My Appointments', icon: FileText },
    { path: '/patient/book', label: 'Book Appointment', icon: BookOpen },
    { path: '/patient/records', label: 'Medical Records', icon: ClipboardList },
  ];

  const links = user.isAdmin ? doctorLinks : patientLinks;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm'
        : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 hover:text-secondary-900 dark:hover:text-white'
    }`;

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 glass-card p-4 space-y-1">
        <p className="px-4 py-2 text-xs font-semibold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider">
          {user.isAdmin ? 'Doctor Menu' : 'Patient Menu'}
        </p>
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} end={link.end} className={linkClass}>
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
