import { useParams } from "react-router-dom";
import {
  DigitizingMessageRevision,
  ApparelMessageRevision,
  PatchesMessageRevision,
  VectorMessageRevision,
} from "./";

export const SingleRevision = () => {
  const { service } = useParams();
  const { orderId } = useParams();

  return (
    <div className="flex justify-center items-center mt-5 mb-40">
      <div className="w-72 md:w-4/5 bg-white p-5 rounded-2xl space-y-7">
        <h2 className="capitalize mt-2 mb-4 text-center text-2xl">{service}</h2>
        {/* Render forms based on service type */}
        {service === "Digitizing" && (
          <DigitizingMessageRevision orderId={orderId} />
        )}
        {service === "Custom Apparel" && (
          <ApparelMessageRevision orderId={orderId} />
        )}
        {service === "Patches" && <PatchesMessageRevision orderId={orderId} />}
        {service === "Vector" && <VectorMessageRevision orderId={orderId} />}
      </div>
    </div>
  );
};
