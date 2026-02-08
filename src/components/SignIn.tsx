import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormValues, FormErrors } from '../core/interface/interface';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { storageService } from '../Service/storageService';
import { signIn } from '../Service/auth.service';


const Login: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = location.state || {};
  const [loading, setLoading] = useState<boolean>(false)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  useEffect(() => {
    if ( message) {
      toast.success(message);
      navigate('/home', { replace: true, state: null });
    }
  }, [ message, navigate]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formValues.username) newErrors.username = 'Username is required';
    if (!formValues.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const validationErrors:any = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        setLoading(true);
        const response = await signIn(formValues)
        
       // In SignIn.tsx
      if (response.success) {
        // Store user data consistently
        storageService.setItem('user', response.data);
        
        // Get expiry from the token if available, otherwise use 1 minute from now
        // let expiryTime = Date.now() + 60 * 1000; // Default 1 minute
        // if (response.data.accessToken) {
        //   try {
        //     const payload = JSON.parse(atob(response.data.accessToken.split('.')[1]));
        //     expiryTime = payload.exp * 1000;
        //   } catch (e) {
        //     console.warn('Failed to parse token for expiry, using default 1 hour');
        //   }
        // }
        
        // localStorage.setItem('tokenExpiry', expiryTime.toString());
        navigate('/home', { state: { message: 'Login successful' } });
        setLoading(false);
      }
         else{
          setLoading(false);

          toast.error('INCORRECT EMAIL OR PASSWORD');
          setErrors(validationErrors);
        }
      } else {

        toast.error('error while login');
        setErrors(validationErrors);
      }
    } catch (error:any) {
      toast.error('Incorrect email or password');
    }
  };

  return (
    <>
    {loading ? <Loader /> : <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              name="username"
              type="text"
              id="username"
              value={formValues.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.username && (
              <div className="text-red-500 text-sm mt-2">{errors.username}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-2">{errors.password}</div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account? 
            <a href="/sign-up" className="text-blue-500 hover:text-blue-700 font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>}
    
    </>
  );
};

export default Login;
