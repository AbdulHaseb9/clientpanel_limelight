import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import JSZip from "jszip";
import axios from "axios";

export const ApparelMessageRevision = ({ orderId }) => {
  const [apparelData, setApparelData] = useState({});

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/order/revision/single/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((resp) => {
        setApparelData(resp.data);
      })
      .catch((error) => {
        toast.error("Error fetching data:");
      });
  }, [orderId]);

  const { orderStatus, changes } = apparelData;
  const { customApparel } = changes || {};

  // Function to download all attachments as a ZIP file
  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();

    // Fetch each image as a blob and add to the zip
    const fetchPromises = customApparel.attachment.map(async (item, index) => {
      const response = await fetch(item.url);
      const blob = await response.blob();
      zip.file(`attachment_${index + 1}.png`, blob); // Adjust the file extension if needed
    });

    try {
      await Promise.all(fetchPromises);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "attachments.zip");
    } catch (error) {
      console.error("Error creating ZIP file: ", error);
    }
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Service Name + Order Id */}
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r to-[#065206] from-[#21973b]">
          <h1 className="text-2xl font-bold text-white">Custom Apparel</h1>
          <p className="mt-1 max-w-2xl text-sm text-green-100">
            Order # {orderId}
          </p>
          <p className="mt-1 max-w-2xl text-sm text-green-100">
            Status - {orderStatus}
          </p>
        </div>
        {/* Order Details */}
        <div className="border-t border-gray-200">
          <dl>
            {/* Order Title */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customApparel?.orderTitle}
              </dd>
            </div>
            {/* Garment GSM */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Garment GSM</dt>
              <dd className="mt-1 text-sm text-gray-900 space-x-6 sm:mt-0 sm:col-span-2">
                {customApparel?.garmentGSM}
              </dd>
            </div>
            {/* Garment Category */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Garment Category
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customApparel?.garmentCategory}
              </dd>
            </div>
            {/* Sizes */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Sizes</dt>
              <dd className="mt-1 text-sm text-gray-900 space-x-6 sm:mt-0 sm:col-span-2">
                {customApparel?.sizes && customApparel?.sizes.length > 0
                  ? customApparel?.sizes.map((item, index) => (
                      <span key={index}>
                        {item.size} ({item.quantity})
                        {index < customApparel.sizes.length - 1 && ", "}
                      </span>
                    ))
                  : "No sizes selected"}
              </dd>
            </div>
            {/* Colors */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Colors</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex space-x-2">
                {customApparel?.garmentColors &&
                  customApparel?.garmentColors.length > 0 &&
                  (() => {
                    const colorElements = [];
                    for (
                      let i = 0;
                      i < customApparel?.garmentColors.length;
                      i++
                    ) {
                      colorElements.push(
                        <div
                          key={i}
                          className="h-7 w-7 rounded-full"
                          style={{
                            backgroundColor: customApparel?.garmentColors[i],
                          }} // Set the background color using inline style
                        ></div>
                      );
                    }
                    return colorElements;
                  })()}
              </dd>
            </div>
            {/* Estimate Shipping Time */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Estimate Shipping Time
              </dt>
              <dd className="mt-1 text-sm text-gray-900 space-x-6 sm:mt-0 sm:col-span-2">
                {customApparel?.shippingEstimatedTime}
              </dd>
            </div>
            {/* Instructions */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Project Instructions
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customApparel?.otherInstructions}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {/* Attachments */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Attachments
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {customApparel?.attachment.map((item, i) => (
            <div
              key={i}
              className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <img
                src={item.url}
                alt={`Attachment ${i}`}
                width={100}
                height={100}
                className="w-full h-auto rounded"
              />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button
            onClick={handleDownloadAllAsZip}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          >
            Download ZIP
          </button>
        </div>
      </div>
    </main>
  );
};
