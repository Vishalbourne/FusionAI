import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../other/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};


const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

export default function Home() {
  const { user } = useContext(UserContext);

  const { isSidebarOpen } = useSidebar();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    axios.get('/api/projects/getProjects')
      .then(res => setProjects(res.data))
      .catch(err => { if (err.response?.data?.message !== 'No projects found') toast.error('Failed to load projects'); })
      .finally(() => setLoading(false));
  }, []);

  const submit = e => {
    e.preventDefault();
    if (!newName.trim()) return toast.error('Name required');
    toast.promise(
      axios.post('/api/projects/create', { name: newName }),
      {
        loading: 'Creating…',
        success: res => {
          setProjects(p => [...p, res.data.project]);
          setNewName('');
          setModalOpen(false);
          return 'Created!';
        },
        error: 'Failed'
      }
    );
  };


  const remove = id => {
    toast.promise(
      axios.delete(`/api/projects/deleteProject/${id}`),
      {
        loading: 'Deleting…',
        success: () => {
          setProjects(p => p.filter(x => x._id !== id));
          return 'Deleted!';
        },
        error: 'Failed'
      }
    );
  };

  const imgSrc = (pic) => {
  if (!pic) {
    // Case 3: Empty or undefined
    return 'https://via.placeholder.com/150';
  }

  if (pic.startsWith('http')) {
    // Case 1: It's a normal URL
    return pic;
  }

  // Case 2: Assume Base64
  return `data:image/jpeg;base64,${pic}`;
};


  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.aside
        layout
        initial={false}
        animate={{ width: isSidebarOpen ? 200 : 64 }}
        transition={{ type: 'spring', stiffness: 210, damping: 20 }}
        className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow z-30"
      >
        <Sidebar />
      </motion.aside>

      <motion.main
        layout
        className="flex-1 ml-16 md:ml-56 p-6 md:p-10 overflow-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <motion.img
              src={imgSrc(user?.profilePicture)}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-md object-cover"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            />
            <div>
              <h1 className="text-2xl font-bold truncate">Welcome, {user?.name || 'User'}</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your projects and collaborate.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search projects…"
              className="flex-1 md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
              <i className="ri-search-line text-xl" />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <p className="text-center text-lg">Loading…</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* New Project Card */}
            <motion.button
              className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700"
              onClick={() => setModalOpen(true)}
              variants={cardVariants}
            >
              <i className="ri-add-line text-3xl mb-2" />
              <span className="font-semibold">New Project</span>
            </motion.button>

            {/* Existing Projects */}
            {projects.length > 0 ? projects.map((p, i) => (
              <motion.div
                key={p._id}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer"
                variants={cardVariants}
                transition={{ delay: (i+1)*0.1 }}
                onClick={() => navigate('/project', { state: { proj: p } })}
              >
                <button
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  onClick={e => { e.stopPropagation(); remove(p._id); }}
                >
                  <i className="ri-delete-bin-line text-xl" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <i className="ri-folder-fill text-blue-500 text-2xl" />
                  <h3 className="font-semibold text-lg truncate">{p.name}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {p.users?.length || 0} Collaborator{p.users?.length === 1 ? '' : 's'}
                </p>
              </motion.div>
            )) : (
              <motion.p
                className="col-span-full text-center text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                No projects found.
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Create Project Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-80"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <i className="ri-folder-line text-blue-500" /> New Project
                </h2>
                <form onSubmit={submit} className="space-y-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Project name"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
