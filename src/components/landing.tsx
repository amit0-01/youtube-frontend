import { useState } from 'react';
// import './App.css';
// import Header from './common/Header';
// import Sidenav from './common/Sidenav';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Sidenav from '../common/Sidenav';
// import VideoUploadForm from './components/Dialog/upload-video'

function App() {
  // State to manage sidenav visibility
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);

  // State to manage the visibility of the upload video dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to toggle sidenav visibility
  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  // Function to toggle dialog visibility
  const toggleForm = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div className="app-container overflow-hidden">
      <Header toggleSidenav={toggleSidenav} isSidenavOpen={isSidenavOpen} toggleForm={toggleForm} />
      <Sidenav isSidenavOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />
      {/* Outlet will render the matched child route */}
      <div className={`content ${isSidenavOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300`}>
        <Outlet />
      </div>
      {/* {isDialogOpen && <VideoUploadForm toggleForm={toggleForm} />} Conditionally render the dialog */}
    </div>
  );
}

export default App;
