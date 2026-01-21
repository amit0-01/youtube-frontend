import { useEffect } from "react";
import { toast } from "react-toastify";
import { storageService } from "../Service/storageService";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export const useAuthRedirect = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Updated public routes to match your actual routes from main.tsx
    const publicRoutes = ["/", "/sign-in", "/sign-up"];

    // Handle OAuth callback
    if (pathname === "/auth/callback") {
      console.log('🔵 Callback page hit');
      
      const encodedData = searchParams.get("data");
      const token = searchParams.get("token");
      
      console.log('📦 Encoded data:', encodedData ? 'exists' : 'null');
      console.log('🎫 Token:', token ? 'exists' : 'null');

      // NEW FORMAT: Full response data
      if (encodedData) {
        try {
          console.log('✅ Processing encoded data');
          const response = JSON.parse(atob(encodedData));
          console.log('📋 Decoded response:', response);

          if (response.success && response.accessToken && response.user) {
            const { accessToken } = response;
            
            // Decode JWT to get expiry
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const expiryTime = payload.exp * 1000;

            console.log('💾 Storing user data:', response);
            
            // Store user data
            storageService.setItem('user', response);
            localStorage.setItem('tokenExpiry', expiryTime.toString());
            
            toast.success(response.message || "Successfully logged in with Google!");
            navigate('/home'); // Changed from /dashboard to /home based on your routes
            return;
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error('❌ Error processing OAuth callback:', error);
          toast.error("Authentication failed. Please try again.");
          navigate('/sign-in');
          return;
        }
      }
      // OLD FORMAT: Just token
      else if (token) {
        try {
          console.log('⚠️ Processing legacy token format');
          
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('📋 JWT Payload:', payload);

          const userData = {
            accessToken: token,
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            walletAddress: payload.walletAddress,
            name: payload.name || payload.email?.split('@')[0]
          };

          console.log('💾 Storing user data (legacy):', userData);
          
          storageService.setItem('user', userData);
          
          const expiryTime = payload.exp * 1000;
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          
          toast.success("Successfully logged in with Google!");
          navigate('/home'); // Changed from /dashboard to /home
          return;
        } catch (error) {
          console.error('❌ Error processing OAuth token:', error);
          toast.error("Authentication failed. Please try again.");
          navigate('/sign-in');
          return;
        }
      }
      // NO DATA FOUND
      else {
        console.error('❌ No data or token found in URL');
        toast.error("No authentication data received.");
        navigate('/sign-in');
        return;
      }
    }

    // Skip auth check for public routes
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // Check authentication for protected routes
    const userData: any = storageService.getItem("user");
    const token = userData?.accessToken;
    const expiry = localStorage.getItem("tokenExpiry");

    // Check if token is expired
    if (expiry && Date.now() > Number(expiry)) {
      toast.error("Token expired. Please log in again.");
      storageService.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      navigate("/sign-in");
      return;
    }

    // Check if token or expiry is missing
    if (!token || !expiry) {
      storageService.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      navigate("/sign-in");
    }
  }, [pathname, searchParams, navigate]);
};