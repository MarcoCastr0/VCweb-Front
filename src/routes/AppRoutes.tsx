/**
 * @file AppRoutes.tsx
 * @description Defines all application routes using React Router.
 * Includes protected routes that require authentication.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import ForgotPassword from '../pages/ForgotPassword';
import StartMeeting from '../pages/StartMeeting';
import Profile from '../pages/profile';
import Sitemap from '../pages/Sitemap';
import EditProfile from '../pages/EditProfile';
import VideoCall from '../pages/Video_call';
import { AuthService } from '../services/AuthService';
import type { JSX } from 'react';

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * Redirects to login if user is not authenticated.
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = AuthService.getCurrentUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * AppRoutes component that defines all available frontend routes.
 *
 * @component
 * @returns {JSX.Element} Routes configuration for the application.
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sitemap" element={<Sitemap />} />

        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/start-meeting" 
          element={
            <ProtectedRoute>
              <StartMeeting />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-profile" 
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/video-call" 
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all route - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;