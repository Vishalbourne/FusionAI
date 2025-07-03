import React, { useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import { motion } from 'framer-motion';
import Sidebar from '../other/Sidebar.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';

const About = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  const pageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  const techList = [
    'React 19',
    'React Router 7',
    'Tailwind CSS 4',
    'Socket.IO',
    'Axios',
    'Express 5',
    'MongoDB + Mongoose',
    'Passport (Google/GitHub)',
    'JWT Auth',
    '@google/genai',
    'ioredis',
    'Joi Validation',
  ];

  const featureList = [
    'Project creation & collaboration',
    'Responsive UI with dark mode',
    'Google & GitHub OAuth login',
    'WebSocket-based real-time updates',
    'Form validation & secure authentication',
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-width duration-200`}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <motion.main
        className="flex-1 p-6 md:p-10 overflow-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <i className="ri-information-line text-4xl text-blue-500" />
            <h1 className="text-4xl font-bold">About This App</h1>
          </div>

          {/* Description */}
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            This modern MERN-stack web app offers real-time collaboration, Google/GitHub OAuth,
            and seamless dark/light theme support—helping you manage projects effortlessly.
          </p>

          {/* Technologies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {techList.map((tech, i) => (
                <motion.div
                  key={i}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-center text-sm font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              {featureList.map((feat, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                >
                  {feat}
                </motion.li>
              ))}
            </ul>
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default About;
