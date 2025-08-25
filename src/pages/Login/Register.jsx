import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // function that handles register when user submits data
  const handleregister = async (e) => {
    e.preventDefault();

    // Validation to check if all fields are filled
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/register`,
        registerData
      );

      // Handle success
      if (response.status === 201) {
        toast.success("Registration successful!");
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      // Handle error
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex sm:mt-[0%] mt-[20%] justify-center items-center min-h-screen bg-gray-100">
      {/* Registration  form */}
      <form
        onSubmit={handleregister}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Register
        </h2>
        {/* Username input field */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded"
            onChange={(e) =>
              setRegisterData({ ...registerData, username: e.target.value })
            }
          />
        </div>
        {/* Email input field */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded"
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />
        </div>
        {/* Password input field */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded"
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};
