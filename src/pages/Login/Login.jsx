import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoginStatus } from "../../store/authentication/Authenticate";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation to check if both email and password are filled
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/login`, // Adjust the API endpoint as per your backend
        loginData
      );

      if (response.status === 200) {
        const { token } = response.data; // Assume the token is returned in response

        // On successful login, dispatch the action to update the login status and token
        dispatch(setLoginStatus({ isAuthenticated: true, token }));

        toast.success("Login successfull!");

        // Navigate to the home page
        navigate("/clientpanel");
      }
    } catch (error) {
      // Handle login error and display backend error message
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage); // Show backend error message in toast
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h2>
        {/* Email Input Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Email
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
        </div>
        {/* Password Input Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};
