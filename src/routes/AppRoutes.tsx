import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import ForgotPassword from '../pages/ForgotPassword';
import StartMeeting from '../pages/StartMeeting';
import Profile from '../pages/profile';
import Sitemap from '../pages/Sitemap';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path='/start-meeting' element={<StartMeeting />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/sitemap' element={<Sitemap />}/>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;