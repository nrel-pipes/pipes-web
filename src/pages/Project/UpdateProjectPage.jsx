import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Check, FileText, Layers, Lightbulb, List, Minus, Plus, Users, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { useGetProjectQuery, useUpdateProjectMutation } from "../../hooks/useProjectQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import { useUpdateProjectFormStore } from "../../stores/FormStore/ProjectStore";
import ContentHeader from "../Components/ContentHeader";
import ProjectUpdateCancelButton from "./Components/ProjectUpdateCancelButton";

import "../Components/Cards.css";
import "../FormStyles.css";
import "../PageStyles.css";
import "./ProjectPage.css";


const StepBasicInfo = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-container">
      <h4 className="form-section-title">Basic Info</h4>

      <div className="form-content-section">
        <div className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">Project Name (Identifer) </span>
          </Form.Label>
          <Form.Control
            id="projectName"
            className="form-control-lg form-primary-input bg-light"
            isInvalid={!!errors.name}
            {...register("name", { required: "Project name (identifier) is required" })}
            readOnly
          />
          {errors.name && (
            <Form.Control.Feedback type="invalid">
              {errors.name.message}
            </Form.Control.Feedback>
          )}
        </div>

        <div className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">Project Title</span>
          </Form.Label>
          <Form.Control
            id="projectTitle"
            className="form-control-lg form-primary-input"
            isInvalid={!!errors.title}
            {...register("title", { required: "Project title is required" })}
          />
          {errors.title && (
            <Form.Control.Feedback type="invalid">
              {errors.title.message}
            </Form.Control.Feedback>
          )}
        </div>

        <div className="form-field-group">
          <Form.Label className="form-field-label">
            <span className="form-field-text">Project Description</span>
          </Form.Label>
          <Form.Control
            id="projectDescription"
            as="textarea"
            rows={3}
            className="form-control-lg form-textarea-input"
            {...register("description")}
          />
        </div>

        <Row>
          <Col md={6} className="form-field-group">
            <Form.Label className="form-field-label required-field">
              <span className="form-field-text">Scheduled Start</span>
            </Form.Label>
            <Form.Control
              id="scheduledStart"
              type="date"
              className="form-control-lg form-date-input"
              isInvalid={!!errors.scheduled_start}
              {...register("scheduled_start", { required: "Start date is required" })}
            />
            {errors.scheduled_start && (
              <Form.Control.Feedback type="invalid">
                {errors.scheduled_start.message}
              </Form.Control.Feedback>
            )}
          </Col>
          <Col md={6} className="form-field-group">
            <Form.Label className="form-field-label required-field">
              <span className="form-field-text">Scheduled End</span>
            </Form.Label>
            <Form.Control
              id="scheduledEnd"
              type="date"
              className="form-control-lg form-date-input"
              isInvalid={!!errors.scheduled_end}
              {...register("scheduled_end", {
                required: "End date is required",
                validate: (value, formValues) =>
                  !formValues.scheduled_start || new Date(value) >= new Date(formValues.scheduled_start) ||
                  "End date must be after start date"
              })}
            />
            {errors.scheduled_end && (
              <Form.Control.Feedback type="invalid">
                {errors.scheduled_end.message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

// New step for Project Owner
const StepProjectOwner = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-container">
      <h4 className="form-section-title">Project Owner</h4>

      <div className="form-content-section">
        <div className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">First Name</span>
          </Form.Label>
          <Form.Control
            id="firstName"
            className="form-control-lg form-primary-input bg-light"
            isInvalid={!!errors.owner?.first_name}
            {...register("owner.first_name", { required: "First name is required" })}
            readOnly
          />
          {errors.owner?.first_name && (
            <Form.Control.Feedback type="invalid">
              {errors.owner.first_name.message}
            </Form.Control.Feedback>
          )}
        </div>

        <div className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">Last Name</span>
          </Form.Label>
          <Form.Control
            id="lastName"
            className="form-control-lg form-primary-input bg-light"
            isInvalid={!!errors.owner?.last_name}
            {...register("owner.last_name", { required: "Last name is required" })}
            readOnly
          />
          {errors.owner?.last_name && (
            <Form.Control.Feedback type="invalid">
              {errors.owner.last_name.message}
            </Form.Control.Feedback>
          )}
        </div>

        <div className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">Email</span>
          </Form.Label>
          <Form.Control
            id="email"
            className="form-control-lg form-primary-input"
            isInvalid={!!errors.owner?.email}
            {...register("owner.email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.owner?.email && (
            <Form.Control.Feedback type="invalid">
              {errors.owner.email.message}
            </Form.Control.Feedback>
          )}
        </div>

        <div className="form-field-group">
          <Form.Label className="form-field-label required-field">
            <span className="form-field-text">Organization</span>
          </Form.Label>
          <Form.Control
            id="organization"
            className="form-control-lg form-primary-input"
            isInvalid={!!errors.owner?.organization}
            {...register("owner.organization", { required: "Organization is required" })}
          />
          {errors.owner?.organization && (
            <Form.Control.Feedback type="invalid">
              {errors.owner.organization.message}
            </Form.Control.Feedback>
          )}
        </div>
      </div>
    </div>
  );
};

const StepRequirements = () => {
  const { setValue, watch } = useFormContext();
  const [requirements, setRequirements] = useState([{ key: "", value: "", isObject: false, subItems: [{ key: "", value: "" }] }]);
  const [isInitialized, setIsInitialized] = useState(false);
  const formRequirements = watch("requirements");

  // Load existing requirements from the form state into the component's local state
  useEffect(() => {
    // This effect should only run once to initialize the component from the form's state.
    if (formRequirements && !isInitialized) {
      const formValues = formRequirements || {};
      if (Object.keys(formValues).length > 0) {
        const reqsArray = Object.entries(formValues).map(([key, value]) => {
          const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
          return {
            key,
            value: isObject ? "" : String(value),
            isObject,
            subItems: isObject ? Object.entries(value).map(([subKey, subValue]) => ({ key: subKey, value: String(subValue) })) : [{ key: "", value: "" }]
          };
        });
        if (reqsArray.length > 0) {
          setRequirements(reqsArray);
        }
      }
      setIsInitialized(true);
    }
  }, [formRequirements, isInitialized]);

  // Update the main form state whenever the local requirements state changes
  useEffect(() => {
    // Do not run this effect on the initial render until the component is initialized.
    if (!isInitialized) return;

    const newRequirementsObject = requirements.reduce((acc, req) => {
      // Only add valid requirements to the form state.
      // A requirement is valid if its key is not empty.
      if (req.key && req.key.trim() !== "") {
        if (req.isObject) {
          acc[req.key] = req.subItems.reduce((subAcc, subItem) => {
            if (subItem.key && subItem.key.trim() !== "") {
              const numValue = Number(subItem.value);
              subAcc[subItem.key] = isNaN(numValue) || subItem.value.trim() === '' ? subItem.value : numValue;
            }
            return subAcc;
          }, {});
        } else {
          const numValue = Number(req.value);
          acc[req.key] = isNaN(numValue) || req.value.trim() === '' ? req.value : numValue;
        }
      }
      return acc;
    }, {});
    setValue("requirements", newRequirementsObject, { shouldDirty: true, shouldValidate: true });
  }, [requirements, setValue, isInitialized]);

  const addRequirement = () => {
    setRequirements([...requirements, { key: "", value: "", isObject: false, subItems: [{ key: "", value: "" }] }]);
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index, field, fieldValue) => {
    const newRequirements = [...requirements];
    newRequirements[index][field] = fieldValue;
    setRequirements(newRequirements);
  };

  const toggleRequirementType = (index) => {
    const newRequirements = [...requirements];
    newRequirements[index].isObject = !newRequirements[index].isObject;
    setRequirements(newRequirements);
  };

  const addSubItem = (reqIndex) => {
    const newRequirements = [...requirements];
    newRequirements[reqIndex].subItems.push({ key: "", value: "" });
    setRequirements(newRequirements);
  };

  const removeSubItem = (reqIndex, subIndex) => {
    const newRequirements = [...requirements];
    newRequirements[reqIndex].subItems = newRequirements[reqIndex].subItems.filter((_, i) => i !== subIndex);
    setRequirements(newRequirements);
  };

  const updateSubItem = (reqIndex, subIndex, field, fieldValue) => {
    const newRequirements = [...requirements];
    newRequirements[reqIndex].subItems[subIndex][field] = fieldValue;
    setRequirements(newRequirements);
  };

  return (
    <div className="form-container">
      <h4 className="form-section-title">Project Requirements</h4>
      <p className="form-section-description">Define key-value pairs. Values can be simple text/numbers or nested objects.</p>

      {requirements.map((requirement, index) => (
        <div key={index} className="card-item mb-3">
          <div className="requirement-row d-flex align-items-center gap-2">
            <Form.Control
              type="text"
              placeholder="Requirement Name"
              value={requirement.key}
              onChange={(e) => updateRequirement(index, "key", e.target.value)}
              className="requirement-key-input"
            />
            <Form.Check
              type="switch"
              id={`is-object-switch-${index}`}
              label="Object"
              checked={requirement.isObject}
              onChange={() => toggleRequirementType(index)}
            />
            <Button variant="outline-danger" size="sm" onClick={() => removeRequirement(index)} disabled={requirements.length === 1}>
              <Minus size={16} />
            </Button>
          </div>

          {!requirement.isObject ? (
            <div className="mt-2">
              <Form.Control
                type="text"
                placeholder="Value"
                value={requirement.value}
                onChange={(e) => updateRequirement(index, "value", e.target.value)}
                className="requirement-value-input"
              />
            </div>
          ) : (
            <div className="nested-requirements-container mt-3 p-3 border rounded">
              {requirement.subItems.map((subItem, subIndex) => (
                <div key={subIndex} className="requirement-row d-flex align-items-center gap-2 mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Key"
                    value={subItem.key}
                    onChange={(e) => updateSubItem(index, subIndex, "key", e.target.value)}
                    size="sm"
                  />
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    value={subItem.value}
                    onChange={(e) => updateSubItem(index, subIndex, "value", e.target.value)}
                    size="sm"
                  />
                  <Button variant="outline-danger" size="sm" onClick={() => removeSubItem(index, subIndex)} disabled={requirement.subItems.length === 1}>
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
              <Button variant="outline-secondary" size="sm" onClick={() => addSubItem(index)}>
                <Plus size={16} /> Add Nested Pair
              </Button>
            </div>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-start mt-3">
        <Button variant="outline-primary" onClick={addRequirement} className="add-button">
          <Plus size={16} /> Add Requirement
        </Button>
      </div>
    </div>
  );
};

const StepScenarios = () => {
  const { getValues, setValue } = useFormContext();
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    const formValues = getValues();
    if (formValues.scenarios?.length) {
      setScenarios(formValues.scenarios);
    } else {
      setScenarios([{ name: "", description: [""], other: [] }]);
    }
  }, [getValues]);

  useEffect(() => {
    if (scenarios.length > 0) {
      setValue("scenarios", scenarios, { shouldDirty: true });
    }
  }, [scenarios, setValue]);

  const addScenario = () => {
    const newScenarios = [...scenarios, { name: "", description: [""], other: [] }];
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios, { shouldDirty: true });
  };

  const removeScenario = (index) => {
    const newScenarios = scenarios.filter((_, i) => i !== index);
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios, { shouldDirty: true });
  };

  const updateScenarioName = (index, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index].name = value;
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios, { shouldDirty: true });
  };

  const updateScenarioDescription = (index, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index].description = [value];
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios, { shouldDirty: true });
  };

  const addOtherInfo = (scenarioIndex) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].other.push(["", ""]);
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios, { shouldDirty: true });
  };

  const updateOtherInfo = (scenarioIndex, otherIndex, keyOrValue, value) => {
    const newScenarios = [...scenarios];
    // Store as array pairs for UI manipulation, will be converted to object on submission
    const currentPair = newScenarios[scenarioIndex].other[otherIndex] || ["", ""];
    newScenarios[scenarioIndex].other[otherIndex] =
      keyOrValue === "key"
        ? [value, currentPair[1]]
        : [currentPair[0], value];
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios, { shouldDirty: true });
  };

  const removeOtherInfo = (scenarioIndex, otherIndex) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].other = newScenarios[scenarioIndex].other.filter(
      (_, idx) => idx !== otherIndex
    );
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios, { shouldDirty: true });
  };

  return (
    <div className="form-container">
      <h4 className="form-section-title">Project Scenarios</h4>

      {scenarios.map((scenario, scenarioIndex) => (
        <div key={scenarioIndex} className="card-item">
          <div className="card-item-header">
            <h4 className="card-item-title">
              Scenario {scenarioIndex + 1}
            </h4>
            {scenarios.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeScenario(scenarioIndex)}
                className="item-action-button"
              >
                <Minus size={16} />
              </Button>
            )}
          </div>

          <div className="form-content-section">
            <div className="form-field-group">
              <Form.Label className="form-field-label">
                <span className="form-field-text">Scenario Name</span>
              </Form.Label>
              <Form.Control
                id={`scenario${scenarioIndex}`}
                type="text"
                value={scenario.name}
                onChange={(e) => updateScenarioName(scenarioIndex, e.target.value)}
                className="form-primary-input"
              />
            </div>

            <div className="form-field-group">
              <Form.Label className="form-field-label">
                <span className="form-field-text">Description</span>
              </Form.Label>
              <Form.Control
                id={`scenarioDescription${scenarioIndex}`}
                as="textarea"
                rows={3}
                value={scenario.description[0] || ""}
                onChange={(e) => updateScenarioDescription(scenarioIndex, e.target.value)}
                className="form-textarea-input"
              />
            </div>
          </div>

          <div className="scenario-other-section">
            <Form.Label className="form-field-label">
              <span className="scenario-label"> Other information</span>
            </Form.Label>

            {scenario.other.map((item, otherIndex) => (
              <div key={otherIndex} className="scenario-other-row mb-3">
                <div className="scenario-other-item">
                  <div className="scenario-other-fields">
                    <Form.Control
                      id={`scenarioOtherKey-${scenarioIndex}-${otherIndex}`}
                      type="text"
                      value={item[0] || ""}
                      placeholder="Key"
                      onChange={(e) => updateOtherInfo(scenarioIndex, otherIndex, "key", e.target.value)}
                      className="other-key-input"
                    />

                    <Form.Control
                      id={`scenarioOtherValue-${scenarioIndex}-${otherIndex}`}
                      type="text"
                      value={item[1] || ""}
                      placeholder="Value"
                      onChange={(e) => updateOtherInfo(scenarioIndex, otherIndex, "value", e.target.value)}
                      className="other-value-input"
                    />

                    {scenario.other.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeOtherInfo(scenarioIndex, otherIndex)}
                        className="item-action-button"
                      >
                        <Minus size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-start mt-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => addOtherInfo(scenarioIndex)}
                className="add-button"
              >
                <Plus size={16} /> Add Other Information
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-start mt-4">
        <Button
          variant="outline-primary"
          onClick={addScenario}
          className="add-button"
        >
          <Plus size={18} /> Add New Scenario
        </Button>
      </div>
    </div>
  );
};

const StepMilestones = () => {
  const { getValues, setValue, watch } = useFormContext();
  const [milestones, setMilestones] = useState([]);
  const scheduledStart = watch("scheduled_start");
  const scheduledEnd = watch("scheduled_end");

  useEffect(() => {
    const formValues = getValues();
    if (formValues.milestones?.length) {
      setMilestones(formValues.milestones);
    } else {
      setMilestones([{ name: "", description: [""], milestone_date: "" }]);
    }
  }, [getValues]);

  useEffect(() => {
    if (milestones.length > 0) {
      setValue("milestones", milestones, { shouldDirty: true });
    }
  }, [milestones, setValue]);

  const addMilestone = () => {
    const newMilestones = [...milestones, { name: "", description: [""], milestone_date: "" }];
    setMilestones(newMilestones);
    setValue("milestones", newMilestones, { shouldDirty: true });
  };

  const removeMilestone = (index) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
    setValue("milestones", newMilestones, { shouldDirty: true });
  };

  const updateMilestoneName = (index, value) => {
    const newMilestones = [...milestones];
    newMilestones[index].name = value;
    setMilestones(newMilestones);
    setValue("milestones", newMilestones, { shouldDirty: true });
  };

  const updateMilestoneDescription = (index, value) => {
    const newMilestones = [...milestones];
    // Store as array for consistency in the form, will be converted to string on submission
    newMilestones[index].description = [value];
    setMilestones(newMilestones);
    setValue("milestones", newMilestones, { shouldDirty: true });
  };

  const updateMilestoneDate = (index, value) => {
    const newMilestones = [...milestones];
    newMilestones[index].milestone_date = value;
    setMilestones(newMilestones);
    setValue("milestones", newMilestones, { shouldDirty: true });
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  return (
    <div className="form-container">
      <h4 className="form-section-title">Project Milestones</h4>

      {milestones.map((milestone, milestoneIndex) => (
        <div key={milestoneIndex} className="card-item">
          <div className="card-item-header">
            <h4 className="card-item-title milestone-title">
              Milestone {milestoneIndex + 1}
            </h4>
            {milestones.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeMilestone(milestoneIndex)}
                className="item-action-button"
              >
                <Minus size={16} />
              </Button>
            )}
          </div>

          <div className="milestone-name-section">
            <Form.Label className="form-field-label">
              <span className="milestone-label">Name</span>
            </Form.Label>
            <Form.Control
              id={`milestoneName-${milestoneIndex}`}
              type="text"
              value={milestone.name}
              onChange={(e) => updateMilestoneName(milestoneIndex, e.target.value)}
              className="milestone-name-input"
            />
          </div>

          <div className="milestone-details-section">

            <div className="milestone-description-item">
              <Form.Label className="form-field-label">Description</Form.Label>
              <Form.Control
                id={`milestoneDescription-${milestoneIndex}`}
                as="textarea"
                rows={3}
                value={milestone.description[0] || ""}
                onChange={(e) => updateMilestoneDescription(milestoneIndex, e.target.value)}
                className="milestone-description-input"
              />
            </div>

            <div className="milestone-date-item">
              <Form.Label className="form-field-label">Date</Form.Label>
              <Form.Control
                id={`milestoneDate-${milestoneIndex}`}
                type="date"
                value={formatDateForInput(milestone.milestone_date)}
                onChange={(e) => updateMilestoneDate(milestoneIndex, e.target.value)}
                min={scheduledStart}
                max={scheduledEnd}
                className="milestone-date-input"
              />
              {scheduledStart && scheduledEnd && (
                <Form.Text className="text-muted">
                  Date must be between project start ({formatDateForInput(scheduledStart)}) and
                  end ({formatDateForInput(scheduledEnd)})
                </Form.Text>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-start mt-4">
        <Button
          variant="outline-primary"
          onClick={addMilestone}
          className="add-button"
        >
          <Plus size={18} /> Add New Milestone
        </Button>
      </div>
    </div>
  );
};

const StepAssumptions = () => {
  const { getValues, setValue } = useFormContext();
  const [assumptions, setAssumptions] = useState([]);

  useEffect(() => {
    const formValues = getValues();
    if (formValues.assumptions?.length) {
      setAssumptions(formValues.assumptions);
    } else {
      setAssumptions([""]);
    }
  }, [getValues]);

  useEffect(() => {
    if (assumptions.length > 0) {
      setValue("assumptions", assumptions, { shouldDirty: true });
    }
  }, [assumptions, setValue]);

  const addAssumption = () => {
    const newAssumptions = [...assumptions, ""];
    setAssumptions(newAssumptions);
    setValue("assumptions", newAssumptions, { shouldDirty: true });
  };

  const removeAssumption = (index) => {
    const newAssumptions = assumptions.filter((_, i) => i !== index);
    setAssumptions(newAssumptions);
    setValue("assumptions", newAssumptions, { shouldDirty: true });
  };

  const updateAssumption = (index, value) => {
    const newAssumptions = [...assumptions];
    newAssumptions[index] = value;
    setAssumptions(newAssumptions);
    setValue("assumptions", newAssumptions, { shouldDirty: true });
  };

  return (
    <div className="form-container">
      <h4 className="form-section-title">Project Assumptions</h4>
      <div style={{ textAlign: 'left', width: '100%' }} className="mb-3">List of Assumptions</div>
      {assumptions.map((assumption, index) => (
        <div key={index} className="d-flex mb-3 align-items-center gap-2">
          {index+1}<Form.Control
            id={`assumptions${index}`}
            type="text"
            value={assumption}
            onChange={(e) => updateAssumption(index, e.target.value)}
          />
          {assumptions.length > 1 && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeAssumption(index)}
              className="item-action-button"
            >
              <Minus size={16} />
            </Button>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-start mt-4">
        <Button
          variant="outline-primary"
          onClick={addAssumption}
          className="add-button"
        >
          <Plus size={18} /> Add New Assumption
        </Button>
      </div>
    </div>
  );
};

const StepSensitivities = () => {
  const { getValues, setValue } = useFormContext();
  const [sensitivities, setSensitivities] = useState([]);

  useEffect(() => {
    const formValues = getValues();
    if (formValues.sensitivities?.length) {
      setSensitivities(formValues.sensitivities);
    } else {
      setSensitivities([{ name: "", description: [""] }]);
    }
  }, [getValues]);

  useEffect(() => {
    if (sensitivities.length > 0) {
      setValue("sensitivities", sensitivities, { shouldDirty: true });
    }
  }, [sensitivities, setValue]);

  const addSensitivity = () => {
    const newSensitivities = [...sensitivities, { name: "", description: [""] }];
    setSensitivities(newSensitivities);
    setValue("sensitivities", newSensitivities, { shouldDirty: true });
  };

  const removeSensitivity = (index) => {
    const newSensitivities = sensitivities.filter((_, i) => i !== index);
    setSensitivities(newSensitivities);
    setValue("sensitivities", newSensitivities, { shouldDirty: true });
  };

  const updateSensitivityName = (index, value) => {
    const newSensitivities = [...sensitivities];
    newSensitivities[index].name = value;
    setSensitivities(newSensitivities);
    setValue("sensitivities", newSensitivities, { shouldDirty: true });
  };

  const updateSensitivityDescription = (index, value) => {
    const newSensitivities = [...sensitivities];
    newSensitivities[index].description = [value];
    setSensitivities(newSensitivities);
    setValue("sensitivities", newSensitivities, { shouldDirty: true });
  };

  return (
    <div className="form-container">
      <h4 className="form-section-title">Project Sensitivities</h4>

      {sensitivities.map((sensitivity, sensitivityIndex) => (
        <div key={sensitivityIndex} className="card-item">
          <div className="card-item-header">
            <h4 className="card-item-title">
              Sensitivity {sensitivityIndex + 1}
            </h4>
            {sensitivities.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeSensitivity(sensitivityIndex)}
                className="item-action-button"
              >
                <Minus size={16} />
              </Button>
            )}
          </div>

          <div className="form-content-section">
            <div className="form-field-group">
              <Form.Label className="form-field-label">
                <span className="form-field-text">Sensitivity Name</span>
              </Form.Label>
              <Form.Control
                id={`sensitivityName-${sensitivityIndex}`}
                type="text"
                value={sensitivity.name}
                onChange={(e) => updateSensitivityName(sensitivityIndex, e.target.value)}
                className="form-control-lg form-primary-input"
              />
            </div>

            <div className="form-field-group">
              <Form.Label className="form-field-label">
                <span className="form-field-text">Description</span>
              </Form.Label>
              <Form.Control
                id={`sensitivityDescription-${sensitivityIndex}`}
                as="textarea"
                rows={3}
                value={sensitivity.description[0] || ""}
                onChange={(e) => updateSensitivityDescription(sensitivityIndex, e.target.value)}
                className="form-control-lg form-textarea-input"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-start mt-4">
        <Button
          variant="outline-primary"
          onClick={addSensitivity}
          className="add-button"
        >
          <Plus size={18} /> Add New Sensitivity
        </Button>
      </div>
    </div>
  );
};

// Add the new Review component for the final step
const StepReview = () => {
  const { getValues } = useFormContext();
  const formData = getValues();

  const formatDate = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString();
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="form-container">
      <h4 className="form-section-title">Review Your Project</h4>
      <div className="review-intro-note">
        <p>Your form data is <b>TEMPORARILY </b> saved in your browser's local storage before submitting it. Please review all information and submit to PIPES server for permanent storage.</p>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h5 className="review-section-title">
            <FileText size={18} className="review-section-icon" />
            Basic Info
          </h5>
        </div>
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Project Name (Identifier)</div>
            <div className="review-value">{formData.name || "—"}</div>
          </div>

          <div className="review-item">
            <div className="review-label">Project Title</div>
            <div className="review-value">{formData.title || "—"}</div>
          </div>

          {formData.description && (
            <div className="review-item">
              <div className="review-label">Description</div>
              <div className="review-value">{formData.description}</div>
            </div>
          )}

          <div className="review-item">
            <div className="review-label">Scheduled Start</div>
            <div className="review-value">{formatDate(formData.scheduled_start) || "—"}</div>
          </div>

          <div className="review-item">
            <div className="review-label">Scheduled End</div>
            <div className="review-value">{formatDate(formData.scheduled_end) || "—"}</div>
          </div>
        </div>
      </div>

      <div className="review-section">
        <div className="review-section-header">
          <h5 className="review-section-title">
            <Users size={18} className="review-section-icon" />
            Project Owner
          </h5>
        </div>
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Name</div>
            <div className="review-value">
              {(formData.owner?.first_name || formData.owner?.last_name)
                ? `${formData.owner?.first_name || ""} ${formData.owner?.last_name || ""}`.trim()
                : "—"}
            </div>
          </div>

          <div className="review-item">
            <div className="review-label">Email</div>
            <div className="review-value">{formData.owner?.email || "—"}</div>
          </div>

          <div className="review-item">
            <div className="review-label">Organization</div>
            <div className="review-value">{formData.owner?.organization || "—"}</div>
          </div>
        </div>
      </div>

      {formData.requirements && Object.keys(formData.requirements).length > 0 && (
        <div className="review-section">
          <div className="review-section-header">
            <h5 className="review-section-title">
              <List size={18} className="review-section-icon" />
              Requirements
            </h5>
          </div>
          <div className="review-content">
            <table className="review-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(formData.requirements)
                  .map(([key, value]) => (
                    <tr key={key} className="review-table-row">
                      <td className="review-table-key">{key}</td>
                      <td className="review-table-value">
                        {typeof value === 'object' && value !== null ? (
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          String(value)
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formData.scenarios?.filter(s => s.name || (s.description && s.description[0]) || s.other?.length > 0).length > 0 && (
        <div className="review-section">
          <div className="review-section-header">
            <h5 className="review-section-title">
              <Layers size={18} className="review-section-icon" />
              Scenarios
            </h5>
          </div>
          <div className="review-content">
            <table className="review-table">
              <thead>
                <tr>
                  <th width="40">#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Other Information</th>
                </tr>
              </thead>
              <tbody>
                {formData.scenarios
                  .filter(s => s.name || (s.description && s.description[0]) || s.other?.length > 0)
                  .map((scenario, index) => (
                    <tr key={index} className="review-table-row">
                      <td className="review-table-number">{index + 1}</td>
                      <td className="review-table-title">{scenario.name || "—"}</td>
                      <td>{scenario.description?.[0] || "—"}</td>
                      <td>
                        {scenario.other?.filter(pair => pair[0] || pair[1]).length > 0 ? (
                          <table className="review-inner-table">
                            <tbody>
                              {scenario.other
                                .filter(pair => pair[0] || pair[1])
                                .map((pair, pIndex) => (
                                  <tr key={pIndex}>
                                    <td className="inner-table-key">{pair[0] + ":" || "—"}</td>
                                    <td className="inner-table-value">{pair[1] || "—"}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formData.milestones?.filter(m => m.name || (m.description && m.description[0]) || m.milestone_date).length > 0 && (
        <div className="review-section">
          <div className="review-section-header">
            <h5 className="review-section-title">
              <Calendar size={18} className="review-section-icon" />
              Milestones
            </h5>
          </div>
          <div className="review-content">
            <table className="review-table">
              <thead>
                <tr>
                  <th width="40">#</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {formData.milestones
                  .filter(m => m.name || (m.description && m.description[0]) || m.milestone_date)
                  .map((milestone, index) => (
                    <tr key={index} className="review-table-row">
                      <td className="review-table-number">{index + 1}</td>
                      <td className="review-table-title">{milestone.name || "—"}</td>
                      <td>{formatDate(milestone.milestone_date) || "—"}</td>
                      <td>{milestone.description?.[0] || "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formData.assumptions?.filter(Boolean).length > 0 && (
        <div className="review-section">
          <div className="review-section-header">
            <h5 className="review-section-title">
              <Lightbulb size={18} className="review-section-icon" />
              Assumptions
            </h5>
          </div>
          <div className="review-content">
            <table className="review-table two-column">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Assumption</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.assumptions
                  .filter(Boolean)
                  .map((assumption, index) => (
                    <tr key={index} className="review-table-row">
                      <td className="review-table-number">{index + 1}</td>
                      <td colSpan="3">{assumption}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formData.sensitivities?.filter(s => s.name || (s.description && s.description[0])).length > 0 && (
        <div className="review-section">
          <div className="review-section-header">
            <h5 className="review-section-title">
              <Zap size={18} className="review-section-icon" />
              Sensitivities
            </h5>
          </div>
          <div className="review-content">
            <table className="review-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.sensitivities
                  .filter(s => s.name || (s.description && s.description[0]))
                  .map((sensitivity, index) => (
                    <tr key={index} className="review-table-row">
                      <td className="review-table-number">{index + 1}</td>
                      <td className="review-table-title">{sensitivity.name || "—"}</td>
                      <td colSpan="2">{sensitivity.description?.[0] || "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="review-submit-note">
        <p>Once you click "Update Project", your project will be updated and you'll be redirected to the project dashboard.</p>
      </div>
    </div>
  );
};

// Main component with updated layout
const UpdateProjectPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { checkAuthStatus } = useAuthStore();
  const { setEffectivePname, effectivePname } = useDataStore();
  const { projectName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const {
    projectFormData,
    completedSteps,
    currentStep,
    setProjectFormData,
    setCurrentStep,
    addCompletedStep,
    resetCompletedSteps,
    resetForm
  } = useUpdateProjectFormStore();

  // Fetch existing project data
  const projectQuery = useGetProjectQuery(projectName || effectivePname);

  // Update the reset function to use the resetForm function
  const resetProjectForm = () => {
    resetForm();
  };

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const mutation = useUpdateProjectMutation();

  // Transform project data for form consumption
  const cleanProjectDataForForm = (projectData) => {
    if (!projectData) return {};

    return {
      name: projectData.name || "",
      title: projectData.title || "",
      description: projectData.description || "",
      scheduled_start: projectData.scheduled_start ? projectData.scheduled_start.split('T')[0] : "",
      scheduled_end: projectData.scheduled_end ? projectData.scheduled_end.split('T')[0] : "",
      owner: {
        email: projectData.owner?.email || "",
        first_name: projectData.owner?.first_name || "",
        last_name: projectData.owner?.last_name || "",
        organization: projectData.owner?.organization || ""
      },
      requirements: projectData.requirements || {},
      scenarios: projectData.scenarios?.map(scenario => ({
        name: scenario.name || "",
        description: [scenario.description || ""],
        other: scenario.other ? Object.entries(scenario.other) : []
      })) || [],
      milestones: projectData.milestones?.map(milestone => ({
        name: milestone.name || "",
        description: [milestone.description || ""],
        milestone_date: milestone.milestone_date ? milestone.milestone_date.split('T')[0] : ""
      })) || [],
      assumptions: projectData.assumptions || [""],
      sensitivities: projectData.sensitivities?.map(sensitivity => ({
        name: sensitivity.name || "",
        description: [sensitivity.description || ""]
      })) || []
    };
  };

  // Form default values - use project data if available, otherwise use persisted update form data
  const defaultValues = useMemo(() => {
    if (projectQuery.data) {
      return cleanProjectDataForForm(projectQuery.data);
    }
    return projectFormData || {
      name: "",
      title: "",
      description: "",
      scheduled_start: "",
      scheduled_end: "",
      assumptions: [""],
      milestones: [],
      owner: {
        email: "",
        first_name: "",
        last_name: "",
        organization: ""
      },
      scenarios: [],
      requirements: {},
      sensitivities: []
    };
  }, [projectQuery.data, projectFormData]);

  const methods = useForm({
    defaultValues,
    mode: "onChange"
  });

  // Reset form when project data changes
  useEffect(() => {
    if (projectQuery.data) {
      const transformedData = cleanProjectDataForForm(projectQuery.data);
      methods.reset(transformedData);
      setProjectFormData(transformedData);
      setIsProjectLoading(false);
    }
  }, [projectQuery.data, methods, setProjectFormData]);

  // Save form data to Zustand store whenever it changes
  useEffect(() => {
    const subscription = methods.watch((formData) => {
      if (Object.keys(formData).length > 0) {
        setProjectFormData(formData);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, setProjectFormData]);

  const steps = [
    { title: "Basic Info", component: <StepBasicInfo /> },
    { title: "Owner", component: <StepProjectOwner /> },
    { title: "Requirements", component: <StepRequirements /> },
    { title: "Scenarios", component: <StepScenarios /> },
    { title: "Milestones", component: <StepMilestones /> },
    { title: "Assumptions", component: <StepAssumptions /> },
    { title: "Sensitivities", component: <StepSensitivities /> },
    { title: "Review", component: <StepReview /> }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthChecking(true);
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  // Enhanced error handling with error parsing
  const parseErrorResponse = (error) => {
    if (error?.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        return error.response.data.detail.map(item => {
          // Format validation error paths for better readability
          const path = Array.isArray(item.loc) ? item.loc.slice(1).join('.') : item.loc;
          return `${path} - ${item.msg}`;
        });
      } else if (typeof error.response.data.detail === 'string') {
        return [error.response.data.detail];
      }
    }

    // If we have a structured error response but no details were extracted above,
    // try to extract more specific information
    if (error?.response?.data) {
      const errorDetails = [];
      // Extract field-specific errors if available
      Object.entries(error.response.data).forEach(([field, messages]) => {
        if (field !== 'detail' && Array.isArray(messages)) {
          messages.forEach(msg => {
            errorDetails.push(`${field}: ${msg}`);
          });
        }
      });

      if (errorDetails.length > 0) {
        return errorDetails;
      }
    }

    // Only use error.message as a fallback if we don't have more specific details
    if (error?.message && error.message !== error?.response?.statusText) {
      return [error.message];
    }

    return ["An unexpected error occurred. Please try again."];
  };

  const onSubmit = (data) => {
    // Reset error states
    setFormError(false);
    setFormErrorMessage("");
    setErrorDetails([]);

    // Create a clean copy of the data for submission
    const formattedData = {
      ...data,
      owner: {
        ...data.owner,
        first_name: data.owner?.first_name || "",
        last_name: data.owner?.last_name || ""
      }
    };

    // Handle requirements - remove if empty or key is empty
    if (data.requirements && Object.keys(data.requirements).length > 0) {
      const cleanedRequirements = Object.fromEntries(
        Object.entries(data.requirements)
          // Filter out top-level entries with empty keys
          .filter(([key]) => key && key.trim() !== "")
          .map(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              const cleanedSubItems = Object.fromEntries(
                Object.entries(value).filter(([subKey]) => subKey && subKey.trim() !== "")
              );
              return [key, cleanedSubItems];
            }
            return [key, value];
          })
          // Filter out entries where the value is an empty object
          .filter(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              return Object.keys(value).length > 0;
            }
            return true; // Keep non-object values
          })
      );

      if (Object.keys(cleanedRequirements).length > 0) {
        formattedData.requirements = cleanedRequirements;
      } else {
        delete formattedData.requirements;
      }
    } else {
      delete formattedData.requirements;
    }

    // Handle scenarios
    if (data.scenarios?.length) {
      const validScenarios = data.scenarios.filter(scenario =>
        scenario.name || (scenario.description?.[0]) || scenario.other?.some(pair => pair[0] || pair[1])
      );

      if (validScenarios.length > 0) {
        formattedData.scenarios = validScenarios.map(scenario => ({
          ...scenario,
          description: Array.isArray(scenario.description) ? scenario.description.join(" ") : scenario.description || "",
          other: Array.isArray(scenario.other)
            ? scenario.other.reduce((acc, [key, value]) => {
                if (key) acc[key] = value || "";
                return acc;
              }, {})
            : scenario.other || {}
        }));
      } else {
        delete formattedData.scenarios;
      }
    } else {
      delete formattedData.scenarios;
    }

    // Handle milestones
    if (data.milestones?.length) {
      const validMilestones = data.milestones.filter(milestone =>
        milestone.name || (milestone.description?.[0]) || milestone.milestone_date
      );

      if (validMilestones.length > 0) {
        formattedData.milestones = validMilestones.map(milestone => ({
          ...milestone,
          description: Array.isArray(milestone.description) ? milestone.description.join(" ") : milestone.description || ""
        }));
      } else {
        delete formattedData.milestones;
      }
    } else {
      delete formattedData.milestones;
    }

    // Handle assumptions
    if (data.assumptions?.length) {
      const validAssumptions = data.assumptions.filter(Boolean);
      if (validAssumptions.length > 0) {
        formattedData.assumptions = validAssumptions;
      } else {
        delete formattedData.assumptions;
      }
    } else {
      delete formattedData.assumptions;
    }

    // Handle sensitivities
    if (data.sensitivities?.length) {
      const validSensitivities = data.sensitivities.filter(sensitivity =>
        sensitivity.name || (sensitivity.description?.[0])
      );

      if (validSensitivities.length > 0) {
        formattedData.sensitivities = validSensitivities.map(sensitivity => ({
          ...sensitivity,
          description: Array.isArray(sensitivity.description) ? sensitivity.description.join(" ") : sensitivity.description || ""
        }));
      } else {
        delete formattedData.sensitivities;
      }
    } else {
      delete formattedData.sensitivities;
    }

    // Use the project name from params or effectivePname for the update
    const projectToUpdate = projectName || effectivePname;
    mutation.mutate({ projectName: projectToUpdate, data: formattedData });
  };

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.name) {
        setEffectivePname(mutation.data.name);
      }
      // Only clear form data on successful submission
      resetProjectForm();
      navigate("/project/dashboard");
    }

    if (mutation.isError) {
      setFormError(true);
      // Set a generic error heading that doesn't duplicate the details
      setFormErrorMessage("Error updating project");
      // Get detailed error information
      setErrorDetails(parseErrorResponse(mutation.error));

      // Scroll to top to make error visible
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Don't clear form data on error - preserve user changes for retry
    }
  }, [mutation.isSuccess, mutation.isError, mutation.data, mutation.error, setEffectivePname, navigate]);

  const saveFormData = async () => {
    // Only save if form is valid
    const valid = await methods.trigger();
    if (valid) {
      // Add to completed steps if not already included
      addCompletedStep(currentStep);

      // Show success message (optional)
      setFormError(false);
      setFormErrorMessage("");

      // Return validation success
      return true;
    }
    return false;
  };

  const saveAndContinue = async () => {
    if (currentStep === steps.length - 1) {
      methods.handleSubmit(onSubmit)();
      return;
    }

    // For the Review step (second to last), no validation needed
    if (currentStep === steps.length - 2) {
      addCompletedStep(currentStep);
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
      setFormError(false);
      setFormErrorMessage("");
      return;
    }

    // Save and move to next step if validation passes
    const saved = await saveFormData();
    if (saved) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
    setFormError(false);
    setFormErrorMessage("");
  };

  const goToStep = (stepIndex) => {
    // For update page, allow navigation to any step
    setCurrentStep(stepIndex);
    setFormError(false);
    setFormErrorMessage("");
  };

  const progressPercentage = Math.round(((completedSteps.length + (currentStep > Math.max(...completedSteps || [-1]) ? 1 : 0)) / steps.length) * 100);

  const stepIcons = [
    <FileText size={18} />,
    <Users size={18} />,
    <List size={18} />,
    <Layers size={18} />,
    <Calendar size={18} />,
    <Lightbulb size={18} />,
    <Zap size={18} />,
    <Check size={18} />
  ];

  // Don't render content until auth check is complete and project is loaded
  if (isAuthChecking || isProjectLoading || projectQuery.isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle project not found
  if (projectQuery.isError) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pUpdate: true }} />
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <Row className="w-100 mx-0">
            <ContentHeader title="Update Project"/>
          </Row>
          <div className="alert alert-danger">
            <h4>Project Not Found</h4>
            <p>The project you are trying to update could not be found.</p>
            <Button variant="primary" onClick={() => navigate("/projects")}>
              Go to Project List
            </Button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: effectivePname, toUpdate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader
            title={`Update Project: ${projectQuery.data?.name || ''}`}
            headerButton={<ProjectUpdateCancelButton />}
          />
        </Row>

        <div className="create-project-container">
          <div className="step-sidebar">

            <div className="progress-indicator">
              <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="step-navigation">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`step-item ${currentStep === i ? 'active' : ''} ${completedSteps.includes(i) ? 'completed' : ''}`}
                >
                  <button
                    className="step-button"
                    onClick={() => goToStep(i)}
                    // Remove disabled state for update page - all steps should be clickable
                  >
                    <span className="step-icon">
                      {completedSteps.includes(i) ? <Check size={16} /> : stepIcons[i]}
                    </span>
                    <span className="step-title">{step.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-content-container">
            {/* Error Alert - Displayed at the top of the form */}
            {formError && (
              <div className="error-container mb-4 text-start">
                <div className="alert alert-danger">
                  <h5 className="alert-heading text-start">{formErrorMessage}</h5>
                  {errorDetails.length > 0 && (
                    <div className="mt-2">
                      <ul className="error-details-list mb-0 ps-3">
                        {errorDetails.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <FormProvider {...methods}>
              <Form>
                {steps[currentStep].component}

                <div className="form-action-buttons">
                  <Button
                    variant="outline-secondary"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="action-button"
                  >
                    Previous
                  </Button>

                  <div className="action-buttons-right">
                    <Button
                      style={{ borderColor: "#0079c2", color: "#0079c2" }}
                      variant="outline-primary"
                      onClick={saveFormData}
                      disabled={mutation.isPending}
                      className="action-button me-2"
                    >
                      Save
                    </Button>

                    <Button
                      style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                      variant="primary"
                      onClick={saveAndContinue}
                      disabled={mutation.isPending}
                      className="action-button"
                    >
                      {currentStep === steps.length - 1
                        ? (mutation.isPending ? "Updating..." : "Update Project")
                        : "Save & Continue"}
                    </Button>
                  </div>
                </div>
              </Form>
            </FormProvider>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UpdateProjectPage;
