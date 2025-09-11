
import { useEffect, useState } from "react";

import { Minus, Plus } from "lucide-react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";


const ScenarioMappingsSection = ({ control, register, errors, watch, setValue, projectScenarios, storedData }) => {
  const [mappings, setMappings] = useState({});
  const [mappingIds, setMappingIds] = useState([]);
  const watchedMappings = watch("scenario_mappings", {});

  useEffect(() => {
    if (mappingIds.length === 0) {
      const defaultId = `mapping_default`;
      const defaultMapping = {
        model_scenario: "",
        project_scenarios: [],
        description: [""],
        other: {}
      };

      setMappings({ [defaultId]: defaultMapping });
      setValue("scenario_mappings", { [defaultId]: defaultMapping });
      setMappingIds([defaultId]);
    }
  }, [mappingIds.length, setValue]);

  useEffect(() => {
    setMappings(watchedMappings);
  }, [watchedMappings]);

  const addMapping = () => {
    const timestamp = Date.now();
    const newId = `mapping_${timestamp}`;
    const newMappings = {
      ...mappings,
      [newId]: {
        model_scenario: "",
        project_scenarios: [],
        description: [""],
        other: {}
      }
    };
    setMappings(newMappings);
    setValue("scenario_mappings", newMappings);
    setMappingIds([...mappingIds, newId]);
  };

  const removeMapping = (id) => {
    const { [id]: removed, ...rest } = mappings;
    setMappings(rest);
    setValue("scenario_mappings", rest);
    setMappingIds(mappingIds.filter(mappingId => mappingId !== id));
  };

  const updateMapping = (id, field, value) => {
    const newMappings = {
      ...mappings,
      [id]: {
        ...mappings[id],
        [field]: value
      }
    };
    setMappings(newMappings);
    setValue("scenario_mappings", newMappings);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Scenario Mappings</span>
      </Form.Label>
      <div>
        {mappingIds.map((id, idx) => {
          const mappingData = mappings[id];
          if (!mappingData) return null;

          return (
            <div key={id} className="mb-4 border p-3 rounded">
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Label className="small fw-bold">Model Scenario</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg form-primary-input"
                    placeholder="Model scenario name"
                    value={mappingData.model_scenario || ""}
                    onChange={(e) => updateMapping(id, "model_scenario", e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="small fw-bold">Project Scenarios</Form.Label>
                  <Form.Select
                    className="form-control-lg"
                    multiple
                    value={mappingData.project_scenarios || []}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      updateMapping(id, "project_scenarios", selectedOptions);
                    }}
                  >
                    {projectScenarios.map((scenario, idx) => (
                      <option key={idx} value={scenario}>
                        {scenario}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Label className="small fw-bold">Description</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      className="form-control-lg form-primary-input"
                      placeholder="Mapping description"
                      value={mappingData.description?.[0] || ""}
                      onChange={(e) => updateMapping(id, "description", [e.target.value])}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => removeMapping(id)}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "38px", padding: "4px" }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          );
        })}
        <div className="d-flex justify-content-start mt-2">
          <Button
            variant="outline-primary"
            type="button"
            onClick={addMapping}
            className="d-flex align-items-center me-2"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Plus className="mr-1" size={16} />
            Scenario Mapping
          </Button>
        </div>
      </div>
    </div>
  );
};


export default ScenarioMappingsSection;
