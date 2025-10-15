import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import AssumptionsSection from "./Components/StepFroms/AssumptionsSection";
import BasicInfoSection from "./Components/StepFroms/BasicInfoSection";
import ExpectedScenariosSection from "./Components/StepFroms/ExpectedScenariosSection";
import FinalReviewSection from "./Components/StepFroms/FinalReviewSection";
import RequirementsSection from "./Components/StepFroms/RequirementsSection";

import { useGetCatalogModelQuery, useUpdateCatalogModelMutation } from "../../hooks/useCatalogModelQuery";
import { useUpdateCatalogModelFormStore } from "../../stores/FormStore/CatalogModelStore";
import "../FormStyles.css";
import "../PageStyles.css";
import "./CreateCatalogModelPage.css";


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



const UpdateCatalogModelPage = () => {
  const navigate = useNavigate();
  const { modelName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isModelLoading, setIsModelLoading] = useState(true);

  const { checkAuthStatus } = useAuthStore();

  // Fetch existing model data
  const { data: modelData, isLoading: isModelDataLoading, error: modelError } = useGetCatalogModelQuery(modelName);

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

  // Zustand form store - simple persistence
  const {
    formData: storedFormData,
    updateFormData,
    clearFormData,
  } = useUpdateCatalogModelFormStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [projectScenarios, setProjectScenarios] = useState([]);
  const [expectedScenarios, setExpectedScenarios] = useState(storedFormData.expectedScenarios || []);
  const [requirements, setRequirements] = useState(storedFormData.requirements || {});
  const [assumptions, setAssumptions] = useState(storedFormData.assumptions || []);

  // Initialize react-hook-form with stored data or model data
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
    reset
  } = useForm({
    defaultValues: {
      name: "",
      displayName: "",
      type: "",
      description: "",
      expectedScenarios: [""],
      assumptions: [""],
      requirements: {},
      other: {}
    }
  });

  // Load model data into form when available
  useEffect(() => {
    if (modelData && !isModelDataLoading) {
      // Convert API requirements format to form internal structure
      const convertedRequirements = {};
      if (modelData.requirements && typeof modelData.requirements === 'object') {
        Object.entries(modelData.requirements).forEach(([key, value], index) => {
          const reqId = `req_${index}`;
          if (typeof value === 'string') {
            convertedRequirements[reqId] = {
              name: key,
              type: 'string',
              value: value
            };
          } else if (typeof value === 'object' && value !== null) {
            convertedRequirements[reqId] = {
              name: key,
              type: 'object',
              value: value
            };
          }
        });
      }

      const formDefaults = {
        name: modelData.name || "",
        displayName: modelData.display_name || "",
        type: modelData.type || "",
        description: modelData.description || "",
        expectedScenarios: modelData.expected_scenarios?.length > 0 ? modelData.expected_scenarios : [""],
        assumptions: modelData.assumptions?.length > 0 ? modelData.assumptions : [""],
        requirements: convertedRequirements,
        other: modelData.other || {}
      };

      // Check if we have stored data for this specific model
      const hasStoredData = storedFormData.name === modelData.name;
      const dataToUse = hasStoredData ? storedFormData : formDefaults;

      // Update form with data
      reset(dataToUse);

      // Update local state
      setExpectedScenarios(dataToUse.expectedScenarios || []);
      setRequirements(dataToUse.requirements || {});
      setAssumptions(dataToUse.assumptions || []);

      setIsModelLoading(false);
    }
  }, [modelData, isModelDataLoading, reset]);

  // Handle model loading error
  useEffect(() => {
    if (modelError) {
      console.error("Error loading model:", modelError);
      navigate("/catalogmodels");
    }
  }, [modelError, navigate]);

  // Update local state when form requirements and assumptions change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith('requirements')) {
        setRequirements(value.requirements || {});
      }
      if (name && name.startsWith('assumptions')) {
        setAssumptions(value.assumptions || []);
      }
      if (name && name.startsWith('expectedScenarios')) {
        setExpectedScenarios(value.expectedScenarios || []);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Debounce save function - watch all form changes
  useEffect(() => {
    let timer;
    const subscription = watch((value) => {
      // Clear previous timer
      if (timer) {
        clearTimeout(timer);
      }
      // Set new timer
      timer = setTimeout(() => {
        updateFormData(value);
      }, 1000);
    });

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      subscription.unsubscribe();
    };
  }, [watch, updateFormData]);

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
      assumptions: formData.assumptions,
      expected_scenarios: formData.expectedScenarios,
      requirements: formData.requirements,
      other: formData.other || {}
    };

    try {
      await updateCatalogModelMutation.mutateAsync({
        modelName: modelName,
        data: cleanedFormData
      });

      // Clear stored form data on successful submission
      clearFormData();

      // Navigate to models page on success
      navigate('/catalogmodels');
    } catch (error) {
      setFormError(true);
      setFormErrorMessage("Failed to update model in catalog.");

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

  // Update model mutation
  const updateCatalogModelMutation = useUpdateCatalogModelMutation();

  // Extract scenarios from project run or project
  useEffect(() => {
    let scenarios = [];
    setProjectScenarios(scenarios);
  }, []);

  const handleNextStep = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    let fieldsToValidate = [];
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'type'];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

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

  const steps = ["Basic Info", "Scenarios", "Requirements", "Assumptions", "Review"];
  const totalSteps = steps.length;

  // Show loading state
  if (isAuthChecking || isModelLoading || isModelDataLoading) {
    return (
      <>
        <NavbarSub navData={{ cmList: true, cmName: modelName, toUpdate: true }} />
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <Row className="w-100 mx-0">
            <ContentHeader title="Update Model"/>
          </Row>
          <Row className="g-0">
            <Col>
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading model data...</p>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ cmList: true, cmName: modelName, toUpdate: true }} />
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
                        />
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="step-panel">
                        <FinalReviewSection
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
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

export default UpdateCatalogModelPage;
