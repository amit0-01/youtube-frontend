import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SidenavProps } from "../interface/interface";

function Sidenav({ isSidenavOpen, toggleSidenav }: SidenavProps) {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>();

  function checkLocalDarkMode() {
    // Get the data from localStorage
    const parsedData = localStorage.getItem('isDarkMode');
    
    // If parsedData exists, set dark mode accordingly
    if (parsedData && JSON.parse(parsedData) === true) {
      console.log('this is workin')
      setIsDarkMode(true);
    } else if(parsedData && JSON.parse(parsedData) === false) {
      console.log('this is working')
      setIsDarkMode(false);
    }
  }


  useEffect(function(){
    checkLocalDarkMode();
  },[])

  // APPLY DARK MODE
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Define navigation items
  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/tweets', label: 'Tweets' },
    { path: '/my-content', label: 'My Content' },
  ];

  // Toggle settings submenu
  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    console.log(isDarkMode)
    setIsDarkMode((prev) => {
      const newDarkMode = !prev;  // This gives the updated value of isDarkMode
      localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));  // Save the updated value to localStorage
      return newDarkMode;  // Return the updated state
    });
  };

  return (
    <div
      id="sidenav"
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform z-10 ${isSidenavOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 h-screen">
        <button onClick={toggleSidenav} className="focus:outline-none text-white mb-4">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <nav className="mt-4">
          <ul>
            {navItems.map(({ path, label }) => (
              <li key={path} className="py-2">
                <a
                  href={path}
                  className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname === path ? 'bg-gray-700' : ''
                    }`}
                >
                  {label}
                </a>
              </li>
            ))}

            {/* Settings Option */}
            <li className="py-2">
              <button
                onClick={toggleSettings}
                className="flex w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none items-center justify-between"
              >
                Settings
                <i
                className={`fa-solid transition-transform duration-500 ease-in-out ${
                  isSettingsOpen ? 'fa-angle-up' : 'fa-angle-down'
                }`}
              ></i>
              </button>

              {/* Transition on settings submenu */}
              <ul
                className={`ml-4 mt-2 overflow-hidden transition-all duration-500 ease-in-out ${
                  isSettingsOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <li className="py-1 flex items-center justify-between">
                  <span className="block px-4 py-2">Dark Mode</span>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-500 ease-in-out ${
                      isDarkMode ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-500 ease-in-out ${
                        isDarkMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </li>
              </ul>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidenav;
