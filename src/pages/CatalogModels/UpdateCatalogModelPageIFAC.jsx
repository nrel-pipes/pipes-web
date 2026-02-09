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

/* IFAC Step Forms */
import BasicInfoSectionIFAC from "./StepFroms/BasicInfoSectionIFAC";
import FinalReviewSectionIFAC from "./StepFroms/FinalReviewSectionIFAC";
import RequirementsSectionIFAC from "./StepFroms/RequirementsSectionIFAC";
import InputsSectionIFAC from "./StepFroms/InputsSectionIFAC";
import MaturitySectionIFAC from "./StepFroms/MaturitySectionIFAC";
import OutputsSectionIFAC from "./StepFroms/OutputsSectionIFAC";
import TeamsSectionIFAC from "./StepFroms/TeamsSectionIFAC";

/* General Step Forms */
import ListComponent from "./Components/ListComponent";
import NameDescListComponent from "./Components/NameDescListComponent";


import AssumptionsSection from "./StepFroms/AssumptionsSection";
import BasicInfoSection from "./StepFroms/BasicInfoSection";
import ExpectedScenariosSection from "./StepFroms/ExpectedScenariosSection";
import FinalReviewSection from "./StepFroms/FinalReviewSection";
import ModelingTeamSection from "./StepFroms/ModelingTeamSection";
import RequirementsSection from "./StepFroms/RequirementsSection";

import { useGetCatalogModelQuery, useUpdateCatalogModelMutation } from "../../hooks/useCatalogModelQuery";
import { useUpdateCatalogModelFormStore, useUpdateCatalogModelFormStoreIFAC } from "../../stores/FormStore/CatalogModelStore";
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



