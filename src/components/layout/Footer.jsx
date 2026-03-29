import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-secondary-900 dark:text-white">
              Medi<span className="text-primary-600">Care</span>
            </span>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            © {new Date().getFullYear()} MediCare Hospital Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
