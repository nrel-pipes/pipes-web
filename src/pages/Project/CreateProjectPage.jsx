import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Check, FileText, Layers, Lightbulb, List, Minus, Plus, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useCreateProjectMutation } from "../../hooks/useProjectQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import { useCreateProjectFormStore } from "../../stores/FormStore";
import ContentHeader from "../Components/ContentHeader";

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
            className="form-control-lg form-primary-input"
            isInvalid={!!errors.name}
            {...register("name", { required: "Project name (identifier) is required" })}
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
            className="form-control-lg form-primary-input"
            isInvalid={!!errors.owner?.first_name}
            {...register("owner.first_name", { required: "First name is required" })}
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
            className="form-control-lg form-primary-input"
            isInvalid={!!errors.owner?.last_name}
            {...register("owner.last_name", { required: "Last name is required" })}
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
  const { getValues, setValue, watch } = useFormContext();
  const [requirements, setRequirements] = useState([]);

  const formRequirements = watch("requirements");

  useEffect(() => {
    const formValues = getValues();
    if (formValues.requirements?.keys?.length) {
      const reqsArray = formValues.requirements.keys.map((key, i) => ({
        key,
        values: formValues.requirements.values[i] || [""]
      }));
      setRequirements(reqsArray);
    } else {
      setRequirements([{ key: "", values: [""] }]);
    }
  }, [getValues, formRequirements]);

  useEffect(() => {
    if (requirements.length > 0) {
      const keys = requirements.map(req => req.key);
      const values = requirements.map(req => req.values);
      setValue("requirements.keys", keys, { shouldDirty: true });
      setValue("requirements.values", values, { shouldDirty: true });
    }
  }, [requirements, setValue]);

  const addRequirement = () => {
    const newRequirements = [...requirements, { key: "", values: [""] }];
    setRequirements(newRequirements);
    const keys = newRequirements.map(req => req.key);
    const values = newRequirements.map(req => req.values);
    setValue("requirements.keys", keys, { shouldDirty: true });
    setValue("requirements.values", values, { shouldDirty: true });
  };

  const removeRequirement = (index) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
    const keys = newRequirements.map(req => req.key);
    const values = newRequirements.map(req => req.values);
    setValue("requirements.keys", keys, { shouldDirty: true });
    setValue("requirements.values", values, { shouldDirty: true });
  };

  const updateRequirementKey = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index].key = value;
    setRequirements(newRequirements);
    const keys = newRequirements.map(req => req.key);
    setValue("requirements.keys", keys, { shouldDirty: true });
  };

  const addValue = (reqIndex) => {
    const newRequirements = [...requirements];
    newRequirements[reqIndex].values.push("");
    setRequirements(newRequirements);
    const values = newRequirements.map(req => req.values);
    setValue("requirements.values", values, { shouldDirty: true });
  };

  const updateValue = (reqIndex, valueIndex, value) => {
    const newRequirements = [...requirements];
    newRequirements[reqIndex].values[valueIndex] = value;
    setRequirements(newRequirements);
    const values = newRequirements.map(req => req.values);
    setValue("requirements.values", values, { shouldDirty: true });
  };

  const removeValue = (reqIndex, valueIndex) => {
    const newRequirements = [...requirements];
    newRequirements[reqIndex].values = newRequirements[reqIndex].values.filter((_, i) => i !== valueIndex);
    setRequirements(newRequirements);
    const values = newRequirements.map(req => req.values);
    setValue("requirements.values", values, { shouldDirty: true });
  };

  return (
    <div className="form-container">
      <h4 className="form-section-title">Project Requirements</h4>

      {requirements.map((requirement, reqIndex) => (
        <div key={reqIndex} className="card-item">
          <div className="card-item-header">
            <h4 className="card-item-title requirement-title">
              Requirement {reqIndex + 1}
            </h4>
            {requirements.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeRequirement(reqIndex)}
                className="item-action-button"
              >
                <Minus size={16} />
              </Button>
            )}
          </div>

          <div className="requirement-name-section">
            <Form.Label className="form-field-label">
              <span className="requirement-label">Requirement Name</span>
            </Form.Label>
            <Form.Control
              id={`requirement-${reqIndex}`}
              type="text"
              value={requirement.key}
              onChange={(e) => updateRequirementKey(reqIndex, e.target.value)}
              className="requirement-name-input"
            />
          </div>

          <div className="requirement-values-section">
            <div className="values-header">
              <Form.Label className="form-field-label mb-3">
                <span className="values-label">Requirement Values</span>
              </Form.Label>
            </div>

            {requirement.values.map((value, valueIndex) => (
              <div key={valueIndex} className="requirement-value-item d-flex mb-3 align-items-center gap-2">
                <div className="value-index">{valueIndex + 1}.</div>
                <Form.Control
                  id={`value-${reqIndex}-${valueIndex}`}
                  type="text"
                  value={value}
                  onChange={(e) => updateValue(reqIndex, valueIndex, e.target.value)}
                />
                {requirement.values.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeValue(reqIndex, valueIndex)}
                    className="item-action-button"
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            ))}

            <div className="d-flex justify-content-start mt-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => addValue(reqIndex)}
                className="add-button"
              >
                <Plus size={16} /> Add Value
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-start mt-4">
        <Button
          variant="outline-primary"
          onClick={addRequirement}
          className="add-button"
        >
          <Plus size={18} /> Add New Requirement
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

  // Preview the data as it will be formatted for API submission
  const previewFormattedData = {
    ...formData,
    title: formData.name,
    milestones: formData.milestones?.map(milestone => ({
      ...milestone,
      description: Array.isArray(milestone.description)
        ? milestone.description.join(" ")
        : milestone.description || ""
    })) || [],
    scenarios: formData.scenarios?.map(scenario => ({
      ...scenario,
      other: Array.isArray(scenario.other)
        ? scenario.other.reduce((acc, [key, value]) => {
            if (key) acc[key] = value || "";
            return acc;
          }, {})
        : scenario.other || {}
    })) || []
  };

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
        <p>Your form data is <b>TEMPORARILY </b> saved in your browser's local storage before submtting it. Please review all information and submit to PIPES server for permanent storage.</p>
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

      {formData.requirements?.keys?.filter(Boolean).length > 0 && (
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
                  <th>#</th>
                  <th>Name</th>
                  <th>Values</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.requirements.keys
                  .map((key, index) => key && (
                    <tr key={index} className="review-table-row">
                      <td className="review-table-number">{index + 1}</td>
                      <td className="review-table-key">{key}</td>
                      <td colSpan="2" className="review-table-value">
                        {formData.requirements.values[index]?.filter(Boolean).length > 0 ? (
                          <ul className="review-detail-list">
                            {formData.requirements.values[index]
                              .filter(Boolean)
                              .map((value, vIndex) => (
                                <li key={vIndex}>{value}</li>
                              ))}
                          </ul>
                        ) : "—"}
                      </td>
                    </tr>
                  )).filter(Boolean)}
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
        <p>Once you click "Submit", your project will be created and you'll be redirected to the project dashboard.</p>
      </div>
    </div>
  );
};

// Main component with updated layout
const CreateProjectPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { checkAuthStatus } = useAuthStore();
  const { setEffectivePname } = useDataStore();

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const {
    projectFormData,
    completedSteps,
    currentStep,
    setProjectFormData,
    setCurrentStep,
    addCompletedStep,
    resetCompletedSteps,
    resetForm
  } = useCreateProjectFormStore();

  // Update the reset function to use the resetForm function
  const resetProjectForm = () => {
    resetForm();
  };

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const mutation = useCreateProjectMutation();

  // Form default values - use persisted data if available
  const defaultValues = projectFormData || {
    name: "",
    title: "", // Add title field
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
    requirements: {
      keys: [],
      values: []
    },
    sensitivities: []
  };

  const methods = useForm({
    defaultValues,
    mode: "onChange"
  });

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

    const projectBasicsFromCache = queryClient.getQueryData(["project-basics"]);
    if (projectBasicsFromCache) {
      const names = projectBasicsFromCache.map(project => project.name);
      if (names.includes(data.name)) {
        setFormError(true);
        setFormErrorMessage(`Project with "${data.name}" already exists. Please choose a unique name.`);
        return;
      }
    }

    // Create a clean copy of the data for submission
    const formattedData = {
      ...data,
      owner: {
        ...data.owner,
        first_name: data.owner?.first_name || "",
        last_name: data.owner?.last_name || ""
      }
    };

    // Handle requirements - remove if empty
    if (!data.requirements?.keys?.filter(Boolean).length) {
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

    mutation.mutate({ data: formattedData });
  };

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      if (mutation.data.name) {
        setEffectivePname(mutation.data.name);
      }
      // Clear form data on successful submission
      resetProjectForm();
      navigate("/project/dashboard");
    }

    if (mutation.isError) {
      setFormError(true);
      // Set a generic error heading that doesn't duplicate the details
      setFormErrorMessage("Error creating project");
      // Get detailed error information
      setErrorDetails(parseErrorResponse(mutation.error));

      // Scroll to top to make error visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Allow going to Review step if all previous steps are completed
    if (stepIndex === steps.length - 1) {
      // Check if all previous steps are completed
      const allPreviousStepsCompleted = Array.from(
        { length: steps.length - 1 },
        (_, i) => i
      ).every(i => completedSteps.includes(i));

      if (allPreviousStepsCompleted) {
        setCurrentStep(stepIndex);
        setFormError(false);
        setFormErrorMessage("");
        return;
      }
    }

    // Original logic for other steps
    if (completedSteps.includes(stepIndex) || stepIndex === currentStep) {
      setCurrentStep(stepIndex);
      setFormError(false);
      setFormErrorMessage("");
    }
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

  // Don't render content until auth check is complete
  if (isAuthChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarSub navData={{ pList: true, pCreate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Create Project"/>
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
                    disabled={!completedSteps.includes(i) && i !== currentStep && i !== steps.length - 1}
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
                        ? (mutation.isPending ? "Creating..." : "Create Project")
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

export default CreateProjectPage;
