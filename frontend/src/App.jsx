import React, { useContext } from 'react'
import AppRoutes from './routes/AppRoutes'
import { useNavigate } from 'react-router-dom'
import { UserContext, UserProvider } from './context/UserContext'
import { Toaster } from 'react-hot-toast'
import { SidebarProvider } from './context/SidebarContext'
import axios from 'axios'



const App = () => {


  return (
    <UserProvider>
      <SidebarProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <AppRoutes />
      </SidebarProvider>
    </UserProvider>

  )
}

export default App