import { useParams } from "react-router-dom";
import { DigitizingForm, ApparelForm, PatchesForm, VectorForm } from "./";

export const NewOrderForm = () => {
  const { service } = useParams();

  return (
    <div className="flex justify-center items-center mt-5 mb-40">
      <div className="w-72 md:w-4/5 bg-white p-5 rounded-2xl space-y-7">
        <h2 className="capitalize mt-2 mb-4 text-center text-2xl">{service}</h2>
        {/* Render forms based on service type */}
        {service === "Digitizing" && <DigitizingForm />}
        {service === "Custom Apparel" && <ApparelForm />}
        {service === "Patches" && <PatchesForm />}
        {service === "Vector" && <VectorForm />}
      </div>
    </div>
  );
};
