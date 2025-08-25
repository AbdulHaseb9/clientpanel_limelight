import { useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import { IoFilterOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoginStatus } from "../../store/authentication/Authenticate";
import { HiBars3BottomLeft } from "react-icons/hi2";
import Logo from "/assets/logo2.svg";

export const Head = ({ respNav }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Dispatch an action to update the authentication state
    dispatch(setLoginStatus({ isAuthenticated: false, token: null }));

    // Redirect the user to the login page or home page
    navigate("/"); // Redirect to login page after logout
  };

  const [logoutLink, setLogoutLink] = useState(false);
  return (
    <header className="py-3 px-5 bg-white border-b-2 flex justify-between md:hidden">
      {/* LimeLight Logo */}
      <div className="flex items-center gap-2">
        <HiBars3BottomLeft
          onClick={() => respNav(true)}
          className="text-black text-2xl md:hidden"
        />
        <Link to={"/clientpanel"}>
          <img src={Logo} alt="LimeLight Logo" className="w-40" />
        </Link>
      </div>
      {/* Search Bar */}
      {/* <div className="hidden md:flex items-center px-3 border-2 border-primary rounded-full">
        <CiSearch className="text-xl" />
        <input
          type="text"
          placeholder="Search Order"
          className="bg-transparent outline-none px-1 w-72 text-sm"
        />
        <IoFilterOutline className="text-xl cursor-pointer" />
      </div> */}
      {/* Profile Image and Logout Links */}
      <div
        className="bg-background p-2 rounded-full cursor-pointer relative"
        onClick={() => setLogoutLink(!logoutLink)}
      >
        <img
          src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
          alt="User Profile Icon"
          className="w-8 object-contain"
        />
        {/* Logout Links */}
        <div
          className={`py-2 px-6 w-40 ${
            logoutLink ? "block" : "hidden"
          } absolute top-14 right-3 bg-white rounded-xl`}
        >
          <ul>
            <li className="pb-1 border-b-2 border-background">
              <Link to={'profile'}>Update Profile</Link>
            </li>
            <li className="pt-1" onClick={() => handleLogout()}>
              Logout
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
