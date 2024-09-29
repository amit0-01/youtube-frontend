import { useState } from 'react';
import './App.css';
import Header from './common/Header';
import Sidenav from './common/Sidenav';
import { Outlet } from 'react-router-dom';
import VideoUploadForm from './components/Dialog/upload-video'
import Loader from './components/Loader';
import { ToastContainer } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const toggleSidenav = () => setIsSidenavOpen(!isSidenavOpen);
  const toggleForm = () => setIsDialogOpen(!isDialogOpen);

  return (
    <div className="app-container overflow-hidden">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header 
            toggleSidenav={toggleSidenav} 
            isSidenavOpen={isSidenavOpen} 
            toggleForm={toggleForm} 
            setSearchTerm={setSearchTerm} 
          />
          <Sidenav 
            isSidenavOpen={isSidenavOpen} 
            toggleSidenav={toggleSidenav} 
          />
          <div className={`content ${isSidenavOpen ? 'lg:ml-64' : 'lg:ml-0'} transition-all duration-300`}>
            <Outlet context={{ searchTerm }} />
          </div>
          {isDialogOpen && (
            <VideoUploadForm 
              toggleForm={toggleForm} 
              loading={loading} 
              setLoading={setLoading} 
            />
          )}
        </>
      )}
          <ToastContainer />
    </div>
  );
}

export default App;
