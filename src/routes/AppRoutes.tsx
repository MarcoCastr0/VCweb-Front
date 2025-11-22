/**
 * @file AppRoutes.tsx
 * @description Defines all application routes using React Router.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/start-meeting' element={<StartMeeting />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/sitemap' element={<Sitemap />} />
        <Route path='/edit-profile' element={<EditProfile />} />
        <Route path='/video-call' element={<VideoCall />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
