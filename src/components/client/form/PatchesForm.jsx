import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const PatchesForm = () => {
  const navigate = useNavigate();
  const { service } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState("");

  const [patches, setPatches] = useState({
    orderTitle: "",
    patchCategory: "",
    designColors: [],
    backing: "",
    designSize: {
      height: 0,
      width: 0,
    },
    quantity: 0,
    estimatedDeliveryDate: "",
    otherInstructions: "",
    attachment: [],
  });

  // Store selected files in state
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setPatches((prev) => ({
        ...prev,
        attachment: filesArray,
      }));
    }
  };

  // Remove File from Selected Files
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );

    // Update the digitizing state to remove the file from attachment
    setPatches((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    patches.attachment = [];

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
      setLoading("Uploading Files....");
      const uploadImages = await Promise.all(uploadPromises); // Wait for all uploads to finish

      // Add the secure URLs returned by Cloudinary to the patches object
      uploadImages.forEach((resp) => {
        if (resp?.data?.secure_url) {
          patches.attachment.push({
            url: resp.data.secure_url,
            name: resp.data.original_filename,
          });
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/order/createorder/${service}`,
        { patches },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the access token here
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

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {loading ? (
        <div className="text-2xl text-center flex items-center justify-center gap-x-4">
          <div className="h-6 w-6 border-2 border-black rounded-full border-r-transparent animate-spin"></div>
          {loading}
        </div>
      ) : (
        // Form Data
        <>
          {/* Order title */}
          <div>
            <input
              type="text"
              required
              placeholder="Order Title"
              value={patches.orderTitle}
              onChange={(e) =>
                setPatches({ ...patches, orderTitle: e.target.value })
              }
              className="w-full px-2 py-1 border-2 rounded-md lg:py-2"
            />
          </div>

          {/* Patch Category */}
          <select
            className="border-2 px-2 py-1 rounded-md"
            required
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

          {/* Design Color */}
          <div>
            <label className="block mb-2">Select Design Colors:</label>
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
          <div className="space-x-4">
            <input
              type="number"
              step="any"
              min={0}
              required
              placeholder="Width"
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
            <span className="text-text">X</span>
            <input
              type="number"
              step="any"
              required
              min={0}
              placeholder="Height"
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

          {/* Backing */}
          <select
            className="border-2 px-2 py-1 rounded-md"
            value={patches.backing}
            required
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

          {/* Quantity */}
          <div className="">
            <input
              type="number"
              min={1}
              required
              placeholder="Quantity"
              onChange={(e) =>
                setPatches({ ...patches, quantity: e.target.value })
              }
              className="border-2 px-2 py-2 rounded-md"
            />
          </div>

          {/* Estimated Delivery Date */}
          <div>
            <label htmlFor="Delivery" className="block mb-4">
              Estimated Delivery Date :
            </label>
            <input
              type="date"
              id="Delivery"
              required
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
          <textarea
            placeholder="Any instructions"
            value={patches.otherInstructions}
            onChange={(e) =>
              setPatches((prev) => ({
                ...prev,
                otherInstructions: e.target.value,
              }))
            }
            className="w-full max-h-24 lg:max-h-36 scrollbar-hide p-2 border-2 rounded-md"
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
