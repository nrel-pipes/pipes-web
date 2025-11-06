import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFieldArray, useWatch } from "react-hook-form";


const ExpectedScenariosSection = ({ control, register, errors, watch, setValue, storedData, projectScenarios }) => {
  const { fields: scenarioFields, append: appendScenario, remove: removeScenario } = useFieldArray({
    control,
    name: "expectedScenarios"
  });

  // Watch expected scenarios to populate dropdown using useWatch to avoid re-renders
  const expectedScenarios = useWatch({ control, name: "expectedScenarios", defaultValue: [] }) || [];

  const addExpectedScenario = () => {
    appendScenario("");
  };

  return (
    <div className="form-field-group">
      <div className="mb-4">
        <Form.Label className="form-field-label">Expected Scenarios</Form.Label>
        <Form.Text className="text-muted d-block mb-2">
          List of expected model scenarios
        </Form.Text>

        {scenarioFields.map((field, index) => (
          <div key={field.id} className="d-flex align-items-center mb-2">
            <Form.Control
              type="text"
              className="form-control-lg form-primary-input me-2"
              placeholder="Enter scenario name"
              {...register(`expectedScenarios.${index}`, {
                required: "Scenario name is required"
              })}
              isInvalid={!!errors.expectedScenarios?.[index]}
            />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeScenario(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          variant="outline-primary"
          size="sm"
          onClick={addExpectedScenario}
          className="mt-2"
        >
          + Add Expected Scenario
        </Button>
      </div>
    </div>
  );
};

export default ExpectedScenariosSection;
