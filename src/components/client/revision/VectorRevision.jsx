import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const VectorRevision = () => {
  const navigate = useNavigate();
  const { service, orderId } = useParams();

  const [vector, setVector] = useState({
    orderTitle: "",
    designName: "",
    designColors: [],
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
        setVector(response.data.vector); // Assuming response.data contains the order data
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
        `${import.meta.env.VITE_API_BASE_URL}/order/revision/${orderId}`,
        { vector },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the access token here
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

  const colors = [
    { id: "white", label: "White", hex: "#FFFFFF" },
    { id: "black", label: "Black", hex: "#000000" },
    { id: "gold", label: "Gold", hex: "#FFD700" },
    { id: "red", label: "Red", hex: "#FF0000" },
    { id: "royal", label: "Royal", hex: "#002663" },
    { id: "navy", label: "Navy", hex: "#000080" },
    { id: "gray", label: "Gray", hex: "#808080" },
    { id: "kelly", label: "Kelly", hex: "#00B2EE" },
    { id: "orange", label: "Orange", hex: "#FFA500" },
    { id: "maroon", label: "Maroon", hex: "#800000" },
    { id: "purple", label: "Purple", hex: "#800080" },
    { id: "dark_green", label: "Dark Green", hex: "#006400" },
    { id: "cardinal", label: "Cardinal", hex: "#C41E3A" },
    { id: "emerald", label: "Emerald", hex: "#50C878" },
    { id: "columbia", label: "Columbia", hex: "#00468C" },
    { id: "brown", label: "Brown", hex: "#A52A2A" },
    { id: "pink", label: "Pink", hex: "#FFC0CB" },
    { id: "mid_blue", label: "Mid Blue", hex: "#7B68EE" },
    { id: "maize", label: "Maize", hex: "#F0DB4F" },
    { id: "tan", label: "Tan", hex: "#D2B48C" },
    { id: "texas_orange", label: "Texas Orange", hex: "#E25822" },
    { id: "cream", label: "Cream", hex: "#FFFDD0" },
    { id: "turquoise", label: "Turquoise", hex: "#40E0D0" },
    { id: "burnt_orange", label: "Burnt Orange", hex: "#E97451" },
    { id: "steel_gray", label: "Steel Gray", hex: "#708090" },
    { id: "dolphin", label: "Dolphin", hex: "#ADD8E6" },
    { id: "teal", label: "Teal", hex: "#008080" },
    { id: "cyan", label: "Cyan", hex: "#00FFFF" },
    { id: "light_maroon", label: "Light Maroon", hex: "#800000" },
    { id: "eggplant", label: "Eggplant", hex: "#6A287E" },
    { id: "hot_pink", label: "Hot Pink", hex: "#FF69B4" },
    { id: "avalanche_blue", label: "Avalanche Blue", hex: "#00468C" },
    { id: "lilac", label: "Lilac", hex: "#C8A2C8" },
    { id: "lime", label: "Lime", hex: "#00FF00" },
    { id: "bronze", label: "Bronze", hex: "#CD7F32" },
    { id: "lime/yellow", label: "Lime/Yellow", hex: "#FFFF00" },
    { id: "silver", label: "Silver", hex: "#C0C0C0" },
  ];

  const handleColorChange = (color) => {
    setVector((prevState) => {
      const newColors = prevState.designColors.includes(color)
        ? prevState.designColors.filter((c) => c !== color)
        : [...prevState.designColors, color];

      return { ...prevState, designColors: newColors };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <>
        {/* Order title */}
        <div>
          <input
            type="text"
            required
            disabled
            placeholder="Order Title"
            value={vector.orderTitle}
            onChange={(e) =>
              setVector({ ...vector, orderTitle: e.target.value })
            }
            className="w-full px-2 py-1 border-2 rounded-md lg:py-2"
          />
        </div>

        {/* Design Color */}
        <div>
          <label className="block mb-2">Select Design Colors:</label>
          <div className="mb-4 grid grid-cols-3 md:grid-cols-5 items-center">
            {colors.map(({ id, label, hex }) => (
              <div className="flex items-center mb-2" key={id}>
                <input
                  type="checkbox"
                  id={id}
                  checked={vector.designColors?.includes(hex)}
                  onChange={() => handleColorChange(hex)}
                />
                <label htmlFor={id} className="ml-2">
                  <span
                    className="block w-4 h-4 border border-gray-400 rounded"
                    style={{ backgroundColor: hex }}
                  ></span>
                  {label}
                </label>
              </div>
            ))}
          </div>

          <h3>Selected Colors:</h3>
          <div className="flex flex-wrap">
            {vector.designColors.map((color) => (
              <div
                key={color}
                className="w-8 h-8 m-1 border border-gray-400 rounded"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        {/* Design Category */}
        <select
          required
          className="border-2 px-2 py-1 rounded-md"
          value={vector.designCategory}
          onChange={(e) =>
            setVector({ ...vector, designCategory: e.target.value })
          }
        >
          <option value="" disabled>
            Design Category
          </option>
          <option value="Normal">Normal</option>
          <option value="Color Separation">Color Separation</option>
          <option value="Halftones">Halftones</option>
          <option value="4 Color CMYK">4 Color CMYK</option>
        </select>

        {/* Height & Width */}
        <div className="space-x-4 flex justify-between">
          {/* Width */}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="Width" className="font-semibold">
              Width :
            </label>
            <input
              type="number"
              min={0}
              step={"any"}
              required
              id="Width"
              placeholder="Width"
              value={vector.designSize.width}
              onChange={(e) =>
                setVector((prev) => ({
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
            <label htmlFor="Height" className="font-semibold">
              Height :
            </label>
            <input
              type="number"
              step={"any"}
              required
              min={0}
              id="Height"
              placeholder="Height"
              value={vector.designSize.height} // Set initial height value
              onChange={(e) =>
                setVector((prev) => ({
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
        <textarea
          placeholder="Any instructions"
          value={vector.otherInstructions}
          onChange={(e) =>
            setVector((prev) => ({
              ...prev,
              otherInstructions: e.target.value,
            }))
          }
          className="w-full min-h-28 max-h-28 lg:max-h-36 scrollbar-hide p-2 border-2 rounded-md"
        ></textarea>

        {/* Submit btn */}
        <div className="flex justify-center">
          <input
            type="submit"
            value="Update Order"
            className="block py-2 px-5 rounded-lg bg-bgLight text-white cursor-pointer"
          />
        </div>
      </>
    </form>
  );
};
