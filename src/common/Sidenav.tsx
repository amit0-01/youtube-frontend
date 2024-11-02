import { useLocation } from 'react-router-dom';
import { SidenavProps } from "../interface/interface";

function Sidenav({ isSidenavOpen, toggleSidenav }: SidenavProps) {
  const location = useLocation();

  return (
    <div
      id="sidenav"
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform z-10 ${
        isSidenavOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-in-out `}
    >
      <div className="p-4 h-screen">
        <button onClick={toggleSidenav} className="focus:outline-none text-white mb-4">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <nav className="mt-4">
          <ul>
            <li className="py-2">
              <a
                href="/home"
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  location.pathname === '/home' ? 'bg-gray-700' : ''
                }`}
              >
                Home
              </a>
            </li>
            {/* <li className="py-2">
              <a
                href="/playlist"
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  location.pathname === '/playlist' ? 'bg-gray-700' : ''
                }`}
              >
                Playlist
              </a>
            </li> */}
            <li className="py-2">
              <a
                href="/tweets"
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  location.pathname === '/tweets' ? 'bg-gray-700' : ''
                }`}
              >
                Tweets
              </a>
            </li>
            <li className="py-2">
              <a
                href="/my-content"
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  location.pathname === '/my-content' ? 'bg-gray-700' : ''
                }`}
              >
                My Content
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidenav;
