import React, { useEffect, useState } from 'react';
import { signUp } from '../Service/YoutubeService';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  // Define state variables for each input field
  const [token, setToken]= useState<any | null>('');
  const naviagate = useNavigate()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (userData && userData.user) {      
      setToken(userData.accessToken);
    }
},)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullname: '',
    avatar: null,
    coverImage: null,
  });

  // Handle changes to the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === 'avatar' || name === 'coverImage') {
      setFormData({
        ...formData,
        [name]: files?.[0] || null, // Save the file object
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(formData, token).then((res:any)=>{
        if(res.success){
            naviagate('/sign-in')
            alert('Sign-up successully')
        }
        
    })
    // Log the form data (you can send it to your backend here)
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow-md rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">
          Full Name
        </label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          value={formData.fullname}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
          Avatar
        </label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coverImage">
          Cover Image
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
