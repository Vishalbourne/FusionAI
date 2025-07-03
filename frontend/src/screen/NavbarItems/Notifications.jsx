import React from 'react';
import Sidebar from '../other/Sidebar';
import { motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, type: 'spring', stiffness: 180, damping: 20 }
  })
};

const Notifications = () => {
  const { isSidebarOpen } = useSidebar();
  const notifications = [
    { icon: '🔔', text: <>New user registered: <strong>Alice</strong></> },
    { icon: '⚠️', text: 'System maintenance scheduled for Sunday' },
    { icon: '📧', text: "You've received a new support message" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <motion.aside
        layout
        initial={false}
        animate={{ width: isSidebarOpen ? 200 : 64 }}
        transition={{ type: 'spring', stiffness: 210, damping: 20 }}
        className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-30"
      >
        <Sidebar />
      </motion.aside>

      {/* Main */}
      <motion.main
        layout
        className="flex-1 ml-16 md:ml-56 p-6 md:p-10 overflow-auto"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8"
          variants={listVariants}
          custom={0}
        >
          Notifications
        </motion.h1>

        <motion.section
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
          variants={listVariants}
          custom={1}
        >
          <ul className="space-y-6">
            {notifications.map((note, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                variants={listVariants}
                custom={i + 2}
              >
                <span className="text-2xl">{note.icon}</span>
                <span className="flex-1">{note.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Notifications;
