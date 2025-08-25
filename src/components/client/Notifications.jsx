import { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = () => {
      axios
        .get(
          `${import.meta.env.VITE_API_BASE_URL}/user/getuser/notifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => setNotifications(res.data.notification))
        .catch((err) =>
          setNotifications([{ message: "Failed getting notifications" }])
        );
    };

    // Fetch notifications every 5 seconds (adjust interval as needed)
    const interval = setInterval(fetchNotifications, 5000);

    // Fetch notifications immediately on component mount
    fetchNotifications();

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const updatedNotiStatus = async () => {
    setShowNotifications(!showNotifications);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/user/update/notification/readstatus`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const unreadNotifications = notifications.filter((item) => !item.readStatus);

  return (
    <div className="relative">
      <button
        onClick={() => updatedNotiStatus()}
        className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
        aria-label="Notifications"
      >
        <FaBell className="text-2xl" />
        <span className="absolute inset-0 object-right-top -mr-6">
          <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
            {unreadNotifications.length}
          </div>
        </span>
      </button>
      <div
        className={`bg-white w-56 absolute -bottom-28 left-0 border-black h-32 border-2 p-5 rounded-lg lg:-bottom-28 lg:right-0 ${
          showNotifications ? "block" : "hidden"
        } overflow-y-scroll scrollbar-hide`}
      >
        {notifications.map((notification, index) => (
          <li
            type="i"
            key={index}
            className={`text-sm text-justify border-b-2 pb-2 ${
              !notification.readStatus ? "font-semibold" : null
            }`}
          >
            {notification.message}
            {/* </p> */}
          </li>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
