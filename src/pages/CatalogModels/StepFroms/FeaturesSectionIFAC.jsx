import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFieldArray, useWatch } from "react-hook-form";


const FeaturesSectionIFAC = ({ control, register, errors, watch, setValue, storedData }) => {
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features"
  });

  const addFeature = () => {
    appendFeature("");
  };

   const removeFeatureAt = (index) => {
    removeFeature(index);
  };

  return (
    <div className="form-field-group">
      <div className="mb-4">
        <Form.Label className="form-field-label">Features</Form.Label>
        <Form.Text className="text-muted d-block mb-2">
          List of tool features
        </Form.Text>

        {featureFields.map((field, index) => (
          <div key={field.id} className="d-flex align-items-center mb-2">
            <Form.Control
              type="text"
              className="form-control-lg form-primary-input me-2"
              placeholder="Enter Feature"
              {...register(`features.${index}`, {
                required: "Feature is required"
              })}
              isInvalid={!!errors.features?.[index]}
            />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeFeature(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          variant="outline-primary"
          size="sm"
          onClick={addFeature}
          className="mt-2"
        >
          + Add Feature
        </Button>
      </div>
    </div>
  );
};

export default FeaturesSectionIFAC;
