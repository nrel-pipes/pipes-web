import { Minus, Plus } from "lucide-react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import BasicInfoSection from "./Components/StepFroms/BasicInfoSection";
import ScenarioMappingsSection from "./Components/StepFroms/ScenarioMappingsSection";

import { useGetModelQuery, useUpdateModelMutation } from "../../hooks/useModelQuery";
import { useGetProjectQuery } from "../../hooks/useProjectQuery";
import { useGetProjectRunQuery } from "../../hooks/useProjectRunQuery";
import { useListTeamsQuery } from "../../hooks/useTeamQuery";
import { useCreateModelFormStore } from "../../stores/FormStore/ModelStore";

import { useEffect, useState } from "react";

import "../FormStyles.css";
import "../PageStyles.css";
import "./CreateModelPage.css";


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


const UpdateModelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = useAuthStore();
  const { modelName } = useParams();

  // Get params from URL
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get('P');
  const projectRunName = searchParams.get('p');

  // Zustand form store - simple persistence
  const {
    formData,
    updateFormData,
    clearFormData,
  } = useCreateModelFormStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [projectScenarios, setProjectScenarios] = useState([]);
  const [expectedScenarios, setExpectedScenarios] = useState([""]);
  const [assumptions, setAssumptions] = useState([""]);

  // Fetch model data for update
  const {
    data: modelData,
    isLoading: isLoadingModel,
    isError: isErrorModel,
    error: errorModel,
  } = useGetModelQuery(projectName, projectRunName, modelName);

  // Fetch teams for the modeling team dropdown
  const { data: teams = [] } = useListTeamsQuery(projectName, {
    enabled: !!projectName,
  });

  // Fetch project and project run
  const {
    data: currentProject,
    isLoading: isLoadingProject,
  } = useGetProjectQuery(projectName);

  const {
    data: currentProjectRun,
    isLoading: isLoadingProjectRun,
  } = useGetProjectRunQuery(projectName, projectRunName);

  // Update model mutation
  const updateModelMutation = useUpdateModelMutation();

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

  // Initialize react-hook-form
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
    reset, // <-- add reset from useForm
  } = useForm({
    defaultValues: {
      name: "",
      display_name: "",
      type: "",
      description: "",
      modeling_team: "",
      assumptions: [""],
      scheduled_start: "",
      scheduled_end: "",
      expected_scenarios: [""],
      scenario_mappings: {},
      other: {}
    }
  });

  // Fill form with model data when loaded
  useEffect(() => {
    if (modelData) {
      // Use reset to fill the form with all fields at once
      reset({
        name: modelData.name || "",
        display_name: modelData.display_name || "",
        type: modelData.type || "",
        description: modelData.description || "",
        modeling_team: modelData.modeling_team || "",
        scheduled_start: modelData.scheduled_start ? modelData.scheduled_start.slice(0, 10) : "",
        scheduled_end: modelData.scheduled_end ? modelData.scheduled_end.slice(0, 10) : "",
        assumptions: Array.isArray(modelData.assumptions) ? modelData.assumptions : [""],
        expected_scenarios: Array.isArray(modelData.expected_scenarios) ? modelData.expected_scenarios : [""],
        scenario_mappings: modelData.scenario_mappings || {},
        other: modelData.other || {}
      });
      setAssumptions(Array.isArray(modelData.assumptions) ? modelData.assumptions : [""]);
      setExpectedScenarios(Array.isArray(modelData.expected_scenarios) ? modelData.expected_scenarios : [""]);
    }
    // eslint-disable-next-line
  }, [modelData, reset]);

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

  useEffect(() => {
    const timer = setTimeout(saveFormData, 1000);
    return () => clearTimeout(timer);
  }, [watch(), assumptions, expectedScenarios, projectName, projectRunName]);

  const onSubmit = async (data) => {
    clearErrors();
    setFormError(false);
    setFormErrorMessage("");
    setErrorDetails([]);

    // Clean and format data for API
    const formData = { ...data };
    formData.assumptions = assumptions.filter(assumption => assumption.trim() !== "");
    formData.expected_scenarios = expectedScenarios.filter(scenario => scenario.trim() !== "");
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

    const dateValidation = validateDates(formData.scheduled_start, formData.scheduled_end);
    if (dateValidation !== true) {
      setError("scheduled_start", { message: dateValidation });
      setError("scheduled_end", { message: dateValidation });
      return;
    }

    if (formData.scheduled_start) {
      const startDate = new Date(formData.scheduled_start + 'T00:00:00.000Z');
      formData.scheduled_start = startDate.toISOString();
    }
    if (formData.scheduled_end) {
      const endDate = new Date(formData.scheduled_end + 'T23:59:59.999Z');
      formData.scheduled_end = endDate.toISOString();
    }

    // Clean up description
    let descriptionValue = formData.description;
    if (Array.isArray(descriptionValue)) {
      descriptionValue = descriptionValue.filter(Boolean).join(" ");
    }
    if (descriptionValue == null) {
      descriptionValue = "";
    }

    const cleanedFormData = {
      name: formData.name.trim(),
      display_name: formData.display_name?.trim() || null,
      type: formData.type.trim(),
      description: descriptionValue,
      modeling_team: formData.modeling_team.name,
      assumptions: formData.assumptions,
      scheduled_start: formData.scheduled_start,
      scheduled_end: formData.scheduled_end,
      expected_scenarios: formData.expected_scenarios,
      scenario_mappings: formData.scenario_mappings,
      other: formData.other || {}
    };

    try {
      await updateModelMutation.mutateAsync({
        projectName: projectName,
        projectRunName: projectRunName,
        modelName: modelName,
        data: cleanedFormData
      });

      clearFormData();
      navigate(`/model/${encodeURIComponent(modelName)}?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`);
    } catch (error) {
      setFormError(true);
      setFormErrorMessage("Failed to update model");
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
  if (isLoadingModel || isLoadingProject || isLoadingProjectRun) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading model data...</p>
      </Container>
    );
  }

  if (isErrorModel) {
    return (
      <Container className="mt-5 text-center">
        <div className="alert alert-danger">
          <h5>Error loading model</h5>
          <div>{errorModel?.message || "Model not found."}</div>
        </div>
      </Container>
    );
  }

  const allData = watch();

  const canNavigateToStep = (stepNumber) => {
    if (stepNumber <= currentStep) return true;
    if (stepNumber === currentStep + 1) return true;
    return false;
  };

  const handleStepClick = async (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      return;
    }
    if (stepNumber === currentStep + 1) {
      await handleNextStep();
      return;
    }
    if (stepNumber === currentStep) {
      return;
    }
  };

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, mName: modelName, toUpdate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Update Model"/>
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
                        <BasicInfoSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          projectRun={null}
                          storedData={null}
                        />
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
                              onClick={() => navigate(`/team/new?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`)}
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
                        {isSubmitting ? "Updating Model..." : "Update Model"}
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

export default UpdateModelPage;
