import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const ApparelRevision = () => {
  const navigate = useNavigate();
  const { service, orderId } = useParams();

  const [customApparel, setCustomApparel] = useState({
    orderTitle: "",
    garmentCategory: "",
    garmentColors: [],
    garmentGSM: 0,
    sizes: [],
    quantity: 0,
    shippingEstimatedTime: "",
    otherInstructions: "",
    attachment: [],
  });

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
        console.log(response.data.customApparel);
        setCustomApparel(response.data.customApparel); // Assuming response.data contains the order data
      } catch (error) {
        toast.error("Error fetching order data:");
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/order/revision/${orderId}`,
        { customApparel },
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

  // Available sizes
  const availableSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  // Handle checkbox and quantity input change
  const handleSizeChange = (size, quantity) => {
    setCustomApparel((prevState) => {
      const updatedSizes = [...prevState.sizes];
      const index = updatedSizes.findIndex((s) => s.size === size);

      if (quantity > 0) {
        // If size is already in the array, update its quantity
        if (index > -1) {
          updatedSizes[index].quantity = quantity;
        } else {
          // Otherwise, add new size with its quantity
          updatedSizes.push({ size, quantity });
        }
      } else if (index > -1) {
        // Remove size if quantity is zero or checkbox is unchecked
        updatedSizes.splice(index, 1);
      }

      return { ...prevState, sizes: updatedSizes };
    });
  };

  const handleColorChange = (color) => {
    setCustomApparel((prevState) => {
      const newColors = prevState.garmentColors.includes(color)
        ? prevState.garmentColors.filter((c) => c !== color)
        : [...prevState.garmentColors, color];

      return { ...prevState, garmentColors: newColors };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <>
        {/* Order Title */}
        <div>
          <input
            type="text"
            required
            disabled
            placeholder="Order Title"
            value={customApparel.orderTitle}
            onChange={(e) =>
              setCustomApparel({
                ...customApparel,
                orderTitle: e.target.value,
              })
            }
            className="w-full px-2 py-1 border-2 rounded-md lg:py-2"
          />
        </div>

        {/* Garment Category */}
        <select
          required
          className="border-2 px-2 py-1 rounded-md"
          value={customApparel.garmentCategory}
          onChange={(e) =>
            setCustomApparel({
              ...customApparel,
              garmentCategory: e.target.value,
            })
          }
        >
          <option value="" disabled>
            Select Garment Category
          </option>
          <option value="Hoodie">Hoodie</option>
          <option value="Tshirt">Tshirt</option>
          <option value="Sweatshirt">Sweatshirt</option>
          <option value="Sweat Suit">Sweat Suit</option>
          <option value="Shorts">Shorts</option>
          <option value="Top Tanks">Top Tanks</option>
          <option value="Sports Jersey">Sports Jersey</option>
          <option value="Sports Uniform">Sports Uniform</option>
          <option value="College Uniform">College Uniform</option>
          <option value="Caps">Caps</option>
          <option value="Varsity Jacket">Varsity Jacket</option>
          <option value="Leather Jacket">Leather Jacket</option>
          <option value="Socks">Socks</option>
          <option value="Gloves">Gloves</option>
        </select>

        {/* Garment Color */}
        <div>
          <label className="block mb-2">Select Design Colors:</label>
          <div className="mb-4 grid grid-cols-3 md:grid-cols-5 items-center">
            {colors.map(({ id, label, hex }) => (
              <div className="flex items-center mb-2" key={id}>
                <input
                  type="checkbox"
                  id={id}
                  checked={customApparel.garmentColors.includes(hex)}
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
          {/* Selected Colors */}
          <h3>Selected Colors:</h3>
          <div className="flex flex-wrap">
            {customApparel.garmentColors.map((color) => (
              <div
                key={color}
                className="w-8 h-8 m-1 border border-gray-400 rounded"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        {/* Garment GSM */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="GSM" className="font-semibold">
            Garment GSM :
          </label>
          <input
            type="number"
            required
            min={0}
            step={"any"}
            id="GSM"
            value={customApparel.garmentGSM}
            placeholder="Garment GSM"
            onChange={(e) =>
              setCustomApparel({
                ...customApparel,
                garmentGSM: e.target.value,
              })
            }
            className="w-40 py-1 px-2 border-2 rounded-md lg:py-2"
          />
        </div>

        {/* Sizes and Quantities */}
        <h2>Select Sizes and Quantities</h2>
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
          {availableSizes.map((size) => {
            const selectedSize = customApparel.sizes.find(
              (s) => s.size === size
            );
            const quantity = selectedSize ? selectedSize.quantity : 0;

            return (
              <div
                key={size}
                className="w-full flex items-center space-x-2 mb-2"
              >
                <input
                  type="checkbox"
                  checked={quantity > 0}
                  onChange={(e) =>
                    handleSizeChange(size, e.target.checked ? 1 : 0)
                  }
                />
                <label>{size}</label>
                <input
                  type="number"
                  min="1"
                  step={"any"}
                  placeholder="Quantity"
                  value={quantity > 0 ? quantity : ""}
                  onChange={(e) =>
                    handleSizeChange(size, parseInt(e.target.value) || 0)
                  }
                  disabled={!selectedSize}
                  className="px-2 py-1 w-20"
                />
              </div>
            );
          })}
        </div>

        {/* Estimated Shipping Time */}
        <div>
          <label htmlFor="Delivery" className="block mb-4">
            Estimated Delivery Date :
          </label>
          <input
            type="date"
            required
            id="Delivery"
            value={customApparel.shippingEstimatedTime}
            min={new Date().toISOString().split("T")[0]} // Set min to today's date
            className="border-2 px-2 py-1 rounded-md"
            onChange={(e) =>
              setCustomApparel({
                ...customApparel,
                shippingEstimatedTime: e.target.value,
              })
            }
          />
        </div>

        {/* Any Other Instructions */}
        <textarea
          placeholder="Any instructions"
          value={customApparel.otherInstructions}
          onChange={(e) =>
            setCustomApparel((prev) => ({
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
            value="Submit"
            className="block py-2 px-5 rounded-lg bg-bgLight text-white cursor-pointer"
          />
        </div>
      </>
    </form>
  );
};
