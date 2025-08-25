import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Revisions = () => {
  const [revision, setRevision] = useState([]);

  useEffect(() => {
    const fetchRevision = () => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/order/get/revision`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((resp) => {
          setRevision(resp.data.revisions);
        })
        .catch((error) => {
          console.error("Error fetching revisions:", error);
        });
    };
    fetchRevision();
  }, []);

  return (
    <div className="w-full px-4 lg:px-6 py-8">
      <div className="mt-3 bg-white rounded-lg py-4 px-2 lg:p-6">
        <h1 className="text-center my-5 text-3xl">Revisions</h1>
        {revision.length === 0 ? (
          <p className="text-center">No Revisions Found.</p>
        ) : (
          <div className="space-y-4">
            {revision.map((item, index) => {
              const serviceType = item.changes?.digitizing
                ? "Digitizing"
                : item.changes?.vector
                ? "Vector"
                : item.changes?.customApparel
                ? "Custom Apparel"
                : item.changes?.patches
                ? "Patches"
                : null;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-1 rounded-lg bg-green-600 text-white`}
                >
                  <Link
                    to={`${serviceType}/${item.orderId}`}
                    className="flex items-center"
                  >
                    {/* Order Index */}
                    <div className="w-12 h-12 bg-secondary text-black rounded-lg flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </div>
                    {/*  Order Name */}
                    <div>
                      <h4 className="text-lg font-semibold w-28 truncate text-ellipsis lg:w-auto">
                        {item.changes.digitizing?.orderTitle ||
                          item.changes.vector?.orderTitle ||
                          item.changes.customApparel?.orderTitle ||
                          item.changes.patches?.orderTitle}
                      </h4>
                      <span className="text-sm hidden md:block mr-4">
                        type : {Object.keys(item.changes).join(", ")}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between lg:justify-end">
                    <span className="hidden md:block mr-4">
                      status : {item.orderStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
