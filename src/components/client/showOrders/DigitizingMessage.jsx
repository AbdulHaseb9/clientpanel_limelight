import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const DigitizingMessage = ({ data }) => {
  const [digitizingData, setDigitizingData] = useState(data);
  const { orderStatus, email, readStatus, digitizing, _id } = digitizingData;
  const [uploadFiles, setUploadFiles] = useState(digitizing.completeOrder);

  // Function to download all attachments as a ZIP file
  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();

    // Fetch each file as a blob and add to the zip with its original extension
    const fetchPromises = digitizing.attachment.map(async (item, index) => {
      try {
        const response = await fetch(item.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${item.url}`);
        }
        const blob = await response.blob();

        // Detect file extension from URL or default to .png if none is found
        const extension = item.url.split(".").pop() || "png";
        zip.file(`attachment_${index + 1}.${extension}`, blob);
      } catch (error) {
        console.error(`Error fetching file at ${item.url}:`, error);
      }
    });

    try {
      await Promise.all(fetchPromises); // Wait for all fetches to complete
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "attachments.zip");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
    }
  };

  const downloadFiles = async () => {
    const zip = new JSZip();

    // Fetch each file as a blob and add it to the ZIP file
    const fetchPromises = uploadFiles.map(async (fileUrl, index) => {
      try {
        const response = await fetch(fileUrl.url);
        if (!response.ok) throw new Error(`Failed to fetch ${fileUrl.url}`);

        const blob = await response.blob();

        // Detect the file extension from the URL, or default to '.file' if none found
        const extension = fileUrl.url.split(".").pop() || "file";
        const fileName = `file_${index + 1}.${extension}`;

        // Add the file blob to the ZIP archive
        zip.file(fileName, blob);
      } catch (error) {
        console.error(`Error fetching file at ${fileUrl.url}:`, error);
      }
    });

    try {
      // Wait for all fetches to complete and add to ZIP
      await Promise.all(fetchPromises);

      // Generate the ZIP file and trigger the download
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "downloaded_files.zip");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
    }
  };

  return (
    <>
      <main className="min-h-screen max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        {/* Order Id + Service Name + Order Details */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Service Name + Order Id */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r to-[#065206] from-[#21973b]">
            <h1 className="text-2xl font-bold text-white">Digitizing</h1>
            <p className="mt-1 max-w-2xl text-sm text-green-100">
              Order # {_id}
            </p>
            <p className="mt-1 max-w-2xl text-sm text-green-100">
              Status - {orderStatus}
            </p>
          </div>
          {/* Order Details */}
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title :</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {digitizing.orderTitle}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Design Size
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-6">
                  <span>Height : {digitizing.designSize.height}</span>
                  <span className="font-bold">X</span>
                  <span>Width : {digitizing.designSize.width}</span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Design Category
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {digitizing.designCategory}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Project Instructions
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {digitizing.otherInstructions}
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
      {uploadFiles.length > 0 && (
        <div>
          <h1 className="text-center text-3xl font-semibold">
            Congratulation Your Order Completed
          </h1>
          <div className="text-center">
            <button
              onClick={downloadFiles}
              className="bg-green-400 px-4 py-3 my-3 text-white"
            >
              Download Files
            </button>
          </div>
          {uploadFiles.map((item, index) => {
            // Check the file extension to determine if it is an image
            const isImage =
              item.url.endsWith(".png") ||
              item.url.endsWith(".jpg") ||
              item.url.endsWith(".jpeg");

            return (
              <div key={index}>
                {isImage ? (
                  <img src={item.url} alt={`File ${index}`} className="w-40" />
                ) : (
                  <>
                    <a
                      href={item.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-900 px-4 py-3 text-white"
                    >
                      file
                    </a>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
