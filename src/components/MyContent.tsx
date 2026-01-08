import React, { useEffect, useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material';
import MyTweets from './MyTweets';
import MyVideos from './MyVideos';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../Service/UserProfile';
import Loader from './Loader';
function MyContent() {

  const [token] = useState(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      return userInfo?.accessToken || null;
    }
    return null;
  });
  //  const [userId,setUserId] = useState('');
  const navigate = useNavigate();
   const[coverImage, setCoverImage] = useState('');
   const[avatar,setAvatar] = useState('');
   const [userName, setUsername] = useState('');
   const [name, setName] = useState('');
   const [value, setValue] = useState(0);
   const[loading,setLoading] = useState(false);
   




   useEffect(() => {
    if(token){
    getUserData();        
    }
  }, []); 


  async function getUserData(){
    setLoading(true);
    const response = await getCurrentUser(token);    
    if(response.success){
      setCoverImage(response.data.coverImage);
      setAvatar(response.data.avatar);
      setUsername(response.data.username);
      setName(response.data.fullname)
    }
    setLoading(false);
  }

 


  // CHANEG TABS

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  // AVATAR CHANGE

  const handleUpdateProfile = ()=>{
  //  fileInputRef?.current?.click();
  navigate('/update-profile');
  };

  // const handleFileChange = async (event:any) =>{
  //   const file = event.target.files[0];
  //   if(file){
  //     const formData = new FormData();
  //     formData.append('avatar', file);
  //     try {
  //       const res = await changeUserAvatar(formData, token);
  //       setAvatar(res.data.avatar)

  //       // set the avatar in localstorage also
  //       const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  //       const updatedUserInfo = {
  //         ...userInfo,
  //         user: {
  //           ...userInfo.user,
  //           avatar: res.data.avatar
  //         }
  //       }
  //       localStorage.setItem('userInfo',JSON.stringify(updatedUserInfo));
  //     } catch (error) {
  //     }
  //   }
  // }
 





  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    ) : (
      token ? (
        <div className="">
          {/* Cover Photo Section */}
          <div className="relative">
            <div 
              className="h-64 w-full bg-cover bg-center rounded-t-lg shadow-lg"
              style={{ 
                backgroundImage: `url(${coverImage || 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'})`,
                backgroundColor: '#1e293b'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            </div>
  
            {/* Profile Info Section */}
            <div className="px-6 md:px-10 relative">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                <div className="relative group">
                  <img
                    src={avatar || 'https://avatar.iran.liara.run/public'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                  />
                  <button 
                    onClick={handleUpdateProfile}
                    className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <i className="fas fa-camera text-sm"></i>
                  </button>
                </div>
  
                <div className="flex-1 text-white">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">{name || 'Your Name'}</h1>
                      <p className="text-gray-300">@{userName || 'username'}</p>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md">
                      Edit Profile
                    </button>
                  </div>
  
                  <div className="flex gap-6 mt-4 text-gray-300">
                    <div className="flex items-center gap-1">
                      <i className="fas fa-users"></i>
                      <span>5 subscribers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-video"></i>
                      <span>29 videos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Tabs Section */}
          <div className="px-6 md:px-10 mt-6">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                variant="fullWidth"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab 
                  label={
                    <div className="flex items-center gap-2">
                      <i className="fas fa-video"></i>
                      <span>My Videos</span>
                    </div>
                  } 
                  className="text-gray-700 dark:text-gray-300"
                />
                <Tab 
                  label={
                    <div className="flex items-center gap-2">
                      <i className="fas fa-comment-dots"></i>
                      <span>My Tweets</span>
                    </div>
                  } 
                  className="text-gray-700 dark:text-gray-300"
                />
              </Tabs>
            </Box>
  
            {/* Tab Content */}
            <div className="py-6">
              {value === 0 && <MyVideos />}
              {value === 1 && <MyTweets />}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-lock text-3xl text-blue-500 dark:text-blue-400"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sign In Required</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Please sign in to view your profile</p>
            
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Demo Credentials</h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user text-gray-500"></i>
                  <span className="text-gray-700 dark:text-gray-300">Username: <span className="font-mono">amit12345</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-key text-gray-500"></i>
                  <span className="text-gray-700 dark:text-gray-300">Password: <span className="font-mono">12345</span></span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/login')} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      )
    )
  );
  
}


export default MyContent