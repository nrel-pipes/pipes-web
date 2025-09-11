import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFieldArray } from "react-hook-form";


const AssumptionsSection = ({ control, register, errors, watch, setValue, storedData, projectRun }) => {
  const { fields: assumptionFields, append: appendAssumption, remove: removeAssumption } = useFieldArray({
    control,
    name: "assumptions"
  });


  const addAssumption = () => {
    appendAssumption("");
  };

  const removeAssumptionAt = (index) => {
    removeAssumption(index);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Assumptions</span>
      </Form.Label>
      <Form.Text className="text-muted d-block mb-3">
        Add key assumptions for your model
      </Form.Text>

      {assumptionFields.map((field, index) => (
        <div key={field.id} className="mb-3">
          <div className="d-flex align-items-start">
            <Form.Control
              as="textarea"
              rows={2}
              className="form-control-lg form-primary-input me-2"
              placeholder={`Assumption ${index + 1}`}
              {...register(`assumptions.${index}`, {
                required: "Assumption cannot be empty"
              })}
              isInvalid={!!errors.assumptions?.[index]}
            />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeAssumptionAt(index)}
              disabled={assumptionFields.length === 1}
            >
              Remove
            </Button>
          </div>
          {errors.assumptions?.[index] && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.assumptions[index]?.message}
            </Form.Control.Feedback>
          )}
        </div>
      ))}

      <Button
        variant="outline-primary"
        size="sm"
        onClick={addAssumption}
        className="mt-2"
      >
        + Add Assumption
      </Button>
    </div>
  );
};


export default AssumptionsSection;

