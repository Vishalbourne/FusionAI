import React from 'react';
import Sidebar from '../other/Sidebar';
import { motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';

const pageVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, type: 'spring', stiffness: 180, damping: 20 }
  })
};

export default function Settings() {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.aside
        layout
        initial={false}
        animate={{ width: isSidebarOpen ? 200 : 64 }}
        transition={{ type: 'spring', stiffness: 210, damping: 20 }}
        className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-30"
      >
        <Sidebar />
      </motion.aside>

      <motion.main
        layout
        className="flex-1 ml-16 md:ml-56 p-6 md:p-10 overflow-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8"
          variants={fieldVariants}
          custom={0}
        >
          Settings
        </motion.h1>

        <motion.section
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto"
          variants={fieldVariants}
          custom={1}
        >
          <h2 className="text-2xl font-semibold mb-6">Preferences</h2>

          {/* Dark Mode Toggle */}
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={fieldVariants}
            custom={2}
          >
            <span>Dark Mode</span>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              Toggle
            </button>
          </motion.div>

          {/* Language Selector */}
          <motion.div
            className="flex items-center justify-between"
            variants={fieldVariants}
            custom={3}
          >
            <span>Language</span>
            <select className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option>English</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}
