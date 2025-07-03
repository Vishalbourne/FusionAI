import React, { createContext, useState, useContext } from 'react';

// Create the contextexport 
export const SidebarContext = createContext();

// Create a provider component
export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};


// Custom hook to use the SidebarContext
export const useSidebar = () => {
  return useContext(SidebarContext);
};
