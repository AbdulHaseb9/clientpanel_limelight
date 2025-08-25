import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const DigitizingForm = () => {
  const navigate = useNavigate();
  const { service } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState("");

  const [digitizing, setDigitizing] = useState({
    orderTitle: "",
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
    }
  };

  // Remove File from Selected Files
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    digitizing.attachment = [];

    // Function to convert a file to an ArrayBuffer
    const getFileArrayBuffer = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // onloadend will fire once the file is loaded
        reader.onerror = reject; // If there's an error, reject the promise
        reader.readAsArrayBuffer(file); // Reads the file as an ArrayBuffer
      });
    };

    // Map through selected files and upload each
    const uploadPromises = selectedFiles.map(async (file) => {
      try {
        const arrayBuffer = await getFileArrayBuffer(file); // Convert file to ArrayBuffer

        // Create a new FormData instance to send the file and other data (you might need to modify this depending on server capabilities)
        const data = new FormData();
        data.append("file", new Blob([arrayBuffer]), file.name); // Create a Blob from the ArrayBuffer

        // Append additional data (for example, Cloudinary-specific parameters)
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        // Send the file as ArrayBuffer to the server (Cloudinary in this case)
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

      // Add the secure URLs returned by Cloudinary to the digitizing object
      uploadImages.forEach((resp) => {
        if (resp?.data?.secure_url) {
          digitizing.attachment.push({
            url: resp.data.secure_url,
            name: resp.data.original_filename,
          });
        }
      });

      setLoading("Placing Order");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/order/createorder/${service}`,
        { digitizing },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the access token here
          },
        }
      );

      toast.success(response.data.message);
      navigate("/clientpanel/order/placed");
      setLoading("");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
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
              value={digitizing.orderTitle}
              onChange={(e) =>
                setDigitizing({ ...digitizing, orderTitle: e.target.value })
              }
              className="w-full px-2 py-1 border-2 rounded-md lg:py-2"
            />
          </div>

          {/* Design Category */}
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

          {/* Height & Width */}
          <div className="space-x-4">
            <input
              type="number"
              step="any"
              min={0}
              required
              placeholder="Width"
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
            <span className="text-text">X</span>
            <input
              type="number"
              step="any"
              required
              min={0}
              placeholder="Height"
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

          {/* Any Other Instructions */}
          <textarea
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
