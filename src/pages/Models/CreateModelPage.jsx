import { Minus, Plus } from "lucide-react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";
import "../FormStyles.css";
import "../PageStyles.css";
import "./CreateModelPage.css";

import { useCreateModelMutation } from "../../hooks/useModelQuery";
import { useGetProjectQuery } from "../../hooks/useProjectQuery";
import { useGetProjectRunQuery } from "../../hooks/useProjectRunQuery";
import { useListTeamsQuery } from "../../hooks/useTeamQuery";
import useDataStore from "../../stores/DataStore";
import { useCreateModelFormStore } from "../../stores/FormStore/ModelStore";

import { useEffect, useState } from "react";

// Scenario Mappings component for managing model scenario mappings
const ScenarioMappingsSection = ({ control, register, errors, watch, setValue, projectScenarios }) => {
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

const StepIndicator = ({ currentStep, totalSteps, onStepClick, canNavigateTo }) => {
  const steps = ["Basic Info", "Scenarios", "Assumptions", "Modeling Team", "Review"];
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="step-form-container">
      {/* Progress Bar */}
      <div className="progress-wrapper">
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      {/* Step Navigation */}
      <ul className="nav nav-pills nav-justified step-nav">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isClickable = canNavigateTo(stepNumber);
          return (
            <li key={index} className="nav-item">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(stepNumber)}
                className={`nav-link ${stepNumber === currentStep ? 'active' : ''} ${stepNumber < currentStep ? 'completed' : ''} ${isClickable ? 'clickable' : 'disabled'}`}
                disabled={!isClickable}
              >
                {step}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const CreateModelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus, currentUser } = useAuthStore();
  const { effectivePname, effectivePRname } = useDataStore();

  // Zustand form store - simple persistence
  const {
    formData: storedFormData,
    updateFormData,
    clearFormData,
    setProjectContext
  } = useCreateModelFormStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [projectScenarios, setProjectScenarios] = useState([]);
  const [expectedScenarios, setExpectedScenarios] = useState(storedFormData.expected_scenarios || [""]);

  const projectName = location.state?.projectName || effectivePname || storedFormData.projectName;
  const projectRunName = location.state?.projectRunName || effectivePRname || storedFormData.projectRunName;

  // Clear form data if project context changes
  useEffect(() => {
    if (projectName && projectRunName) {
      if (storedFormData.projectName && storedFormData.projectRunName &&
          (storedFormData.projectName !== projectName || storedFormData.projectRunName !== projectRunName)) {
        clearFormData();
      }
      setProjectContext(projectName, projectRunName);
    }
  }, [projectName, projectRunName, storedFormData.projectName, storedFormData.projectRunName, clearFormData, setProjectContext]);

  // Fetch teams for the modeling team dropdown
  const { data: teams = [] } = useListTeamsQuery(projectName, {
    enabled: !!projectName,
  });

  // Initialize react-hook-form with stored data or defaults
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    defaultValues: {
      name: storedFormData.name || "",
      display_name: storedFormData.display_name || "",
      type: storedFormData.type || "",
      description: storedFormData.description || "",
      modeling_team: storedFormData.modeling_team || "",
      assumptions: storedFormData.assumptions || [""],
      scheduled_start: storedFormData.scheduled_start || "",
      scheduled_end: storedFormData.scheduled_end || "",
      expected_scenarios: storedFormData.expected_scenarios || [""],
      scenario_mappings: storedFormData.scenario_mappings || {},
      other: storedFormData.other || {}
    }
  });

  // Local state for dynamic arrays
  const [assumptions, setAssumptions] = useState(storedFormData.assumptions || [""]);

  // Load project data
  const {
    data: currentProject,
    isLoading: isLoadingProject,
  } = useGetProjectQuery(projectName);

  // Load project run data
  const {
    data: currentProjectRun,
    isLoading: isLoadingProjectRun,
  } = useGetProjectRunQuery(projectName, projectRunName);

  // Create model mutation
  const createModelMutation = useCreateModelMutation();

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  // Extract scenarios from project run or project
  useEffect(() => {
    let scenarios = [];
    if (currentProjectRun?.scenarios) {
      scenarios = currentProjectRun.scenarios;
    } else if (currentProject?.scenarios) {
      scenarios = currentProject.scenarios.map(scenario =>
        typeof scenario === 'string' ? scenario : scenario.name
      );
    }
    setProjectScenarios(scenarios);
    setExpectedScenarios(scenarios.length > 0 ? scenarios : [""]);
    setValue("expected_scenarios", scenarios);
  }, [currentProject, currentProjectRun, setValue]);

  // Handlers for dynamic arrays
  const addAssumption = () => {
    const newAssumptions = [...assumptions, ""];
    setAssumptions(newAssumptions);
    setValue("assumptions", newAssumptions);
  };

  const removeAssumption = (index) => {
    const newAssumptions = [...assumptions];
    newAssumptions.splice(index, 1);
    setAssumptions(newAssumptions.length ? newAssumptions : [""]);
    setValue("assumptions", newAssumptions.length ? newAssumptions : [""]);
  };

  const addExpectedScenario = () => {
    const newScenarios = [...expectedScenarios, ""];
    setExpectedScenarios(newScenarios);
    setValue("expected_scenarios", newScenarios);
  };

  const removeExpectedScenario = (index) => {
    const newScenarios = [...expectedScenarios];
    newScenarios.splice(index, 1);
    setExpectedScenarios(newScenarios.length ? newScenarios : [""]);
    setValue("expected_scenarios", newScenarios.length ? newScenarios : [""]);
  };

  const validateDates = (scheduledStart, scheduledEnd) => {
    if (!scheduledStart || isNaN(new Date(scheduledStart))) {
      return "Valid start date is required";
    }

    if (!scheduledEnd || isNaN(new Date(scheduledEnd))) {
      return "Valid end date is required";
    }

    // Check if model dates are within project boundaries
    if (currentProject?.scheduled_start) {
      const projectStart = new Date(currentProject.scheduled_start);
      const modelStart = new Date(scheduledStart);
      if (modelStart < projectStart) {
        setError("scheduled_start", {
          message: `Start date must be after project start date (${projectStart.toLocaleDateString()})`
        });
        return false;
      }
    }

    if (currentProject?.scheduled_end) {
      const projectEnd = new Date(currentProject.scheduled_end);
      const modelEnd = new Date(scheduledEnd);
      if (modelEnd > projectEnd) {
        setError("scheduled_end", {
          message: `End date must be before project end date (${projectEnd.toLocaleDateString()})`
        });
        return false;
      }
    }

    if (new Date(scheduledStart) > new Date(scheduledEnd)) {
      setError("scheduled_end", { message: "End date must be after start date" });
      return false;
    }

    clearErrors(["scheduled_start", "scheduled_end"]);
    return true;
  };

  const handleNextStep = async () => {
    let fieldsToValidate = [];
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'type', 'scheduled_start', 'scheduled_end'];
        break;
      case 4:
        fieldsToValidate = ['modeling_team'];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    const datesAreValid = currentStep === 1 ? validateDates(watch('scheduled_start'), watch('scheduled_end')) : true;

    if (isValid && datesAreValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Save form data to store when it changes (debounced)
  const saveFormData = () => {
    const currentData = watch();
    updateFormData({
      ...currentData,
      assumptions,
      expected_scenarios: expectedScenarios,
      projectName,
      projectRunName
    });
  };

  // Debounce save function
  useEffect(() => {
    const timer = setTimeout(saveFormData, 1000); // Save after 1 second of inactivity
    return () => clearTimeout(timer);
  }, [watch(), assumptions, expectedScenarios, projectName, projectRunName]);

  const onSubmit = async (data) => {
    clearErrors();
    setFormError(false);
    setFormErrorMessage("");
    setErrorDetails([]);

    // Clean and format data for API
    const formData = { ...data };

    // Clean assumptions
    formData.assumptions = assumptions.filter(assumption => assumption.trim() !== "");

    // Clean expected scenarios
    formData.expected_scenarios = expectedScenarios.filter(scenario => scenario.trim() !== "");

    // Clean scenario mappings
    const cleanedMappings = [];
    Object.entries(data.scenario_mappings || {}).forEach(([id, mappingData]) => {
      if (mappingData.model_scenario?.trim()) {
        cleanedMappings.push({
          model_scenario: mappingData.model_scenario.trim(),
          project_scenarios: mappingData.project_scenarios || [],
          description: mappingData.description?.filter(desc => desc.trim() !== "") || [],
          other: mappingData.other || {}
        });
      }
    });
    formData.scenario_mappings = cleanedMappings;

    // Validate dates
    const dateValidation = validateDates(formData.scheduled_start, formData.scheduled_end);
    if (dateValidation !== true) {
      setError("scheduled_start", { message: dateValidation });
      setError("scheduled_end", { message: dateValidation });
      return;
    }

    // Convert date strings to ISO datetime format for API
    if (formData.scheduled_start) {
      const startDate = new Date(formData.scheduled_start + 'T00:00:00.000Z');
      formData.scheduled_start = startDate.toISOString();
    }

    if (formData.scheduled_end) {
      const endDate = new Date(formData.scheduled_end + 'T23:59:59.999Z');
      formData.scheduled_end = endDate.toISOString();
    }

    // Format final payload
    const cleanedFormData = {
      name: formData.name.trim(),
      display_name: formData.display_name?.trim() || null,
      type: formData.type.trim(),
      description: formData.description?.trim() || null,
      modeling_team: formData.modeling_team.trim(),
      assumptions: formData.assumptions,
      scheduled_start: formData.scheduled_start,
      scheduled_end: formData.scheduled_end,
      expected_scenarios: formData.expected_scenarios,
      scenario_mappings: formData.scenario_mappings,
      other: formData.other || {}
    };

    try {
      await createModelMutation.mutateAsync({
        projectName: projectName,
        projectRunName: projectRunName,
        data: cleanedFormData
      });

      // Clear stored form data on successful submission
      clearFormData();

      // Navigate to dashboard on success
      navigate('/project/dashboard');
    } catch (error) {
      setFormError(true);
      setFormErrorMessage("Failed to create model");

      if (error.response?.data?.message) {
        setFormErrorMessage(error.response.data.message);
      }

      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          setErrorDetails(error.response.data.detail.map(detail =>
            typeof detail === 'object' ? JSON.stringify(detail) : detail
          ));
        } else {
          setErrorDetails([error.response.data.detail]);
        }
      } else {
        setErrorDetails([error.message || "An unexpected error occurred"]);
      }

      if (error.response?.data?.fields) {
        Object.entries(error.response.data.fields).forEach(([field, message]) => {
          setError(field, { message });
        });
      }
    }
  };

  // Show loading state
  if (isLoadingProject || isLoadingProjectRun) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading project data...</p>
      </Container>
    );
  }

  const allData = watch();

  const canNavigateToStep = (stepNumber) => {
    // Can always go back to previous steps or stay on current step
    if (stepNumber <= currentStep) {
      return true;
    }

    // To move forward, validate current step
    if (stepNumber === currentStep + 1) {
      // We let handleNextStep perform validation when clicked
      return true;
    }

    // Don't allow skipping ahead by more than one step
    return false;
  };

  const handleStepClick = async (stepNumber) => {
    // Going to previous step doesn't need validation
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      return;
    }

    // Going to next step (handleNextStep already has validation logic)
    if (stepNumber === currentStep + 1) {
      await handleNextStep();
      return;
    }

    // Stay on same step
    if (stepNumber === currentStep) {
      return;
    }
  };

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, mCreate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Create Model"/>
        </Row>

        <Row className="g-0">
          <Col>
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

            <div className="px-3 py-3">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={5}
                onStepClick={handleStepClick}
                canNavigateTo={canNavigateToStep}
              />

              <div className="step-content">
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="form-container">
                    {currentStep === 1 && (
                      <div className="step-panel">
                        <div className="mb-4">
                          <Form.Label className="form-field-label required-field">Model Name</Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control-lg form-primary-input"
                            placeholder="Enter model name"
                            isInvalid={!!errors.name}
                            {...register("name", { required: "Model name is required" })}
                          />
                          <Form.Control.Feedback type="invalid" className="text-start">
                            {errors.name?.message}
                          </Form.Control.Feedback>
                        </div>
                        <div className="mb-4">
                          <Form.Label className="form-field-label">Display Name</Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control-lg form-primary-input"
                            placeholder="Enter display name (optional)"
                            {...register("display_name")}
                          />
                        </div>
                        <div className="mb-4">
                          <Form.Label className="form-field-label required-field">Type</Form.Label>
                          <Form.Control
                            type="text"
                            className="form-control-lg form-primary-input"
                            placeholder="e.g., Capacity Expansion"
                            isInvalid={!!errors.type}
                            {...register("type", { required: "Model type is required" })}
                          />
                          <Form.Control.Feedback type="invalid" className="text-start">
                            {errors.type?.message}
                          </Form.Control.Feedback>
                        </div>
                        <div className="mb-4">
                          <Form.Label className="form-field-label">Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            className="form-control-lg form-primary-input"
                            placeholder="Enter a brief description for the model"
                            {...register("description")}
                          />
                        </div>
                        <Row>
                          <Col md={6} className="form-field-group">
                            <Form.Label className="form-field-label required-field">
                              <span className="form-field-text">Scheduled Start</span>
                            </Form.Label>
                            {currentProject?.scheduled_start && (
                              <Form.Text className="text-muted d-block text-start">
                                Date must be after{" "}
                                {new Date(currentProject.scheduled_start).toLocaleDateString()}
                              </Form.Text>
                            )}
                            <Form.Control
                              id="scheduled_start"
                              type="date"
                              className="form-control-lg form-date-input"
                              isInvalid={!!errors.scheduled_start}
                              placeholder="mm/dd/yyyy"
                              {...register("scheduled_start", {
                                required: "Start date is required"
                              })}
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
                            {currentProject?.scheduled_end && (
                              <Form.Text className="text-muted d-block text-start">
                                Date must be before{" "}
                                {new Date(currentProject.scheduled_end).toLocaleDateString()}
                              </Form.Text>
                            )}
                            <Form.Control
                              id="scheduled_end"
                              type="date"
                              className="form-control-lg form-date-input"
                              isInvalid={!!errors.scheduled_end}
                              placeholder="mm/dd/yyyy"
                              {...register("scheduled_end", {
                                required: "End date is required"
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
                    )}

                    {currentStep === 2 && (
                      <div className="step-panel">
                        <div className="mb-4">
                          <Form.Label className="form-field-label">Expected Scenarios</Form.Label>
                          <div>
                            {expectedScenarios.map((scenario, index) => (
                              <div key={index} className="d-flex mb-2 align-items-center gap-2">
                                <Form.Control
                                  className="form-control-lg form-primary-input"
                                  placeholder="Enter expected scenario"
                                  value={scenario}
                                  onChange={(e) => {
                                    const newScenarios = [...expectedScenarios];
                                    newScenarios[index] = e.target.value;
                                    setExpectedScenarios(newScenarios);
                                    setValue("expected_scenarios", newScenarios);
                                  }}
                                />
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  type="button"
                                  onClick={() => removeExpectedScenario(index)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline-primary"
                              type="button"
                              onClick={addExpectedScenario}
                              className="d-flex align-items-center gap-2"
                              style={{ padding: "0.5rem 1rem" }}
                            >
                              <Plus size={16} />
                              Expected Scenario
                            </Button>
                          </div>
                        </div>
                        <ScenarioMappingsSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          projectScenarios={projectScenarios}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="step-panel">
                        <div className="mb-4">
                          <Form.Label className="form-field-label">Assumptions</Form.Label>
                          <div>
                            {assumptions.map((assumption, index) => (
                              <div key={index} className="d-flex mb-2 align-items-center gap-2">
                                <Form.Control
                                  className="form-control-lg form-primary-input"
                                  placeholder="Enter assumption"
                                  value={assumption}
                                  onChange={(e) => {
                                    const newAssumptions = [...assumptions];
                                    newAssumptions[index] = e.target.value;
                                    setAssumptions(newAssumptions);
                                    setValue("assumptions", newAssumptions);
                                  }}
                                />
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  type="button"
                                  onClick={() => removeAssumption(index)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline-primary"
                              type="button"
                              onClick={addAssumption}
                              className="d-flex align-items-center gap-2"
                              style={{ padding: "0.5rem 1rem" }}
                            >
                              <Plus size={16} />
                              Assumption
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="step-panel">
                        <div className="mb-4">
                          <Form.Label className="form-field-label required-field">Modeling Team</Form.Label>
                          <div className="d-flex align-items-start gap-2">
                            <div className="flex-grow-1">
                              <Form.Select
                                className="form-control-lg form-primary-input"
                                isInvalid={!!errors.modeling_team}
                                {...register("modeling_team", { required: "Modeling team is required" })}
                              >
                                <option value="">Select a team</option>
                                {teams.map((team) => (
                                  <option key={team.name} value={team.name}>
                                    {team.name}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid" className="text-start">
                                {errors.modeling_team?.message}
                              </Form.Control.Feedback>
                            </div>
                            <Button
                              variant="outline-primary"
                              type="button"
                              onClick={() => navigate('/create-team')}
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                minWidth: '48px',
                                height: '48px',
                                padding: '0'
                              }}
                              title="Create a new team"
                            >
                              <Plus size={20} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="step-panel">

                        {/* Basic Information Section */}
                        <div className="review-section mb-4">
                          <div className="review-content">
                            <Row>
                              <Col md={6}>
                                <div className="review-item mb-3">
                                  <div className="review-label">Model Name</div>
                                  <div className="review-value">{allData.name || 'Not specified'}</div>
                                </div>
                                <div className="review-item mb-3">
                                  <div className="review-label">Display Name</div>
                                  <div className="review-value">{allData.display_name || 'Not specified'}</div>
                                </div>
                                <div className="review-item mb-3">
                                  <div className="review-label">Type</div>
                                  <div className="review-value">{allData.type || 'Not specified'}</div>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="review-item mb-3">
                                  <div className="review-label">Scheduled Start</div>
                                  <div className="review-value">{allData.scheduled_start || 'Not specified'}</div>
                                </div>
                                <div className="review-item mb-3">
                                  <div className="review-label">Scheduled End</div>
                                  <div className="review-value">{allData.scheduled_end || 'Not specified'}</div>
                                </div>
                                <div className="review-item mb-3">
                                  <div className="review-label">Description</div>
                                  <div className="review-value">{allData.description || 'Not specified'}</div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>

                        {/* Scenarios Section */}
                        <div className="review-section mb-4">
                          <div className="review-content">
                            <div className="review-item">
                              <div className="review-label">Expected Scenarios</div>
                              {expectedScenarios.filter(s => s.trim()).length > 0 ? (
                                <ul className="review-list-items mt-2 ps-3">
                                  {expectedScenarios.filter(s => s.trim()).map((scenario, i) => (
                                    <li key={i}>{scenario}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="review-value text-muted">No scenarios specified</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Assumptions Section */}
                        <div className="review-section mb-4">
                          <div className="review-content">
                            <div className="review-item">
                              <div className="review-label">Assumptions</div>
                              {assumptions.filter(a => a.trim()).length > 0 ? (
                                <ul className="review-list-items mt-2 ps-3">
                                  {assumptions.filter(a => a.trim()).map((assumption, i) => (
                                    <li key={i}>{assumption}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="review-value text-muted">No assumptions specified</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Modeling Team Section */}
                        <div className="review-section">
                          <div className="review-content">
                            <div className="review-item">
                              <div className="review-label">Modeling Team</div>
                              <div className="review-value">{allData.modeling_team || 'Not selected'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 d-flex justify-content-between form-action-buttons">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="action-button"
                    >
                      Previous
                    </Button>

                    {currentStep < 5 ? (
                      <Button
                        style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                        variant="primary"
                        type="button"
                        onClick={handleNextStep}
                        className="action-button"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="action-button"
                      >
                        {isSubmitting ? "Creating Model..." : "Create Model"}
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateModelPage;
