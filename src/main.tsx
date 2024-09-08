import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for redirection
import App from './App.tsx';
import './index.css';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Watch from './components/Watch.tsx';
import SignIn from './components/SignIn.tsx';
import SignUpForm from './components/SignUp.tsx';
import MyVideos from './components/MyVideos.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
    <Route path="sign-in" element={<SignIn />} />
    </Routes>
      <Routes>
        {/* The App component serves as the layout */}
        <Route path="/" element={<App />}>
          {/* Redirect from the root path to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          <Route path="home" element={<Home />} />
          <Route path="watch" element={<Watch />} />
          <Route path="playlist" element={<Playlist />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path='my-videos' element={<MyVideos/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
