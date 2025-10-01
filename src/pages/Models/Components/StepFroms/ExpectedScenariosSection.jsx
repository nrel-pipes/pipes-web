import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useFieldArray, useWatch } from "react-hook-form";


const ExpectedScenariosSection = ({ control, register, errors, watch, setValue, storedData, projectScenarios }) => {
  const { fields: scenarioFields, append: appendScenario, remove: removeScenario } = useFieldArray({
    control,
    name: "expectedScenarios"
  });

  const { fields: mappingFields, append: appendMapping, remove: removeMapping } = useFieldArray({
    control,
    name: "scenarioMappings"
  });

  // Watch expected scenarios to populate dropdown using useWatch to avoid re-renders
  const expectedScenarios = useWatch({ control, name: "expectedScenarios", defaultValue: [] }) || [];

  const addExpectedScenario = () => {
    appendScenario("");
  };

  const addScenarioMapping = () => {
    appendMapping({
      modelScenario: "",
      projectScenarios: [""],
      description: [""],
      other: {}
    });
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

      <hr className="my-5" />

      {/* Scenario Mappings Section */}
      <div className="mb-4">
        <Form.Label className="form-field-label">Scenario Mappings</Form.Label>
        <Form.Text className="text-muted d-block mb-2">
          Model scenarios and how they map to project scenarios
        </Form.Text>

        {mappingFields.map((field, mappingIndex) => (
          <div key={field.id} className="border rounded p-3 mb-3">
            <Row>
              <Col md={6}>
                <Form.Label className="form-field-label">Model Scenario</Form.Label>
                <Form.Select
                  className="form-control-lg form-primary-input"
                  {...register(`scenarioMappings.${mappingIndex}.modelScenario`, {
                    required: "Model scenario name is required"
                  })}
                  isInvalid={!!errors.scenarioMappings?.[mappingIndex]?.modelScenario}
                >
                  <option value="">Select a model scenario</option>
                  {expectedScenarios
                    .filter(scenario => scenario && scenario.trim() !== "")
                    .map((scenario, index) => (
                      <option key={index} value={scenario}>
                        {scenario}
                      </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.scenarioMappings?.[mappingIndex]?.modelScenario?.message}
                </Form.Control.Feedback>
              </Col>

              <Col md={6}>
                <Form.Label className="form-field-label">Project Scenarios</Form.Label>
                <Form.Select
                  className="form-control-lg form-primary-input"
                  {...register(`scenarioMappings.${mappingIndex}.projectScenarios.0`)}
                >
                  <option value="">Select a project scenario</option>
                  {projectScenarios.map((scenario, index) => (
                    <option key={index} value={scenario}>
                      {scenario}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Form.Label className="form-field-label">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="form-control-lg form-primary-input"
                  placeholder="Enter scenario description"
                  {...register(`scenarioMappings.${mappingIndex}.description.0`)}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-2">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeMapping(mappingIndex)}
              >
                Remove Mapping
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline-primary"
          size="sm"
          onClick={addScenarioMapping}
          className="mt-2"
        >
          + Add Scenario Mapping
        </Button>
      </div>
    </div>
  );
};

export default ExpectedScenariosSection;
