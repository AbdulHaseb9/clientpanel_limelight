import React, { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import toast from "react-hot-toast";

export const DigitizingMessageRevision = ({ orderId }) => {
  const [digitizingData, setDigitizingData] = useState({});

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
        setDigitizingData(resp.data);
      })
      .catch((error) => {
        toast.error("Error fetching data:");
      });
  }, [orderId]);

  const { orderStatus, changes, orderId: fetchedOrderId } = digitizingData;
  const { digitizing } = changes || {};

  // Function to download all attachments as a ZIP file
  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();
    const fetchPromises = digitizing?.attachment?.map(async (item, index) => {
      const response = await fetch(item.url);
      const blob = await response.blob();
      zip.file(`attachment_${index + 1}.png`, blob);
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
    <main className="min-h-screen max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
      {/* Order Id + Service Name + Order Details */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r to-[#065206] from-[#21973b]">
          <h1 className="text-2xl font-bold text-white">Digitizing</h1>
          <p className="mt-1 max-w-2xl text-sm text-green-100">
            Order # {fetchedOrderId}
          </p>
          <p className="mt-1 max-w-2xl text-sm text-green-100">
            Status - {orderStatus}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title :</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {digitizing?.orderTitle}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Design Size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-6">
                <span>Height: {digitizing?.designSize?.height || "N/A"}</span>
                <span className="font-bold">X</span>
                <span>Width: {digitizing?.designSize?.width || "N/A"}</span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Design Category
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {digitizing?.designCategory}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Project Instructions
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {digitizing?.otherInstructions}
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
        {digitizing?.attachment?.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {digitizing.attachment.map((item, i) => (
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
          </>
        ) : (
          <p>No attachments available</p>
        )}
      </div>
      <div className="mt-6">
        <button
          onClick={handleDownloadAllAsZip}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
        >
          Download ZIP
        </button>
      </div>
    </main>
  );
};
