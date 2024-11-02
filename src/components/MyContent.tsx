import React, { useEffect, useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material';
import MyTweets from './MyTweets';
import MyVideos from './MyVideos';

function MyContent() {

   const [token, setToken] = useState('');
  //  const [userId,setUserId] = useState('');
   const[coverImage, setCoverImage] = useState('');
   const[avatar,setAvatar] = useState('');
   const [userName, setUsername] = useState('');
   const [name, setName] = useState('');
   const [value, setValue] = useState(0);




   useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');    
    if (userData && userData.user) {
      // setUserId(userData.user._id);
      setToken(userData.accessToken);
      setCoverImage(userData.user.coverImage);
      setAvatar(userData.user.avatar);
      setUsername(userData.user.username);
      setName(userData.user.fullname)
    }
  }, []); 

 


  // CHANEG TABS

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
  <div className="absolute bottom-0 bg-gray-800 w-full  flex space-x-6">
  <div className=" inline-block">
  <img
    src={avatar}
    alt=""
    className="rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold"
  />
  <i className="fa-solid fa-pen-to-square absolute top-0 right-0 bg-white p-1 rounded-full text-gray-600" />
</div>
    <div className="ml-5 p-3">
      <h2 className="text-2xl font-bold text-white">{name}</h2>
      <p className=" text-white">{userName}</p>
      <p className="mt-1 text-white">5 subscribers · 29 videos</p>
    </div>
  </div>
</div>

<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs example">
          <Tab label="My Videos" />
          <Tab label="My Tweets" />
        </Tabs>
      </Box>

      {value === 0 && <MyVideos />}
      {value === 1 && <MyTweets />} 
      {/* <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel> */}
  
  </div> :<div className='flex justify-center items-center h-screen'> <div><h1 className=' text-3xl'>You need to Sign In  </h1> <h2 className='mt-5'><b>username </b>: amit12345 </h2> <h2><b>password</b> : 12345</h2>  </div> 
  </div>
          
  );
}

export default MyContent