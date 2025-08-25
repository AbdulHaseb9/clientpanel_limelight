import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import Notifications from "./Notifications";

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/order/getorder`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(response.data);
        setFilteredOrders(response.data); // Initialize filteredOrders with fetched data
        setLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on search query and selected month
  useEffect(() => {
    let filtered = orders;

    // Filter by search query (order title)
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        (
          order.vector.orderTitle ||
          order.digitizing.orderTitle ||
          order.customApparel.orderTitle ||
          order.patches.orderTitle
        )
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected month
    if (selectedMonth) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt); // Assuming `createdAt` is the order date
        return (
          orderDate.getMonth() === new Date(selectedMonth).getMonth() &&
          orderDate.getFullYear() === new Date(selectedMonth).getFullYear()
        );
      });
    }

    setFilteredOrders(filtered);
  }, [searchQuery, selectedMonth, orders]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="w-full px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col lg:items-center gap-y-3 lg:flex-row lg:justify-between">
        <h3 className="text-text text-center text-3xl font-medium ">
          My Orders
        </h3>
        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full lg:w-96 bg-white outline-none border border-gray-300 rounded-lg lg:rounded-full py-3 px-4"
          placeholder="Search Order Here..."
        />
        <div className="flex items-center gap-x-6 justify-between">
          <Notifications />
          <input
            type="month"
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3"
          />
        </div>
      </div>
      {/* Orders Container */}
      <div className="mt-3 bg-white rounded-lg py-4 px-2 lg:p-6">
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-1 rounded-lg bg-green-600 text-white"
              >
                <Link
                  to={`orders/${item.serviceType}/${item._id}`}
                  className="flex items-center"
                >
                  {/* Order Index */}
                  <div className="w-12 h-12 bg-secondary text-black rounded-lg flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  {/* Order Name */}
                  <div>
                    <h4 className="text-lg font-semibold w-28 truncate lg:w-auto">
                      {item.vector.orderTitle ||
                        item.digitizing.orderTitle ||
                        item.customApparel.orderTitle ||
                        item.patches.orderTitle}
                    </h4>
                    <span className="text-sm hidden md:block mr-4">
                      type: {item.serviceType}
                    </span>
                  </div>
                </Link>
                <div className="flex items-center justify-between lg:justify-end">
                  <span className="hidden md:block mr-4">
                    status: {item.orderStatus}
                  </span>
                  <Link
                    to={`editorder/${item.serviceType}/${item._id}`}
                    className="bg-secondary text-black font-semibold px-4 py-2 rounded-lg text-sm truncate w-20 md:w-auto"
                  >
                    Edit Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
