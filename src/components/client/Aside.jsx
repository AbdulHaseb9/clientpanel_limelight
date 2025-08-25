import { Link, NavLink, useNavigate } from "react-router-dom";
import { SideLinks } from "./SideLinks";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import Logo from "/assets/logo2.svg";
import { setLoginStatus } from "../../store/authentication/Authenticate";
import toast from "react-hot-toast";

export const Aside = ({ respNav, SetRespNav }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showService, setShowService] = useState(false);

  // Handle Logout Function
  const handleLogout = () => {
    dispatch(setLoginStatus({ isAuthenticated: false, token: null }));
    navigate("/");
    toast.success("Logout Successfully")
  };

  return (
    <aside
      className={`h-screen w-full fixed top-0 ${
        respNav ? "left-0" : "-left-full"
      } bg-white border-t-2 border-r-2 border-white transition-all duration-150 z-50 md:static md:w-3/12 lg:w-2/12`}
    >
      <div className="py-4 px-">
        {/* Close Sidebar cross icon */}
        <div className="flex justify-end pr-3 mt-4 mb-7 md:hidden">
          <RxCross1 className="text-2xl" onClick={() => SetRespNav(false)} />
        </div>
        {/* LimeLight Logo */}
        <div className="px-4 pb-9">
          <img src={Logo} alt="LimeLight Logo" className="w-40" />
        </div>
        <ul className="space-y-2">
          {SideLinks.map(({ label, path, subNav }, index) => (
            <li key={index}>
              {path == "neworder" ? (
                // Place Order Drop-Down
                <button
                  className={`w-full text-left text-white bg-primary py-2 px-4 font-semibold 
                    hover:bg-green-700`}
                  onClick={() => setShowService(!showService)}
                >
                  {label}
                </button>
              ) : (
                // Another Pages
                <NavLink
                  to={!path ? "#" : path}
                  className={({ isActive }) =>
                    `block py-3 px-4 text-lg tracking-widest font-semibold hover:bg-green-700 text-white ${
                      isActive ? "text-primary bg-green-700" : "bg-primary"
                    }`
                  }
                >
                  {label}
                </NavLink>
              )}
              {/* Services */}
              {subNav && (
                <ul className={`ml-3 ${showService ? "block" : "hidden"}`}>
                  {subNav.map(({ label, path }, index) => (
                    <li key={index} className="my-2 ml-3">
                      <NavLink
                        to={path}
                        className={({ isActive }) =>
                          `text-sm flex py-2 px-2 text-white ${
                            isActive
                              ? "tracking-widest bg-green-900"
                              : "bg-green-600"
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {/* Logout */}
        <div className="flex justify-end px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-x-4 w-full btn border-2 border-green-600 text-primary hover:bg-green-600 hover:text-white transition px-4 py-2 font-medium text-2xl lg:text-base"
          >
            <FiLogOut className="text-xl" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
