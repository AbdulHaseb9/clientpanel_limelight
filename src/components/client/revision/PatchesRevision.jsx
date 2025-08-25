import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const PatchesRevision = () => {
  const navigate = useNavigate();
  const { service, orderId } = useParams();

  const [patches, setPatches] = useState({
    orderTitle: "",
    designName: "",
    patchCategory: "",
    designColors: [],
    backing: "",
    designSize: {
      height: 0,
      width: 0,
    },
    estimatedDeliveryDate: "",
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
        setPatches(response.data.patches);

        // Ensure date is in the correct format (YYYY-MM-DD)
        const formattedDate = response.data.patches.estimatedDeliveryDate
          ? new Date(response.data.patches.estimatedDeliveryDate)
              .toISOString()
              .split("T")[0]
          : "";

        setPatches({
          ...response.data.patches,
          estimatedDeliveryDate: formattedDate, // Set the formatted date
        });
      } catch (error) {
        toast.error("Error fetching order data:");
      }
    };

    fetchOrderData();
  }, [orderId]);

  const colors = [
    { id: "red", label: "Red", hex: "#FF0000" },
    { id: "green", label: "Green", hex: "#00FF00" },
    { id: "blue", label: "Blue", hex: "#0000FF" },
    { id: "yellow", label: "Yellow", hex: "#FFFF00" },
    { id: "purple", label: "Purple", hex: "#800080" },
    { id: "orange", label: "Orange", hex: "#FFA500" },
  ];

  const handleColorChange = (color) => {
    setPatches((prevState) => {
      const newColors = prevState.designColors.includes(color)
        ? prevState.designColors.filter((c) => c !== color)
        : [...prevState.designColors, color];

      return { ...prevState, designColors: newColors };
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/order/revision/${orderId}`,
        { patches },
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

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <>
        {/* Order title */}
        <div className="space-y-2">
          <label htmlFor="title" className="font-semibold text-lg">
            Order Title :
          </label>
          <input
            type="text"
            id="title"
            disabled
            placeholder="Order Title"
            value={patches.orderTitle}
            onChange={(e) =>
              setPatches({ ...patches, orderTitle: e.target.value })
            }
            className="w-full px-2 py-1 border-2 rounded-md lg:py-2"
          />
        </div>

        {/* Patch Category */}
        <div className="space-y-2 flex flex-col">
          <label htmlFor="Category" className="font-semibold text-lg">
            Patch Category :
          </label>
          <select
            className="border-2 px-2 py-1 rounded-md"
            id="Category"
            value={patches.patchCategory}
            onChange={(e) =>
              setPatches({ ...patches, patchCategory: e.target.value })
            }
          >
            <option value="" disabled>
              Select Patch Category
            </option>
            <option value="Embroidery Patch">Embroidery Patch</option>
            <option value="Embroidery Puff Patch">Embroidery Puff Patch</option>
            <option value="Leather Patch">Leather Patch</option>
            <option value="Sublimation Patch">Sublimation Patch</option>
            <option value="Woven Patch">Woven Patch</option>
            <option value="Chenille Patch">Chenille Patch</option>
            <option value="PVC Patch">PVC Patch</option>
          </select>
        </div>

        {/* Design Color */}
        <div className="space-y-3">
          <label className="font-semibold text-lg">Select Design Colors:</label>
          <div className="mb-4 grid grid-cols-3 md:grid-cols-5 items-center">
            {colors.map(({ id, label, hex }) => (
              <div className="flex items-center mb-2" key={id}>
                <input
                  type="checkbox"
                  id={id}
                  checked={patches.designColors.includes(hex)}
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
            {patches.designColors.map((color) => (
              <div
                key={color}
                className="w-8 h-8 m-1 border border-gray-400 rounded"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        {/* Height & Width */}
        <div className="space-x-4 flex justify-between">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="width" className="font-semibold text-lg">
              Width :
            </label>
            <input
              type="number"
              min={0}
              step={"any"}
              id="width"
              placeholder="Width"
              value={patches.designSize.width}
              onChange={(e) =>
                setPatches((prev) => ({
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
          <div className="flex flex-col gap-y-2">
            <label htmlFor="height" className="font-semibold text-lg">
              Height :
            </label>
            <input
              type="number"
              min={0}
              step={"any"}
              id="height"
              placeholder="Height"
              value={patches.designSize.height}
              onChange={(e) =>
                setPatches((prev) => ({
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

        {/* Backing */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="backing" className="font-semibold text-lg">
            Select Backing :
          </label>
          <select
            className="border-2 px-2 py-1 rounded-md"
            value={patches.backing}
            id="backing"
            onChange={(e) =>
              setPatches({ ...patches, backing: e.target.value })
            }
          >
            <option value="" disabled>
              Select Backing Category
            </option>
            <option value="Iron on">Iron on</option>
            <option value="Heatpress">Heatpress</option>
            <option value="Velcro">Velcro</option>
            <option value="Peel & Stick">Peel & Stick</option>
          </select>
        </div>

        {/* Estimated Delivery Date */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="Delivery" className="font-semibold">
            Estimated Delivery Date :
          </label>
          <input
            type="date"
            id="Delivery"
            min={new Date().toISOString().split("T")[0]} // Set min to today's date
            value={patches.estimatedDeliveryDate}
            className="border-2 px-2 py-1 rounded-md"
            onChange={(e) =>
              setPatches({
                ...patches,
                estimatedDeliveryDate: e.target.value,
              })
            }
          />
        </div>

        {/* Any Other Instructions */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="instructions" className="font-semibold text-lg">
            Any Other Instructions :
          </label>
          <textarea
            placeholder="Any instructions"
            value={patches.otherInstructions}
            onChange={(e) =>
              setPatches((prev) => ({
                ...prev,
                otherInstructions: e.target.value,
              }))
            }
            className="w-full max-h-32 min-h-28 lg:max-h-36 scrollbar-hide p-2 border-2 rounded-md"
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
      </>
    </form>
  );
};
