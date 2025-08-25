import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setLoginStatus } from "../store/authentication/Authenticate";

export const useTokenExpirationCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds

      if (Date.now() >= expirationTime) {
        // Token is expired
        toast.error("session expired login again");
        dispatch(setLoginStatus({ isAuthenticated: false }));
        localStorage.removeItem("token"); // Remove token
        navigate("/"); // Navigate to login
      }
    }
  }, [navigate]); // Run this effect on every route change
};
