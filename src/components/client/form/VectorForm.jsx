import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const VectorForm = () => {
  const navigate = useNavigate();
  const { service } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState("");

  const [vector, setVector] = useState({
    orderTitle: "",
    designColors: [],
    designCategory: "",
    designSize: {
      height: 0,
      width: 0,
    },
    otherInstructions: "",
    attachment: [],
  });

  // Store selected files in state
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setVector((prev) => ({
        ...prev,
        attachment: filesArray, // This line can be removed to avoid directly modifying vector.attachment
      }));
    }
  };

  // Remove File from Selected Files
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );

    // Update the Vector state to remove the file from attachment
    setVector((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    vector.attachment = []; // Start with a fresh array to avoid duplication

    // Helper function to convert a file to an ArrayBuffer
    const getFileArrayBuffer = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // ArrayBuffer result
        reader.onerror = reject;
        reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
      });
    };

    // Map through selected files and upload each as an ArrayBuffer
    const uploadPromises = selectedFiles.map(async (file) => {
      try {
        const arrayBuffer = await getFileArrayBuffer(file); // Convert file to ArrayBuffer
        const data = new FormData();
        data.append(
          "file",
          new Blob([arrayBuffer], { type: file.type }),
          file.name
        ); // Create a Blob from ArrayBuffer

        // Add additional Cloudinary parameters
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        return axios.post(
          import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL,
          data
        );
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    });

    try {
      setLoading("Uploading files....");
      const uploadImages = await Promise.all(uploadPromises); // Wait for all uploads to finish

      // Add the secure URLs returned by Cloudinary to the vector object
      vector.attachment = uploadImages.map((resp) => ({
        url: resp?.data?.secure_url,
        name: resp.data.original_filename,
      }));

      setLoading("Placing Order....");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/order/createorder/${service}`,
        { vector },
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
      toast.error("Error creating order");
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
      {loading ? (
        <div className="text-2xl text-center flex items-center justify-center gap-x-4">
          <div className="h-6 w-6 border-2 border-black rounded-full border-r-transparent animate-spin"></div>
          {loading}
        </div>
      ) : (
        <>
          {/* Order title */}
          <div>
            <input
              type="text"
              required
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
            <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center">
              {colors.map(({ id, label, hex }) => (
                <div className="flex items-center mb-2" key={id}>
                  <input
                    type="checkbox"
                    id={id}
                    checked={vector.designColors.includes(hex)}
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
          <div className="space-x-4">
            <input
              type="number"
              step="any"
              min={0}
              required
              placeholder="Width"
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
            <span className="text-text">X</span>
            <input
              type="number"
              required
              step="any"
              min={0}
              placeholder="Height"
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

          {/* Multiple file input */}
          <input type="file" multiple required onChange={handleFileChange} />

          {/* Preview selected files */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3>File Previews:</h3>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative p-2">
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-16 object-contain"
                    />
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
