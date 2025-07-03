import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to control UI rendering

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  

  // On app load, fetch user from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convert string to object and set it to state
    }
    setLoading(false); // Once data is fetched, stop loading
  }, []);

  

  // Whenever user changes, update LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Optional: Clean up when user logs out
    }
  }, [user]);

  // If still loading, don't render the children, or show a loading screen
  if (loading && user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-lg font-semibold">Loading...</h1>
      </div>
    </div>; 
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
