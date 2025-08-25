import { useParams } from "react-router-dom";
import { ApparelRevision } from "./revision/ApparelRevision";
import { DigitizingRevision } from "./revision/DigitizingRevision";
import { PatchesRevision } from "./revision/PatchesRevision";
import { VectorRevision } from "./revision/VectorRevision";

export const EditOrder = () => {
  const { serviceType } = useParams();

  const renderFormFields = () => {
    switch (serviceType) {
      case "Custom Apparel":
        return <ApparelRevision />;
      case "Patches":
        return <PatchesRevision />;
      case "Vector":
        return <VectorRevision />;
      case "Digitizing":
        return <DigitizingRevision />;
      default:
        return navigate("/not-found");
    }
  };

  return (
    <div className="py-10">
      <h1 className="text-center my-5 text-2xl font-semibold">
        Edit {serviceType} Order
      </h1>
      <div className="flex flex-col items-center">{renderFormFields()}</div>
    </div>
  );
};
