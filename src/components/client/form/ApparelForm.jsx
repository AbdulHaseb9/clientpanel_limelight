import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const ApparelForm = () => {
  const navigate = useNavigate();
  const { service } = useParams();
  const [loading, setLoading] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

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

  // Store selected files in state
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter(
        (file) => file.size > 0
      ); // Exclude empty files
      setSelectedFiles(filesArray);
      setCustomApparel((prev) => ({
        ...prev,
        attachment: filesArray,
      }));
    }
  };

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

  // Remove File from Selected Files
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );

    // Update the digitizing state to remove the file from attachment
    setCustomApparel((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const getFileArrayBuffer = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    };

    // Map through selected files and upload each as an ArrayBuffer
    const uploadPromises = selectedFiles.map(async (file) => {
      try {
        const arrayBuffer = await getFileArrayBuffer(file);
        const data = new FormData();
        data.append(
          "file",
          new Blob([arrayBuffer], { type: file.type }),
          file.name
        );
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const response = await axios.post(
          import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL,
          data
        );
        console.log(response.data);
        return {
          url: response?.data?.secure_url,
          name: response.data.original_filename,
        }; // Return the URL if upload succeeds
      } catch (error) {
        console.error("Error uploading file:", error);
        return null; // Return null for failed uploads
      }
    });

    try {
      setLoading("Uploading Files....");
      const uploadedURLs = await Promise.all(uploadPromises);

      console.log("upload", uploadedURLs);
      // Remove empty or failed uploads
      const validURLs = uploadedURLs.filter(Boolean);
      console.log("valid", validURLs);

      // Update `attachment` with only valid URLs
      setCustomApparel((prev) => ({
        ...prev,
        attachment: validURLs.map((url) => ({ url })),
      }));

      setLoading("Placing Order");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/order/createorder/${service}`,
        { customApparel: { ...customApparel, attachment: validURLs } },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message);
      setLoading("");
      navigate("/clientpanel/order/placed");
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
    setCustomApparel((prevState) => {
      const newColors = prevState.garmentColors.includes(color)
        ? prevState.garmentColors.filter((c) => c !== color)
        : [...prevState.garmentColors, color];

      return { ...prevState, garmentColors: newColors };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {loading ? (
        <div className="text-2xl text-center flex items-center justify-center gap-x-4">
          <div className="h-6 w-6 border-2 border-black rounded-full border-r-transparent animate-spin"></div>
          {loading}
        </div>
      ) : (
        <>
          {/* Order Title */}
          <div>
            <input
              type="text"
              required
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
            {/* Colors */}
            <label className="block mb-2">Select Design Colors:</label>
            <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center">
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
          <div className="space-x-4">
            <input
              type="number"
              step={"any"}
              required
              min={0}
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

          {/* Sizes */}
          <div>
            <h2>Select Sizes and Quantities</h2>
            <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  items-center">
              {availableSizes.map((size) => (
                <div
                  key={size}
                  className="w-full flex items-center space-x-2 mb-2"
                >
                  <input
                    type="checkbox"
                    id={`size-${size}`}
                    onChange={(e) =>
                      handleSizeChange(size, e.target.checked ? 1 : 0)
                    }
                  />
                  <label htmlFor={`size-${size}`}>{size}</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    onChange={(e) =>
                      handleSizeChange(size, parseInt(e.target.value) || 0)
                    }
                    disabled={!customApparel.sizes.some((s) => s.size === size)}
                    className="px-2 py-1 w-20"
                  />
                </div>
              ))}
            </div>
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

          {/* Multiple file input */}
          <input type="file" multiple required onChange={handleFileChange} />

          {/* Preview selected files */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3>File Previews:</h3>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative p-2">
                    {file instanceof File && (
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-16 object-contain"
                        alt="preview"
                      />
                    )}
                    <p className="text-xs mt-1 w-18 truncate">{file.name}</p>

                    {/* X button to remove the file */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit btn */}
          <div className="flex justify-center">
            <input
              type="submit"
              value="Submit"
              className="block py-2 px-5 rounded-lg bg-bgLight text-white cursor-pointer"
            />
          </div>
        </>
      )}
    </form>
  );
};
