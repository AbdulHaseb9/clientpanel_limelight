import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const DigitizingRevision = () => {
  const navigate = useNavigate();
  const { service, orderId } = useParams();

  const [digitizing, setDigitizing] = useState({
    orderTitle: "",
    designName: "",
    designCategory: "",
    designSize: {
      height: 0,
      width: 0,
    },
    otherInstructions: "",
    attachment: [],
  });

  // Fetch order data on component mount
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/order/getorder/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data.digitizing);
        setDigitizing(response.data.digitizing); // Assuming response.data contains the order data
      } catch (error) {
        toast.error("Error fetching order data:");
      }
    };

    fetchOrderData();
  }, [orderId]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        // Change POST to PUT for updating the order
        `${import.meta.env.VITE_API_BASE_URL}/order/revision/${orderId}`, // Update the order endpoint
        { digitizing },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate("/clientpanel/revisions");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Order title */}
      <div className="space-y-2">
        <label htmlFor="order_title" className="font-semibold">
          Order Title :
        </label>
        <input
          type="text"
          required
          disabled
          placeholder="Order Title"
          value={digitizing.orderTitle}
          id="order_title"
          className="w-full px-2 py-1 border-2 rounded-md lg:py-2"
          onChange={(e) =>
            setDigitizing({ ...digitizing, orderTitle: e.target.value })
          }
        />
      </div>

      {/* Design Category */}
      <div className="space-y-2">
        <label htmlFor="design_name" className="font-semibold">
          Design Category :
        </label>
        <select
          value={digitizing.designCategory}
          required
          onChange={(e) =>
            setDigitizing({ ...digitizing, designCategory: e.target.value })
          }
          className="w-full px-2 py-1 border-2 rounded-md lg:py-2"
        >
          <option value="" disabled>
            Select Design Category
          </option>
          <option value={"Left Chest"}>Left Chest</option>
          <option value={"3D Puffs"}>3D Puffs</option>
          <option value={"Jacket Back"}>Jacket Back</option>
          <option value={"Applique"}>Applique</option>
        </select>
      </div>

      {/* Height & Width */}
      <div className="space-x-4 flex  justify-between">
        {/* Width */}
        <div className="space-y-2 flex flex-col">
          <label htmlFor="height" className="font-semibold">
            Height :
          </label>
          <input
            type="number"
            min={0}
            step={"any"}
            required
            id="height"
            placeholder="Width"
            value={digitizing.designSize.width}
            onChange={(e) =>
              setDigitizing((prev) => ({
                ...prev,
                designSize: {
                  ...prev.designSize,
                  width: e.target.value,
                },
              }))
            }
            className="w-24 py-1 px-2 border-2 rounded-md lg:py-2"
          />
        </div>
        {/* Height */}
        <div className="space-y-2 flex flex-col">
          <label htmlFor="width" className="font-semibold">
            Width :
          </label>
          <input
            type="number"
            required
            step={"any"}
            min={0}
            id="width"
            placeholder="Height"
            value={digitizing.designSize.height} // Set initial height value
            onChange={(e) =>
              setDigitizing((prev) => ({
                ...prev,
                designSize: {
                  ...prev.designSize,
                  height: e.target.value,
                },
              }))
            }
            className="w-24 py-1 px-2 border-2 rounded-md lg:py-2"
          />
        </div>
      </div>

      {/* Any Other Instructions */}
      <div className="space-y-3">
        <label htmlFor="instructions" className="font-semibold">
          Other Instructions :
        </label>
        <textarea
          id="instructions"
          placeholder="Any instructions"
          value={digitizing.otherInstructions}
          onChange={(e) =>
            setDigitizing((prev) => ({
              ...prev,
              otherInstructions: e.target.value,
            }))
          }
          className="w-full max-h-24 lg:max-h-36 scrollbar-hide p-2 border-2 rounded-md"
        ></textarea>
      </div>

      {/* Submit btn */}
      <div className="flex justify-center">
        <input
          type="submit"
          value="Submit"
          className="block py-2 px-5 rounded-lg bg-bgLight text-white cursor-pointer"
        />
      </div>
    </form>
  );
};
