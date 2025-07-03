// components/Sidebar.jsx
import React, { useContext,useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { SidebarContext } from '../../context/SidebarContext';

const navItems = [
  { name: 'Profile', path: '/profile', icon: 'ri-user-line' },
  { name: 'Home', path: '/', icon: 'ri-home-line' },
  { name: 'Dashboard', path: '/dashboard', icon: 'ri-dashboard-line' },
  { name: 'Analytics', path: '/analytics', icon: 'ri-bar-chart-line' },
  { name: 'Notifications', path: '/notifications', icon: 'ri-notification-3-line' },
  { name: 'Settings', path: '/settings', icon: 'ri-settings-3-line' },
  { name: 'Help & Support', path: '/help', icon: 'ri-question-line' },
  { name: 'About', path: '/about', icon: 'ri-information-line' },
  { name: 'Contact', path: '/contact', icon: 'ri-contacts-line' },
  { name: 'Pricing', path: '/pricing', icon: 'ri-price-tag-3-line' },
];

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
  const [isDisable, setIsDisable] = useState(false)

  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 600) {
          setIsSidebarOpen(false);
          setIsDisable(true);
          
        }
      };
  
      handleResize(); // Initial check
      window.addEventListener('resize', handleResize);
  
      return () => window.removeEventListener('resize', handleResize);
    }, [setIsSidebarOpen]);

  return (
    <motion.aside
      layout
      initial={false}
      animate={{ width: isSidebarOpen ? 200 : 64 }}
      transition={{ type: 'spring', stiffness: 210, damping: 20 }}
      className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          whileTap={{ scale: 0.9 }}
          className={`text-gray-700 cursor-pointer dark:text-gray-300 text-2xl ${isDisable?'':'cursor-pointer'}`}
          disabled={isDisable}
        >
          <i className="ri-menu-line" />
        </motion.button>
        {isSidebarOpen && (
          <motion.span
            layout
            className="font-bold text-lg text-gray-800 dark:text-gray-100"
          >
            Menu
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ name, path, icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} className="group">
              <motion.div
                layout
                whileHover={{ backgroundColor: active ? undefined : '#f3f4f6' }}
                whileFocus={{ backgroundColor: active ? undefined : '#f3f4f6' }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer ${
                  active
                    ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                    : 'text-gray-600 dark:text-gray-400'
                } transition-colors`}
              >
                <i className={`${icon} text-2xl`} />

                {isSidebarOpen && (
                  <motion.span
                    layout
                    className="whitespace-nowrap"
                  >
                    {name}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer (Optional) */}
      {/* <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        {isSidebarOpen && (
          <motion.button
            layout
            onClick={() => setIsSidebarOpen(false)}
            className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Collapse
          </motion.button>
        )}
      </div> */}
    </motion.aside>
  );
};

export default Sidebar;
