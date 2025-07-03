import React, { useState } from 'react';
import Sidebar from '../other/Sidebar';
import { motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';

const pageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 180, damping: 20 }
  })
};

const HelpSupport = () => {
  const { isSidebarOpen } = useSidebar();
  const popularQuestions = [
    'How do I reset my password?',
    'Where can I view my order history?',
    'How do I change account settings?',
    'What payment methods are accepted?',
    'How can I contact support?'
  ];
  const categories = [
    { title: 'Account', items: ['Change email address', 'Update password', 'Delete account'] },
    { title: 'Billing', items: ['Invoices & receipts', 'Payment methods', 'Cancel subscription'] },
    { title: 'Using the App', items: ['Navigation tips', 'Enable notifications', 'Data export guide'] },
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

      {/* Main Content */}
      <motion.main
        className="flex-1 ml-16 md:ml-56 p-6 md:p-10 overflow-auto"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        >
          Help & Support
        </motion.h1>

        {/* Search */}
        <motion.div
          className="mb-10"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <input
            type="text"
            placeholder="Search for help articles or keywords..."
            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </motion.div>

        {/* Popular Questions */}
        <motion.section
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-10"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <h2 className="text-2xl font-semibold mb-4">Popular Questions</h2>
          <ul className="space-y-3">
            {popularQuestions.map((q, i) => (
              <motion.li
                key={i}
                className="hover:underline cursor-pointer text-gray-700 dark:text-gray-300"
                variants={listVariants}
                custom={i + 2}
              >
                🔹 {q}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Contact Support */}
        <motion.section
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-10"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          custom={popularQuestions.length + 2}
        >
          <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            If you can't find your answer here, reach out to our support team.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
            Contact Support
          </button>
        </motion.section>

        {/* FAQ Categories */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          custom={popularQuestions.length + 3}
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow"
              variants={listVariants}
              custom={popularQuestions.length + 4 + idx}
            >
              <h3 className="text-xl font-semibold mb-3">{cat.title}</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                {cat.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default HelpSupport;
