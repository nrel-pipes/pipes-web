
import { useEffect, useState } from "react";

import { Minus, Plus } from "lucide-react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";


// RequirementsSection for model creation
const RequirementsSection = ({ control, register, errors, watch, setValue, storedData }) => {
  // Use storedData for initial state if present and not empty
  const initialRequirements = Object.keys(storedData.requirements || {}).length > 0
    ? storedData.requirements
    : { req_default: { name: "", type: "string", value: "" } };

  const [requirements, setRequirements] = useState(initialRequirements);
  const [requirementIds, setRequirementIds] = useState(Object.keys(initialRequirements));

  // Prefill from zustand store if available when mounting or when storedData changes
  useEffect(() => {
    if (Object.keys(storedData.requirements || {}).length > 0) {
      setRequirements(storedData.requirements);
      setRequirementIds(Object.keys(storedData.requirements));
      setValue("requirements", storedData.requirements);
    }
  }, [storedData, setValue]);

  const addRequirement = () => {
    const timestamp = Date.now();
    const newId = `req_${timestamp}`;
    const newRequirements = {
      ...requirements,
      [newId]: {
        name: "",
        type: "string",
        value: ""
      }
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
    setRequirementIds([...requirementIds, newId]);
  };

  const removeRequirement = (id) => {
    const { [id]: removed, ...rest } = requirements;
    setRequirements(rest);
    setValue("requirements", rest);
    setRequirementIds(requirementIds.filter(reqId => reqId !== id));
  };

  const updateRequirementName = (id, newName) => {
    const newRequirements = {
      ...requirements,
      [id]: {
        ...requirements[id],
        name: newName
      }
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const updateRequirementValue = (id, value) => {
    const newRequirements = {
      ...requirements,
      [id]: {
        ...requirements[id],
        value: value
      }
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const toggleRequirementType = (id) => {
    const currentType = requirements[id]?.type;
    const newType = currentType === "string" ? "object" : "string";
    let newValue;
    if (newType === "string") {
      newValue = "";
    } else {
      newValue = { "": "", "": "" };
    }
    const newRequirements = {
      ...requirements,
      [id]: {
        ...requirements[id],
        type: newType,
        value: newValue
      }
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const addObjectField = (reqId) => {
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    const updatedValue = {
      ...reqData.value,
      [""]: ""
    };
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const updateObjectFieldValue = (reqId, fieldKey, fieldValue) => {
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    const updatedValue = {
      ...reqData.value,
      [fieldKey]: fieldValue
    };
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const updateObjectFieldKey = (reqId, oldKey, newKey) => {
    if (!newKey || oldKey === newKey) return;
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    if (Object.prototype.hasOwnProperty.call(reqData.value, newKey) && oldKey !== newKey) {
      return;
    }
    const updatedValue = {};
    Object.entries(reqData.value).forEach(([key, value]) => {
      if (key === oldKey) {
        updatedValue[newKey] = value;
      } else {
        updatedValue[key] = value;
      }
    });
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  const removeObjectField = (reqId, fieldKey) => {
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;
    const fieldKeys = Object.keys(reqData.value || {});
    if (fieldKeys.length <= 1) return;
    const updatedValue = {};
    Object.entries(reqData.value).forEach(([key, value]) => {
      if (key !== fieldKey) {
        updatedValue[key] = value;
      }
    });
    const updatedRequirement = {
      ...reqData,
      value: updatedValue
    };
    const newRequirements = {
      ...requirements,
      [reqId]: updatedRequirement
    };
    setRequirements(newRequirements);
    setValue("requirements", newRequirements);
  };

  return (
    <div className="form-field-group">
      <Form.Label className="form-field-label">
        <span className="form-field-text">Requirements</span>
      </Form.Label>
      <div>
        {requirementIds.map((id, idx) => {
          const reqData = requirements[id];
          if (!reqData) return null;
          return (
            <div key={id} className="mb-4 border p-3 rounded">
              <Row className="mb-2">
                <Col>
                  <Form.Label className="small fw-bold">Requirement Name</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      className="form-control-lg form-primary-input"
                      placeholder="Requirement"
                      value={reqData.name || ""}
                      onChange={(e) => updateRequirementName(id, e.target.value)}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      type="button"
                      onClick={() => removeRequirement(id)}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "38px", padding: "4px" }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="small fw-bold mb-0">Value</Form.Label>
                    <Form.Check
                      type="switch"
                      id={`req-type-switch-${idx}`}
                      label="Object"
                      checked={reqData.type === "object"}
                      onChange={() => toggleRequirementType(id)}
                    />
                  </div>
                  {reqData.type === "string" ? (
                    <Form.Control
                      type="text"
                      className="form-control-lg form-primary-input"
                      placeholder="Value"
                      value={reqData.value || ""}
                      onChange={(e) => updateRequirementValue(id, e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded">
                      {Object.keys(reqData.value || {}).map((fieldKey) => (
                        <Row key={`${id}-${fieldKey}`} className="mb-2">
                          <Col>
                            <Form.Control
                              type="text"
                              className="form-control-sm"
                              placeholder="Field Name"
                              defaultValue={fieldKey}
                              onBlur={(e) => updateObjectFieldKey(id, fieldKey, e.target.value)}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="text"
                              className="form-control-sm"
                              placeholder="Field Value"
                              value={reqData.value[fieldKey] || ""}
                              onChange={(e) => updateObjectFieldValue(id, fieldKey, e.target.value)}
                            />
                          </Col>
                          {Object.keys(reqData.value || {}).length > 1 && (
                            <Col xs="auto">
                              <Button
                                variant="outline-danger"
                                type="button"
                                onClick={() => removeObjectField(id, fieldKey)}
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px", padding: "4px" }}
                              >
                                <Minus size={16} />
                              </Button>
                            </Col>
                          )}
                        </Row>
                      ))}
                      <Button
                        variant="outline-primary"
                        type="button"
                        size="sm"
                        onClick={() => addObjectField(id)}
                        className="d-flex align-items-center gap-1 mt-2"
                      >
                        <Plus size={16} />
                        Add nested pair
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          );
        })}
        <div className="d-flex justify-content-start mt-2">
          <Button
            variant="outline-primary"
            type="button"
            onClick={addRequirement}
            className="d-flex align-items-center me-2"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Plus className="mr-1" size={16} />
            Requirement
          </Button>
        </div>
      </div>
    </div>
  );
};


export default RequirementsSection;
