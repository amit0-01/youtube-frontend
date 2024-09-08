import React, { useEffect, useState } from 'react'
import { convertoMinute } from '../Service/Function';
import { deleteUserVideo, getUserVideos } from '../Service/UserProfile';
import {  useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function MyVideos() {

   const [videos,setVideos] = useState([]);
   const [token, setToken] = useState('');
   const [userId,setUserId] = useState('');
   const[coverImage, setCoverImage] = useState('');
   const[avatar,setAvatar] = useState('');
   const navigate = useNavigate();
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const [userName, setUsername] = useState('');
   const [name, setName] = useState('');



   useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    console.log(userData);
    

    if (userData && userData.user) {
      setUserId(userData.user._id);
      setToken(userData.accessToken);
      setCoverImage(userData.user.coverImage);
      setAvatar(userData.user.avatar);
      setUsername(userData.user.username);
      setName(userData.user.fullname)
    }
  }, []); // Empty dependency array to run this effect only once on component mount

  useEffect(() => {
    if (userId && token) {
      getUserVideos(userId, token).then((res) => {
        setVideos(res.data)
      });
    }
  }, [userId, token]);

  function getIndidualVideo(data: any) {
    console.log(data);
    
    navigate(`/watch`, { state: { video: data } });
  }

  // delete the video

  const handleDelete = (videoId:string) => {
    console.log(videoId);
    
       deleteUserVideo(token, videoId, userId).then((res:any)=>{
        console.log(res);
        setVideos(res.data);
       })    
    // Optionally: Add logic here to delete the video from the backend/server.
    
    // Remove the video from the local state
    // const updatedVideos = videos.filter((video) => video._id !== videoId);
    // setVideoList(updatedVideos);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();  // Prevents the default action
    event.stopPropagation(); 
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

   


  return (
    token ? 
    <div className="grid items-center p-4 m-3">
   <div className="relative">
  {/* Cover Image */}
  <div
    className="h-72 bg-cover bg-center"
    style={{ backgroundImage: `url(${coverImage})` }}
    ></div>

  {/* Content */}
  <div className="absolute top-0  flex space-x-6">
    <div>
      <img src={avatar} alt="" className='rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold' />
    </div>
    <div className="ml-5 p-6">
      <h2 className="text-2xl font-bold text-white">{name}</h2>
      <p className=" text-white">{userName}</p>
      <p className="mt-1 text-white">5 subscribers · 29 videos</p>
      <div className="mt-3 flex space-x-3">
        <button className="bg-green-900 px-4 py-2 rounded text-sm text-white hover:bg-gray-300">
          Customize channel
        </button>
        <button className="bg-green-900 px-4 py-2 rounded text-sm text-white hover:bg-gray-300">
          Manage videos
        </button>
      </div>
    </div>
  </div>
</div>


    <div className='grid md:grid-cols-5 gap-5  mt-16'>
      {videos.map((data:any) => (
        <div key={data._id} >
          <div onClick={() => getIndidualVideo(data)} className='cursor-pointer'>
            {/* Thumbnail Image */}
            <img 
              src={data.thumbnail} 
              alt="Video Thumbnail" 
              className='w-full h-48 object-cover rounded-lg' 
            />
            <div className='flex mx-2 my-2'>
              {/* Owner's Profile Image */}
              <img 
                src="https://images.pexels.com/photos/20780444/pexels-photo-20780444/free-photo-of-person-hand-holding-shiny-glass-mug.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Owner" 
                className='w-9 h-9 rounded-full' 
              />
              <div className='ms-3'>
                {/* Title */}
                <h1 className='text-lg font-bold'>{data.title}</h1>
                {/* Owner */}
                <p className='text-gray-500'>{data.ownerInfo.username}</p>
                <div className='flex'>
                  {/* Views */}
                  <p className='text-gray-500'>{data.views} views</p>
                  {/* Duration */}
                  <p className='text-gray-500 ms-1'>{convertoMinute(data.duration)}</p>
                </div>
              </div>
              {/* <div className='ms-auto'>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); // Prevents triggering getIndidualVideo when clicking delete
                    handleDelete(data._id); 
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div> */}

     <i className="fa-solid fa-ellipsis-vertical ms-24"
         id="basic-button"
         aria-controls={open ? 'basic-menu' : undefined}
         aria-haspopup="true"
         aria-expanded={open ? 'true' : undefined}
         onClick={handleClick}
        ></i>

      {/* Material UI Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose} // Close when clicking outside
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* Delete Menu Item with onClick */}
        <MenuItem
          onClick={(e) => { 
            e.preventDefault();
            e.stopPropagation(); // Prevent parent click handlers from triggering
            handleDelete(data._id); // Call delete handler with item id
            handleClose(); // Close the menu after delete
          }}
        >
          Delete
        </MenuItem>
        {/* Uncomment other menu items if needed */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div> : <h1 className='flex justify-center items-center h-screen text-3xl'>You need to Sign In </h1>
  );
}

export default MyVideos