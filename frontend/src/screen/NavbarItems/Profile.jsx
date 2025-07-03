import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../other/Sidebar';
import { motion } from 'framer-motion';
import { useSidebar } from '../../context/SidebarContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import toast from 'react-hot-toast';

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

export default function Profile() {
  const { isSidebarOpen } = useSidebar();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [picture, setPicture] = useState(user?.profilePicture || '');



  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPicture(user?.profilePicture || '');
  }, [user]);

  const handleLogout = () => {
    toast.promise(
      axios.get('/api/users/logout'),
      {
        loading: 'Logging out...',
        success: () => {
          localStorage.clear();
          navigate('/');
          return 'Logged out!';
        },
        error: 'Logout failed.'
      }
    );
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put('/api/users/update', {
        name,
        email,
        profilePicture: picture,
      });
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile.');
    }
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post('/api/users/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPicture(response.data.profilePicture);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload profile picture.');
    }
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
        <motion.div
          className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          variants={fieldVariants}
          custom={0}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <motion.img
              src={imgSrc(picture)}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-gray-300 dark:border-gray-600 object-cover"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                className="mt-2"
              />
            )}
            {/* <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Profile</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div> */}
          </div>

          {/* Fields */}
          {['Name', 'Email'].map((field, i) => (
            <motion.div
              key={field}
              className="mb-6"
              variants={fieldVariants}
              custom={i + 1}
            >
              <label className="block font-medium mb-1">{field}</label>
              {editMode ? (
                <input
                  type={field === 'Email' ? 'email' : 'text'}
                  value={field === 'Email' ? email : name}
                  onChange={e =>
                    field === 'Email'
                      ? setEmail(e.target.value)
                      : setName(e.target.value)
                  }
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg">{field === 'Email' ? email : name}</p>
              )}
            </motion.div>
          ))}

          {/* Save & Logout */}
          {editMode && (
            <motion.div
              className="text-right mb-4"
              variants={fieldVariants}
              custom={3}
            >
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </motion.div>
          )}

          <motion.div
            variants={fieldVariants}
            custom={4}
            className="text-center"
          >
            {!editMode && (
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
}
