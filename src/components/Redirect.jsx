import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Redirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // This effect runs once when the component mounts
    // It will redirect to the login page immediately
    navigate("/login");
  }, []);
  return <div></div>;
};
