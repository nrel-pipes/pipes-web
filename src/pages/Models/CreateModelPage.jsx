import { useEffect, useState } from "react";

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

import AssumptionsSection from "./Components/StepFroms/AssumptionsSection";
import BasicInfoSection from "./Components/StepFroms/BasicInfoSection";
import ExpectedScenariosSection from "./Components/StepFroms/ExpectedScenariosSection";
import FinalReviewSection from "./Components/StepFroms/FinalReviewSection";
import ModelingTeamSection from "./Components/StepFroms/ModelingTeamSection";
import RequirementsSection from "./Components/StepFroms/RequirementsSection";

import { useCreateModelMutation } from "../../hooks/useModelQuery";
import { useGetProjectQuery } from "../../hooks/useProjectQuery";
import { useGetProjectRunQuery } from "../../hooks/useProjectRunQuery";
import { useCreateModelFormStore } from "../../stores/FormStore/ModelStore";

import "../FormStyles.css";
import "../PageStyles.css";
import "./CreateModelPage.css";


const StepIndicator = ({ currentStep, totalSteps, onStepClick, canNavigateTo, steps }) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  return (
    <div className="step-form-container">
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
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get("P");
  const projectRunName = searchParams.get("p");

  const { checkAuthStatus } = useAuthStore();

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
  const [expectedScenarios, setExpectedScenarios] = useState(storedFormData.expectedScenarios || []);
  const [requirements, setRequirements] = useState(storedFormData.requirements || {});
  const [assumptions, setAssumptions] = useState(storedFormData.assumptions || []);
  const [scenarioMappings, setScenarioMappings] = useState(storedFormData.scenarioMappings || {});
  const [modelingTeam, setModelingTeam] = useState(storedFormData.modelingTeam || "");

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
    reset // <-- add reset from useForm
  } = useForm({
    defaultValues: {
      name: storedFormData.name || "",
      displayName: storedFormData.displayName || "",
      type: storedFormData.type || "",
      description: storedFormData.description || "",
      scheduledStart: storedFormData.scheduledStart || "",
      scheduledEnd: storedFormData.scheduledEnd || "",
      expectedScenarios: storedFormData.expectedScenarios || [""],
      modelingTeam: storedFormData.modelingTeam || "",
      assumptions: storedFormData.assumptions || [""],
      scenarioMappings: storedFormData.scenarioMappings || {},
      requirements: storedFormData.requirements || {},
      other: storedFormData.other || {}
    }
  });

  // Save form data to store when it changes (debounced)
  const saveFormData = () => {
    const currentData = watch();
    updateFormData({
      ...currentData,
      expectedScenarios,
      requirements,
      assumptions,
      modelingTeam,
      scenarioMappings,
      projectName,
      projectRunName
    });
  };

  // Update local state when form requirements and assumptions change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith('requirements')) {
        setRequirements(value.requirements || {});
      }
      if (name && name.startsWith('assumptions')) {
        setAssumptions(value.assumptions || []);
      }
      if (name === 'modelingTeam') {
        setModelingTeam(value.modelingTeam || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Debounce save function
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentData = watch();
      updateFormData({
        ...currentData,
        expectedScenarios: currentData.expectedScenarios || [],
        requirements: currentData.requirements || {},
        assumptions: currentData.assumptions || [],
        modelingTeam: currentData.modelingTeam || "",
        scenarioMappings: currentData.scenarioMappings || {},
        projectName,
        projectRunName
      });
    }, 1000); // Save after 1 second of inactivity
    return () => clearTimeout(timer);
  }, [watch, updateFormData, projectName, projectRunName]);

  const onSubmit = async (data) => {
    clearErrors();
    setFormError(false);
    setFormErrorMessage("");
    setErrorDetails([]);

    // Clean and format data for API
    const formData = { ...data };

    // Clean assumptions - now comes directly from form data
    formData.assumptions = (data.assumptions || []).filter(assumption => assumption.trim() !== "");

    // Clean expected scenarios
    formData.expectedScenarios = (data.expectedScenarios || []).filter(scenario => scenario && scenario.trim() !== "");

    // Clean scenario mappings
    const cleanedMappings = [];
    Object.entries(data.scenarioMappings || {}).forEach(([id, mappingData]) => {
      if (mappingData.modelScenario?.trim()) {
        cleanedMappings.push({
          model_scenario: mappingData.modelScenario.trim(),
          project_scenarios: mappingData.projectScenarios || [],
          description: mappingData.description?.filter(desc => desc.trim() !== "") || [],
          other: mappingData.other || {}
        });
      }
    });
    formData.scenarioMappings = cleanedMappings;

    // Clean requirements - convert internal structure to API expected format
    const cleanedRequirements = {};
    Object.entries(data.requirements || {}).forEach(([id, reqData]) => {
      const key = reqData.name?.trim();
      if (key) {
        if (reqData.type === "string" && reqData.value.trim() !== "") {
          cleanedRequirements[key] = reqData.value;
        } else if (reqData.type === "object") {
          const cleanedObject = {};
          Object.entries(reqData.value || {}).forEach(([field, val]) => {
            if (val && val.trim() !== "") {
              cleanedObject[field] = val;
            }
          });
          if (Object.keys(cleanedObject).length > 0) {
            cleanedRequirements[key] = cleanedObject;
          }
        }
      }
    });
    formData.requirements = cleanedRequirements;

    // Validate dates
    const dateValidation = validateDates(formData.scheduledStart, formData.scheduledEnd);
    if (dateValidation !== true) {
      setError("scheduledStart", { message: dateValidation });
      setError("scheduledEnd", { message: dateValidation });
      return;
    }

    // Convert date strings to ISO datetime format for API
    if (formData.scheduledStart) {
      const startDate = new Date(formData.scheduledStart + 'T00:00:00.000Z');
      formData.scheduledStart = startDate.toISOString();
    }

    if (formData.scheduledEnd) {
      const endDate = new Date(formData.scheduledEnd + 'T23:59:59.999Z');
      formData.scheduledEnd = endDate.toISOString();
    }

    // Format final payload
    let descriptionValue = formData.description;
    if (Array.isArray(descriptionValue)) {
      descriptionValue = descriptionValue.filter(Boolean).join(" ");
    }
    if (descriptionValue == null) {
      descriptionValue = "";
    }

    const cleanedFormData = {
      name: formData.name.trim(),
      display_name: formData.displayName?.trim() || null,
      type: formData.type.trim(),
      description: descriptionValue,
      modeling_team: formData.modelingTeam?.name || formData.modelingTeam,
      assumptions: formData.assumptions,
      scheduled_start: formData.scheduledStart,
      scheduled_end: formData.scheduledEnd,
      expected_scenarios: formData.expectedScenarios,
      scenario_mappings: formData.scenarioMappings,
      requirements: formData.requirements,
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

      // Reset local state and form to initial values
      setRequirements({});
      reset({
        name: "",
        displayName: "",
        type: "",
        description: "",
        modelingTeam: "",
        assumptions: [""],
        scheduledStart: "",
        scheduledEnd: "",
        expectedScenarios: [""],
        scenarioMappings: {},
        requirements: {},
        other: {}
      });
      setCurrentStep(1);

      // Navigate to models page on success
      navigate(`/projectrun/${encodeURIComponent(projectRunName)}?P=${encodeURIComponent(projectName)}`);
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

  // Extract scenarios from project run or project
  useEffect(() => {
    let scenarios = [];
    if (currentProjectRun?.scenarios) {
      scenarios = currentProjectRun.scenarios;
    }
    if (scenarios.length === 0 && currentProject?.scenarios) {
      scenarios = currentProject.scenarios.map(scenario =>
        typeof scenario === 'string' ? scenario : scenario.name
      );
    }
    setProjectScenarios(scenarios);
    setValue("expectedScenarios", storedFormData.expectedScenarios || []);
  }, [currentProject, currentProjectRun, setValue, storedFormData.expectedScenarios]);

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
        setError("scheduledStart", {
          message: `Start date must be after project start date (${projectStart.toLocaleDateString()})`
        });
        return false;
      }
    }

    if (currentProject?.scheduled_end) {
      const projectEnd = new Date(currentProject.scheduled_end);
      const modelEnd = new Date(scheduledEnd);
      if (modelEnd > projectEnd) {
        setError("scheduledEnd", {
          message: `End date must be before project end date (${projectEnd.toLocaleDateString()})`
        });
        return false;
      }
    }

    if (new Date(scheduledStart) > new Date(scheduledEnd)) {
      setError("scheduledEnd", { message: "End date must be after start date" });
      return false;
    }

    clearErrors(["scheduledStart", "scheduledEnd"]);
    return true;
  };

  const handleNextStep = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let fieldsToValidate = [];
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'type', 'scheduledStart', 'scheduledEnd'];
        break;
      case 5:
        fieldsToValidate = ['modelingTeam'];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    const datesAreValid = currentStep === 1 ? validateDates(watch('scheduledStart'), watch('scheduledEnd')) : true;

    if (isValid && datesAreValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
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

  const steps = ["Basic Info", "Scenarios", "Requirements", "Assumptions", "Modeling Team", "Review"];
  const totalSteps = steps.length;

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
                totalSteps={totalSteps}
                onStepClick={handleStepClick}
                canNavigateTo={canNavigateToStep}
                steps={steps}
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
                          storedData={storedFormData}
                          projectRun={currentProjectRun}
                        />
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="step-panel">
                        <ExpectedScenariosSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                          projectScenarios={projectScenarios}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="step-panel">
                        <RequirementsSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="step-panel">
                        <AssumptionsSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                          projectRun={currentProjectRun}
                        />
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="step-panel">
                        <ModelingTeamSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                          projectName={projectName}
                        />
                      </div>
                    )}

                    {currentStep === 6 && (
                      <div className="step-panel">
                        <FinalReviewSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          projectRun={currentProjectRun}
                          storedData={storedFormData}
                        />
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

                    {/* Add a hidden submit button to prevent accidental Enter key submission */}
                    <button type="submit" style={{ display: "none" }} tabIndex={-1} aria-hidden="true"></button>

                    {currentStep !== totalSteps ? (
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
