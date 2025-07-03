import React from 'react';
import Sidebar from '../other/Sidebar';
import { motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';

const cards = [
  { title: 'Total Users', value: '1,204' },
  { title: 'Active Projects', value: '17' },
  { title: 'New Messages', value: '5' },
];

const activities = [
  { icon: '🟢', text: <>User <strong>John Doe</strong> created a new project.</> },
  { icon: '🔵', text: <>New user <strong>Jane Smith</strong> signed up.</> },
  { icon: '🟡', text: <>Project <strong>AI Tool</strong> marked as completed.</> },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } }
};

const Dashboard = () => {
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

      {/* Main Content with dynamic margin-left */}
      <motion.main
        layout
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? 200 : 64 }}
        transition={{ type: 'spring', stiffness: 210, damping: 20 }}
        className="flex-1 p-6 md:p-10 overflow-auto"
      >
        {/* Header */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Dashboard
        </motion.h1>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col"
              variants={cardVariants}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.section
          className="mt-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {activities.map((act, i) => (
              <motion.li
                key={i}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-start gap-3"
                variants={itemVariants}
                custom={i}
              >
                <span className="text-2xl">{act.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{act.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Dashboard;