const UpdateCatalogModelPageIFAC = () => {
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
  } = useUpdateCatalogModelFormStoreIFAC();

  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [projectScenarios, setProjectScenarios] = useState([]);
  const [expected_scenarios, setExpectedScenarios] = useState(storedFormData.expected_scenarios || []);
  const [requirements, setRequirements] = useState(storedFormData.requirements || {});
  const [inputs, setInputs] = useState(storedFormData.inputs || {});
  const [outputs, setOutputs] = useState(storedFormData.outputs || {});
  const [assumptions, setAssumptions] = useState(storedFormData.assumptions || []);
  const [modelingTeam, setModelingTeam] = useState(storedFormData.modelingTeam || { name: '', members: [] });

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
      name: storedFormData.name || "",
      displayName: storedFormData.displayName || "",
      type: storedFormData.type || "",
      description: storedFormData.description || "",
      source: storedFormData.source || "",
      version: storedFormData.version || "",
      branch: storedFormData.branch || "",
      documentation: storedFormData.documentation || "",
      training: storedFormData.training || "",
      maturity: storedFormData.maturity || {},
      features: storedFormData.features || [""],
      use_cases: storedFormData.use_cases || [""],
      tags: storedFormData.tags || [""],
      expected_scenarios: storedFormData.expected_scenarios || [""],
      inputs: storedFormData.inputs || [],
      requirements: storedFormData.requirements || {},
      outputs: storedFormData.outputs || [],
      assumptions: storedFormData.assumptions || [""],
      teams: storedFormData.teams || [],
      config: storedFormData.config || {},
      other: storedFormData.other || {}
    }
  });

  // Load model data into form when available
  useEffect(() => {
    if (modelData && !isModelDataLoading) {
      // Convert API requirements format to form internal structure
      const convertedRequirements = {'spatial':{},'temporal':{},'environment':{}};
      const req_types = ['spatial','temporal','environment'];
      if (modelData.requirements && typeof modelData.requirements === 'object') {
        for (let i = 0; i < req_types.length; i++){
          if (modelData.requirements[req_types[i]]){
            convertedRequirements[req_types[i]] = {}
          }
          Object.entries(modelData.requirements[req_types[i]]).forEach(([key, value], index) => {
            convertedRequirements[req_types[i]][key] = {
              name: key,
              ...value
            };
          });
        }
      }

      const convertedInputs = {};
      if (modelData.inputs && Array.isArray(modelData.inputs)) {
        Object.entries(modelData.inputs).forEach((value) => {
          const inId = `input_${value[0]}`;
          const in_type = Object.keys(value[1])[0];
          convertedInputs[inId] = {
              type: in_type,
              [in_type]: value[1][in_type]
            };
        });
      }

      const convertedOutputs = {};
      if (modelData.inputs && Array.isArray(modelData.inputs)) {
        Object.entries(modelData.inputs).forEach((value) => {
          const outId = `output_${value[0]}`;
          const out_type = Object.keys(value[1])[0];
          convertedOutputs[outId] = {
              type: out_type,
              [out_type]: value[1][out_type]
            };
        });
      }

      const formDefaults = {
        name: modelData.name || "",
        displayName: modelData.display_name || "",
        type: modelData.type || "",
        description: modelData.description || "",
        source: modelData.source || "",
        version: modelData.version || "",
        branch: modelData.branch || "",
        documentation: modelData.documentation || "",
        training: modelData.training || "",
        maturity: modelData.maturity || {},
        features: modelData.features || [""],
        use_cases: modelData.use_cases || [""],
        tags: modelData.tags || [""],
        expected_scenarios: modelData.expected_scenarios?.length > 0 ? modelData.expected_scenarios : [],
        assumptions: modelData.assumptions?.length > 0 ? modelData.assumptions : [""],
        inputs: convertedInputs,
        outputs: convertedOutputs,
        requirements: convertedRequirements,
        teams: modelData.teams || [],
        config: modelData.config || {},
        other: modelData.other || {}
      };

      // Check if we have stored data for this specific model
      const hasStoredData = storedFormData.name === modelData.name;
      //const dataToUse = hasStoredData ? storedFormData : formDefaults;
      const dataToUse = formDefaults; // For now, we will prioritize loaded model data to avoid confusion

      // Update form with data
      reset(dataToUse);
      
      // Update local state
      setExpectedScenarios(dataToUse.expectedScenarios || []);
      setRequirements(dataToUse.requirements || {});
      setInputs(dataToUse.inputs || {});
      setOutputs(dataToUse.outputs || {});
      setAssumptions(dataToUse.assumptions || []);
      setModelingTeam(dataToUse.modelingTeam || { name: "", members: [] });

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
      if (name && name.startsWith('modelingTeam')) {
        setModelingTeam(value.modelingTeam || { name: '', members: [] });
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

    // Clean modeling team members - remove any members where all fields are empty
    if (formData.modelingTeam && Array.isArray(formData.modelingTeam.members)) {
      formData.modelingTeam.members = formData.modelingTeam.members.filter(member =>
        member.email?.trim() ||
        member.first_name?.trim() ||
        member.last_name?.trim() ||
        member.organization?.trim()
      );
    }

    // Clean assumptions - now comes directly from form data
    formData.assumptions = (data.assumptions || []).filter(assumption => assumption.trim() !== "");

    // Clean expected scenarios
    formData.expectedScenarios = (data.expectedScenarios || []).filter(scenario => scenario && scenario.trim() !== "");

    // Clean requirements - convert internal structure to API expected format
    let cleanedRequirements = {};
    const req_types = ['spatial','temporal','environment'];
    for (let i = 0; i < req_types.length; i++){
      if (data.requirements[req_types[i]]){
        cleanedRequirements[req_types[i]] = {}
      }
      Object.entries(data.requirements[req_types[i]] || {}).forEach(([id, reqData]) => {
        const key = reqData.name?.trim();
        if (key) {
          const cleanedObject = {};
          Object.entries(reqData || {}).forEach(([field, val]) => {
            if (Array.isArray(val)){
              cleanedObject[field] = Object.values(val || []).filter(element => element.trim() !== "");
            } else if (val.constructor === Object) {
              let cleanedSubObject = {};
              cleanedSubObject = Object.entries(val)
                                          .filter(([k, element]) => (k.trim() !== "" & element.trim() !== ""))
                                          .reduce((obj, k) => {return {...obj, [k]:val[k]}},{});
              if (Object.keys(cleanedSubObject).length > 0) {
                cleanedObject[field] = cleanedSubObject;
              }
            } else if (val && val.trim() !== "") {
              cleanedObject[field] = val;
            }
          });
          if (Object.keys(cleanedObject).length > 0) {
            cleanedRequirements[req_types[i]][key] = cleanedObject;
          }
        }
      });
    }
    
    formData.requirements = cleanedRequirements;

    // Inputs/outputs
    let cleanedInputs = [];
    Object.entries(data.inputs || {}).forEach(([id, reqData]) => {
      if (reqData['type']){
        cleanedInputs = [...cleanedInputs, reqData[reqData['type']]]
      }
    }); 

    formData.inputs = cleanedInputs;

    let cleanedOuputs = [];
    Object.entries(data.outputs || {}).forEach(([id, outData]) => {
      if (outData['type']){
        cleanedOuputs = [...cleanedOuputs, outData[outData['type']]]
      }
    }); 

    formData.outputs = cleanedOuputs;

    // Format final payload
    let descriptionValue = formData.description;
    if (Array.isArray(descriptionValue)) {
      descriptionValue = descriptionValue.filter(Boolean).join(" ");
    }
    if (descriptionValue == null) {
      descriptionValue = "";
    }

    const cleanedFormData = {
      catalog_schema: "IFAC Tool Specsheet v1.0",
      name: formData.name.trim(),
      display_name: formData.displayName?.trim() || null,
      type: formData.type.trim(),
      description: descriptionValue,
      use_cases: formData.use_cases,
      source: formData.source.trim(),
      version: formData.version.trim(),
      branch: formData.branch.trim(),
      documentation: formData.documentation.trim(),
      training: formData.training.trim(),
      teams: formData.teams,
      assumptions: formData.assumptions,
      features: formData.features,
      tags: formData.tags,
      expected_scenarios: formData.expectedScenarios || [],
      maturity: formData.maturity,
      inputs: formData.inputs,
      requirements: formData.requirements,
      outputs: formData.outputs,
      other: formData.other || {},
      config: formData.config || {}
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
      case 5:
        fieldsToValidate = ['modelingTeam.name'];
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

  const steps = ["Basic Info", "Scenarios/Assumptions", "Maturity", "Requirements", "Inputs", "Outputs", "Teams", "Review"];
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
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <BasicInfoSectionIFAC
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                        <ListComponent
                          name="Use Case"
                          description="List of IFAC Use Cases the tool applies to"
                          fieldName="use_cases"
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                        <ListComponent
                          name="Feature"
                          description="List of tool features"
                          fieldName="features"
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
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <NameDescListComponent
                          name="Expected Scenario"
                          description="List of expected tool scenarios"
                          fieldName="expected_scenarios"
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                        <ListComponent
                          name="Assumption"
                          description="Add key assumptions for your model"
                          fieldName="assumptions"
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <MaturitySectionIFAC
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                        <ListComponent
                          name="Workflow Integration"
                          description="List of tools this tool has integrated with."
                          fieldName="maturity.workflow_integration_list"
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
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <RequirementsSectionIFAC
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
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <InputsSectionIFAC
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                      </div>
                    )}

                    {currentStep === 6 && (
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <OutputsSectionIFAC
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                      </div>
                    )}

                    {currentStep === 7 && (
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <TeamsSectionIFAC
                          control={control}
                          register={register}
                          errors={errors}
                          watch={watch}
                          setValue={setValue}
                          storedData={storedFormData}
                        />
                      </div>
                    )}

                    {currentStep === 8 && (
                      <div className="step-panel" style={{ width: '80%', margin: '0 auto' }}>
                        <FinalReviewSectionIFAC
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

export default UpdateCatalogModelPageIFAC;
