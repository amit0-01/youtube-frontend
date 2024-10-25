  import { HeaderProps } from "../interface/interface";
  import { useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import { Menu, MenuItem } from "@mui/material";
  import { useLocation } from 'react-router-dom';


  function Header({ toggleSidenav, isSidenavOpen, toggleForm, setSearchTerm }: HeaderProps) {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();



  

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

  
  
  const handleProfileClick = (event:any) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  
  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  // HANDLE SEARCH INPUT
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchParam = event.target.value;
    setSearchTerm(searchParam);    
  }

  // const handleClick = () =>{
  //   onSearchTextChange('hello')
  // }

  return (
    <header
      className={`bg-gray-900 text-white p-4 flex items-center justify-between transition-all duration-300 ease-in-out ${
        isSidenavOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}
    >
      <div className="flex items-center">
        <button onClick={toggleSidenav}>
        <i className="fa-solid fa-bars"></i>
        </button>
        {/* <i className="fa-brands fa-youtube ms-20 text-4xl"></i> */}
        {/* <img
          src="https://yt3.googleusercontent.com/584JjRp5QMuKbyduM_2k5RlXFqHJtQ0qLIPZpwbUjMJmgzZngHcam5JMuZQxyzGMV5ljwJRl0Q=s900-c-k-c0x00ffffff-no-rj"
          alt="Logo"
          className="h-8 cursor-pointer"
        /> */}
      </div>
      <div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className={` md:w-full h-8 p-2  md:h-full w-32  rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500 ${location.pathname === '/home' ? 'block' : 'hidden' }`}
            onChange={handleInput}
          />
        <i className={`fa-solid fa-magnifying-glass absolute right-3 top-3 ${location.pathname === '/home' ? 'hidden lg:block' : 'hidden'}`}></i>
        </div>
        {/* <button onClick={handleClick}>hello</button> */}
      </div>

      {!token ? (
        <button
          onClick={goToSignIn}
          className="bg-blue-600 whitespace-nowrap hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign In
        </button>
      ) : (
        <div className="flex items-center">
          <button
            onClick={toggleForm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded-lg mr-2 focus:outline-none focus:bg-blue-800 whitespace-nowrap px-1 py-1 "
          >
            <i className="fa-solid fa-upload"></i>
            Upload
          </button>
          <div className="relative">
      {/* Profile Div */}
      <div
        onClick={handleProfileClick}
        className="px-4 py-2 rounded-full bg-green-950 cursor-pointer"
      >
        {/* Profile content */}
        <p>A</p>
      </div>

      {/* MUI Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
        </div>
      )}
    </header>
  );
}

export default Header;
