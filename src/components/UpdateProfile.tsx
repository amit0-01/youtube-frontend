import { useEffect, useRef, useState, } from 'react'
import { changeCoverImage, changeUserAvatar, getCurrentUser, updateUserAccountEmailAndFullName } from '../Service/UserProfile';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UpdateProfile() {
     
    const [coverImage, setCoverImage] = useState('');
    const [avatar, setAvatar] = useState('');
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [token] = useState(() => {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        return userInfo?.accessToken || null;
      }
      return null;
    });
    const coverImageFileInputRef = useRef<any>(null);
    const avatarFileInputRef = useRef<any>(null);
    const  [updateFormData, setUpdateFormData] = useState<any>({});
    const[loading,setLoading] = useState(false);
    const navigate = useNavigate();

    // GET USER DATA
    async function getUserData(){
      setLoading(true);
      const response = await getCurrentUser(token);
      if(response.success){
        setFullName(response.data.fullname);
        setEmail(response.data.email);
        setUserName(response.data.username);
        setCoverImage(response.data.coverImage);
        setAvatar(response.data.avatar)
      }
      setLoading(false);
        // const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        // setCoverImage(userInfo.user.coverImage);
        // setAvatar(userInfo.user.avatar);
        // setFullName(userInfo.user.fullname);
        // setUserName(userInfo.user.username);
        // setEmail(userInfo.user.email);
        // setToken(userInfo.accessToken);
    }

    function setUserData(){
      setUpdateFormData({
      fullName: fullName,
      userName: userName,
      email: email
     })
    }

    useEffect(()=>{
        // getToken();
        getUserData();        
        console.log('updateformdata',updateFormData);    
    },[])

    useEffect(()=>{
      setUserData();    
    },[fullName,userName,email])

    // TRIGGER INPUT FOR COVER IMAGE
    function handleCoverImageChange(){
        coverImageFileInputRef?.current?.click();
    }
   

    // ON FILE CHANGE OF COVER IMAGE
    const handleCoverImageFileChange = async (event:any) =>{
    const file = event.target.files[0];
    if(file){
      if (file) {
        setUpdateFormData((prevState:any) => ({
          ...prevState,
          coverImage: file,
        }));
      }
    }
  }

   

  //TRIGGER INPUT FOR  AVATAR IMAGE
  function handleAvatarChange(){
    avatarFileInputRef?.current?.click();
  }

  // ON FILE CHANGE OF AVATAR IAMGE
  function handleAvatarFileChange(event:any){
  const file = event?.target?.files[0];
  if (file) {
    setUpdateFormData((prevState:any) => ({
      ...prevState,
      avatar: file,
    }));
  }
  }

    // Update form data when text fields change
    const handleInputChange = (field: string, value: string) => {
      setUpdateFormData((prevState:any) => ({
        ...prevState,
        [field]: value,
      }));
    };


    // HANDLE THE FORM VALUES
    function handleFormSubmit(event:any){
      event.preventDefault();
      if(updateFormData.coverImage){
       updateCoverImage();
      }
      if(updateFormData.avatar){
       updateAvatarImage();
      }
      updateAccount();
      setTimeout(()=>{
      navigate('/my-content');
      },0);
      toast.success("Updated User Account Successfully")
    }

    // UPDATE COVER IMAGE
   async function updateCoverImage(){
    setLoading(true);
    const formData = new FormData();
    formData.append('coverImage', updateFormData.coverImage);
    const response = await changeCoverImage(formData, token);
    console.log('response',response);
    
    setLoading(false);
    }

    // UPDATE AVATAR IMAGE
    async function updateAvatarImage(){
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', updateFormData.avatar);
      const response = await changeUserAvatar(formData, token);
      setLoading(false);
      console.log('resone',response);
    }

    // UPDATE ACCOUNT
    async function updateAccount(){
    setLoading(true);
    const payload = {
      email : updateFormData.email,
      fullname: updateFormData.fullName
    }
    const response = await updateUserAccountEmailAndFullName(payload,token);
    console.log('response',response);
    setLoading(false);
    }

  // useEffect(() => {
  //   console.log("updateFormData updated:", updateFormData);
  // }, [updateFormData]);


 


  return (
    <>
    {loading ? (<Loader/>): (
      <div className='p-3'>
      {/* COVER IMAGE */}
      <div>
          <h1 className='mb-2 text-xl font-bold'>Cover image</h1>
          <div className='flex gap-10'>
              <div>
              <img src={coverImage} alt="cover image" width="350px"/>
              </div>
              <div className='flex items-center'>
                  <button className='bg-gray-200 rounded-lg p-1'
                  onClick={()=>handleCoverImageChange()}>Upload</button>
              </div>
               {/* hidden file input */}
                  <input
                  type='file'
                  ref={coverImageFileInputRef}
                  className='hidden'
                  onChange={handleCoverImageFileChange}
                  />
          </div>
      </div>
  
      {/* AVATAR */}
  
      <div className='mt-2'>
          <h1 className='mb-2 text-xl font-bold'>Avatar</h1>
          <div className='flex gap-10'>
              <div>
              <img src={avatar} alt="avatar" width="350px" />
              </div>
              <div className='flex items-center'>
                  <button className='bg-gray-200 rounded-lg p-1' onClick={handleAvatarChange}>Upload</button>
              </div>
                    {/* hidden file input */}
                    <input
                  type='file'
                  ref={avatarFileInputRef}
                  className='hidden'
                  onChange={handleAvatarFileChange}
                  />
          </div>
      </div>
  
  
      
  
     {/* FROM TO UPDATE INPUT VALUES */}
  
  
     <form>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                handleInputChange("fullName", e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                handleInputChange("userName", e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange("email", e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <button
            type="submit"
            className="px-2 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
            onClick={handleFormSubmit}
          >
            Save
          </button>
        </form>
  
     </div>
    )}
   </>
  )
}

export default UpdateProfile