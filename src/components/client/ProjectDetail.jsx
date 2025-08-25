import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ApparelMessage,
  DigitizingMessage,
  PatchesMessage,
  VectorMessage,
} from "./";
import axios from "axios";

export const ProjectDetail = () => {
  const navigate = useNavigate();
  const { service, orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Define the valid services
    const validServices = ["Digitizing", "Vector", "Custom Apparel", "Patches"];
    if (!validServices.includes(service)) {
      return navigate("/not-found");
    }
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/order/getorder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((resp) => {
        setOrderData(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="px-5 py-8 mb-40">
      {loading ? (
        <div className="h-full flex items-center text-xl">Loading...</div>
      ) : null}
      {error ? <div>Error: {error.message}</div> : null}
      {orderData && (
        <div>
          <div className="text-center">
            {/* <h1 className="text-2xl text-center mb-5 capitalize font-semibold tracking-wider border-b-2 border-bgLight inline-block">
              {service}
            </h1> */}
          </div>
          {/* Conditionally Render based on the service */}
          {service === "Digitizing" && <DigitizingMessage data={orderData} />}
          {service === "Vector" && <VectorMessage data={orderData} />}
          {service === "Custom Apparel" && <ApparelMessage data={orderData} />}
          {service === "Patches" && <PatchesMessage data={orderData} />}
        </div>
      )}
    </section>
  );
};
