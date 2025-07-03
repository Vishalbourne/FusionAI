// AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../screen/Login';
import Register from '../screen/Register';
import Home from '../screen/NavbarItems/Home';
import Project from '../screen/Project';
import ProtectedRoute from './ProtectedRoute';
import About from '../screen/NavbarItems/About';
import Dashboard from '../screen/NavbarItems/Dashboard';
import Analytics from '../screen/NavbarItems/Analytics';
import HelpSupport from '../screen/NavbarItems/Help&Support';
import Settings from '../screen/NavbarItems/Settings';
import Notifications from '../screen/NavbarItems/Notifications';
import Profile from '../screen/NavbarItems/Profile';
import Contact from '../screen/NavbarItems/Contact';
import Pricing from '../screen/NavbarItems/Pricing';
import OAuthSuccess from '../screen/other/OAuthSuccess';

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project"
            element={
              <ProtectedRoute>
                <Project />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/oauth-success"
            element={
                <OAuthSuccess />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
