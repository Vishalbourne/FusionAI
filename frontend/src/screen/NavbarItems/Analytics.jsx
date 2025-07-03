import React from 'react';
import Sidebar from '../other/Sidebar';
import { motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';

const overviewStats = [
  { label: 'Page Views', value: '24,180' },
  { label: 'Bounce Rate', value: '36%' },
  { label: 'New Users', value: '1,204' },
  { label: 'Session Time', value: '3m 45s' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: i => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }
  })
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180 } }
};

const Analytics = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
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

      {/* Main Content */}
      <motion.main
        className="flex-1 ml-16 md:ml-56 p-6 md:p-10 overflow-auto"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        >
          Analytics Dashboard
        </motion.h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Traffic Trend Chart Placeholder */}
        <motion.section
          className="bg-white dark:bg-gray-800 mt-10 p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, type: 'spring', stiffness: 180 } }}
        >
          <h2 className="text-xl font-semibold mb-4">Traffic Trend (Last 7 Days)</h2>
          <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
            📊 Chart coming soon...
          </div>
        </motion.section>

        {/* Breakdown Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <motion.section
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.6, type: 'spring', stiffness: 180 } }}
          >
            <h3 className="text-lg font-semibold mb-3">Device Breakdown</h3>
            <ul className="space-y-2 text-sm">
              <li>📱 Mobile – 58%</li>
              <li>💻 Desktop – 34%</li>
              <li>📟 Tablet – 8%</li>
            </ul>
          </motion.section>

          <motion.section
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.7, type: 'spring', stiffness: 180 } }}
          >
            <h3 className="text-lg font-semibold mb-3">Top Locations</h3>
            <ul className="space-y-2 text-sm">
              <li>🇺🇸 United States – 38%</li>
              <li>🇮🇳 India – 25%</li>
              <li>🇬🇧 UK – 15%</li>
              <li>🇩🇪 Germany – 10%</li>
              <li>🌍 Others – 12%</li>
            </ul>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
};

export default Analytics;
