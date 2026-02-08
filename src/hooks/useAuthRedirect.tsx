import { useEffect } from "react";
import { toast } from "react-toastify";
import { storageService } from "../Service/storageService";
import { useLocation, useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  console.log('pathname', pathname);

  useEffect(() => {
    // Get token from localStorage
    const userData:any = storageService.getItem("user");
    const token = userData?.accessToken;
    const expiry = localStorage.getItem("tokenExpiry");

    // Updated public routes to match your actual routes from main.tsx
    const publicRoutes = ["/", "/sign-in", "/sign-up"];
    console.log('🔵 Public routes:', publicRoutes);

    // Skip auth check for public routes
    if (publicRoutes.includes(pathname)) {
      // If user is already logged in and tries to access sign-in/sign-up, redirect to home
      if ((pathname === '/sign-in' || pathname === '/sign-up') && token && expiry && Date.now() < Number(expiry)) {
        navigate('/home');
      }
      return;
    }

          console.log('expiry', expiry);
          console.log('Date.now()', Date.now() )
          console.log('check',Date.now() > Number(expiry))
          // console.log('check2', expiry && Date.now() > Number(expiry));

    // Check if token is expired
    if (expiry && Date.now() > Number(expiry)) {
      toast.error("Session expired. Please log in again.");
      storageService.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      navigate("/sign-in");
      return;
    }

    // Check if token or expiry is missing
    if (!token || !expiry) {
      // Only redirect to sign-in if not already there
      if (pathname !== '/sign-in') {
        navigate("/sign-in");
      }
      return;
    }

    // If we have a valid token and we're on a login/signup page, redirect to home
    if ((pathname === "/sign-in" || pathname === "/sign-up") && token && expiry && Date.now() < Number(expiry)) {
      navigate('/home');
      return;
    }
  }, [pathname, navigate]);
};