import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFieldArray, useWatch } from "react-hook-form";


const UseCasesSectionIFAC = ({ control, register, errors, watch, setValue, storedData }) => {
  const { fields: UseCaseFields, append: appendUseCase, remove: removeUseCase } = useFieldArray({
    control,
    name: "use_cases"
  });

  const addUseCase = () => {
    appendUseCase("");
  };

   const removeUseCaseAt = (index) => {
    removeUseCase(index);
  };

  return (
    <div className="form-field-group">
      <div className="mb-4">
        <Form.Label className="form-field-label">Use Cases</Form.Label>
        <Form.Text className="text-muted d-block mb-2">
          List of IFAC Use Cases the tool applies to
        </Form.Text>

        {UseCaseFields.map((field, index) => (
          <div key={field.id} className="d-flex align-items-center mb-2">
            <Form.Control
              type="text"
              className="form-control-lg form-primary-input me-2"
              placeholder="Enter UseCase"
              {...register(`use_cases.${index}`, {
                required: "Use Case is required"
              })}
              isInvalid={!!errors.use_cases?.[index]}
            />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeUseCase(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          variant="outline-primary"
          size="sm"
          onClick={addUseCase}
          className="mt-2"
        >
          + Add Use Case
        </Button>
      </div>
    </div>
  );
};

export default UseCasesSectionIFAC;
