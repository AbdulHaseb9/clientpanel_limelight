import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const PatchesMessage = ({ data }) => {
  const [patchesData, setPatchesData] = useState(data);
  const { _id, orderStatus, email, readStatus, patches } = patchesData;
  const [uploadFiles, setUploadFiles] = useState(patches.completeOrder);

  const handleDownloadAllAsZip = async () => {
    const zip = new JSZip();

    // Fetch each file as a blob and add to the zip with its original extension
    const fetchPromises = patches.attachment.map(async (item, index) => {
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
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);

        const blob = await response.blob();

        // Detect the file extension from the URL, or default to '.file' if none found
        const extension = fileUrl.split(".").pop() || "file";
        const fileName = `file_${index + 1}.${extension}`;

        // Add the file blob to the ZIP archive
        zip.file(fileName, blob);
      } catch (error) {
        console.error(`Error fetching file at ${fileUrl}:`, error);
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
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Service Name + Order Id */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r to-[#065206] from-[#21973b]">
            <h1 className="text-2xl font-bold text-white">Custom Patches</h1>
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
              {/* Order Title */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title :</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patches.orderTitle}
                </dd>
              </div>
              {/* Design Size */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Design Size
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-6">
                  <span>Height : {patches.designSize.height}</span>
                  <span className="font-bold">X</span>
                  <span>Width : {patches.designSize.width}</span>
                </dd>
              </div>
              {/* Patch Category */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Patch Category
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patches.patchCategory}
                </dd>
              </div>
              {/* Backing */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Backing</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-6">
                  {patches.backing}
                </dd>
              </div>
              {/* Colors */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Colors</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex space-x-2">
                  {patches.designColors &&
                    patches.designColors.length > 0 &&
                    (() => {
                      const colorElements = [];
                      for (let i = 0; i < patches.designColors.length; i++) {
                        colorElements.push(
                          <div
                            key={i}
                            className="h-7 w-7 rounded-full"
                            style={{ backgroundColor: patches.designColors[i] }} // Set the background color using inline style
                          ></div>
                        );
                      }
                      return colorElements;
                    })()}
                </dd>
              </div>
              {/* Delivery Date */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Estimate Delivery Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-6">
                  {new Date(patches.estimatedDeliveryDate).toLocaleDateString()}
                </dd>
              </div>
              {/* Instructions */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Project Instructions
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {patches.otherInstructions}
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
            {patches.attachment.map((item, i) => (
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
        </div>
        {/* Download ZIP Button */}
        <div className="mt-6">
          <button
            onClick={handleDownloadAllAsZip}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          >
            Download ZIP
          </button>
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
              item.endsWith(".png") ||
              item.endsWith(".jpg") ||
              item.endsWith(".jpeg");

            return (
              <div key={index}>
                {isImage ? (
                  <img src={item} alt={`File ${index}`} className="w-40" />
                ) : (
                  <>
                    <a
                      href={item}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-900 px-4 py-3 text-white"
                    >
                      View PDF
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
