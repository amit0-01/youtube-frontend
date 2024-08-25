import { HeaderProps } from "../interface/interface";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header({ toggleSidenav, isSidenavOpen, toggleForm }: HeaderProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      const parseData = JSON.parse(user);
      setToken(parseData.accessToken); // Set token if it exists
    }
  },[]);

  const goToSignIn = () => {
    navigate('/sign-in');
  };

  function logout(){
    localStorage.clear();
    setToken('');
    navigate('/sign-in')
    
  }

  return (
    <header
      className={`bg-gray-900 text-white p-4 flex items-center justify-between transition-all duration-300 ease-in-out ${
        isSidenavOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}
    >
      <div className="flex items-center">
        <button onClick={toggleSidenav}>
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <img
          src="https://yt3.googleusercontent.com/584JjRp5QMuKbyduM_2k5RlXFqHJtQ0qLIPZpwbUjMJmgzZngHcam5JMuZQxyzGMV5ljwJRl0Q=s900-c-k-c0x00ffffff-no-rj"
          alt="Logo"
          className="h-8 mr-4 cursor-pointer"
        />
      </div>
      <div className={`flex-grow mx-4`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16l4-4-4-4m8 0h-8"
            ></path>
          </svg>
        </div>
      </div>

      {!token ? (
        <button
          onClick={goToSignIn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign In
        </button>
      ) : (
        <div className="flex items-center">
          <button
            onClick={toggleForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2 focus:outline-none focus:bg-blue-800"
          >
            Upload Video
          </button>
          <button onClick={()=>logout()} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:bg-red-800">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
