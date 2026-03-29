import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-secondary-950">
      <Navbar />
      <div className="flex-1 flex">
        <div className="page-container flex gap-8 w-full">
          <Sidebar />
          <main className="flex-1 min-w-0 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
