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

import "../FormStyles.css";
import "../PageStyles.css";
import "./CreateProjectRunPage.css";

import { useGetProjectQuery } from "../../hooks/useProjectQuery";
import { useGetProjectRunQuery, useUpdateProjectRunMutation } from "../../hooks/useProjectRunQuery";
import useDataStore from "../../stores/DataStore";

import { useEffect, useState } from "react";

// Requirements component for managing complex requirements object
const RequirementsSection = ({ control, register, errors, watch, setValue, initialData, onDataChange }) => {
  const [requirements, setRequirements] = useState({});
  const [requirementIds, setRequirementIds] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Watch the requirements field for changes
  const watchedRequirements = watch("requirements", {});

  // Initialize with initial data from parent component
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      try {
        // Force fresh initialization regardless of previous state
        setIsInitialized(false);

        // Create a deep copy to avoid reference issues
        const initialCopy = JSON.parse(JSON.stringify(initialData));

        // Set requirements first
        setRequirements(initialCopy);

        // Then update the IDs for rendering
        const ids = Object.keys(initialCopy);
        setRequirementIds(ids);

        // Force update the form value
        setTimeout(() => {
          setValue("requirements", initialCopy);
          setIsInitialized(true);
        }, 50);
      } catch (err) {
        console.error("Error initializing requirements:", err);
      }
    }
  }, [initialData, setValue]); // Remove isInitialized dependency

  // Initialize with a default empty requirement only if no initial data
  useEffect(() => {
    if (!isInitialized && (!initialData || Object.keys(initialData).length === 0)) {
      const defaultId = `req_default`;
      const defaultRequirement = {
        name: "",
        type: "string",
        value: ""
      };

      setRequirements({ [defaultId]: defaultRequirement });
      setValue("requirements", { [defaultId]: defaultRequirement });
      setRequirementIds([defaultId]);
      setIsInitialized(true);
    }
  }, [isInitialized, initialData, setValue]);

  // Update local state when form values change
  useEffect(() => {
    if (isInitialized && Object.keys(watchedRequirements).length > 0) {
      setRequirements(watchedRequirements);
    }
  }, [watchedRequirements, isInitialized]);

  const addRequirement = () => {
    const timestamp = Date.now();
    const newId = `req_${timestamp}`;
    const newRequirements = {
      ...requirements,
      [newId]: {
        name: "", // Store the name separately from the key
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

    // Update requirement IDs
    setRequirementIds(requirementIds.filter(reqId => reqId !== id));
  };

  const updateRequirementName = (id, newName) => {
    // Just update the name property, not the key
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

    // Convert value appropriately
    let newValue;
    if (newType === "string") {
      // If converting from object to string, use empty string
      newValue = "";
    } else {
      // If converting from string to object, create object with two initial fields
      newValue = {
        field1: "",
        field2: ""
      };
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

  // Object field methods
  const addObjectField = (reqId) => {
    const reqData = requirements[reqId];
    if (!reqData || reqData.type !== "object") return;

    // Find a unique field name that doesn't exist yet
    let fieldIndex = 1;
    let newFieldName = `field${fieldIndex}`;
    while (reqData.value && Object.prototype.hasOwnProperty.call(reqData.value, newFieldName)) {
      fieldIndex++;
      newFieldName = `field${fieldIndex}`;
    }

    const updatedValue = {
      ...reqData.value,
      [newFieldName]: ""
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

    // Check if the new key already exists
    if (Object.prototype.hasOwnProperty.call(reqData.value, newKey) && oldKey !== newKey) {
      return; // Don't allow duplicate keys
    }

    // Create a new value object with the renamed key
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

    // Don't remove if it's the only field
    const fieldKeys = Object.keys(reqData.value || {});
    if (fieldKeys.length <= 1) return;

    // Create a new value object without the removed field
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
              {/* Name input - full width on top row */}
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

              {/* Value input - second row */}
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

const UpdateProjectRunPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectName: urlProjectName, runName: urlRunName } = useParams();
  const { checkAuthStatus } = useAuthStore();
  const { effectivePname, effectivePRname } = useDataStore();

  // Determine current project and run names
  const currentProjectName = urlProjectName || effectivePname;
  const currentRunName = urlRunName || location.state?.projectRunName || effectivePRname;

  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [scenarioNames, setScenarioNames] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [requirementsInitialData, setRequirementsInitialData] = useState(null);

  // Get current project run data
  const {
    data: projectRun,
    isLoading: isLoadingProjectRun,
    error: projectRunError
  } = useGetProjectRunQuery(currentProjectName, currentRunName);

  // Initialize react-hook-form without default values initially
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
    reset
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      assumptions: [""],
      requirements: {},
      scenarios: [""],
      scheduledStart: "",
      scheduledEnd: "",
    }
  });

  // Local state for assumptions and scenarios
  const [assumptions, setAssumptions] = useState([""]);
  const [scenarios, setScenarios] = useState([""]);

  // Add handlers for assumptions and scenarios
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

  const addScenario = () => {
    const newScenarios = [...scenarios, ""];
    setScenarios(newScenarios);
    setValue("scenarios", newScenarios);
  };

  const removeScenario = (index) => {
    const newScenarios = [...scenarios];
    newScenarios.splice(index, 1);
    setScenarios(newScenarios.length ? newScenarios : [""]);
    setValue("scenarios", newScenarios.length ? newScenarios : [""]);
  };

  // Load project data
  const {
    data: currentProject,
    isLoading: isLoadingProject,
  } = useGetProjectQuery(currentProjectName);

  // Update mutation
  const updateMutation = useUpdateProjectRunMutation();

  // If params are missing, redirect to project dashboard
  useEffect(() => {
    if (!currentProjectName || !currentRunName) {
      navigate('/project/dashboard');
    }
  }, [currentProjectName, currentRunName, navigate]);

  // Load project run data into form when available
  useEffect(() => {
    if (projectRun && !isLoaded) {
      try {
        let targetRun = projectRun;
        if (Array.isArray(projectRun)) {
          targetRun = projectRun.find(run => run.name === currentRunName);
        }

        if (!targetRun) {
          console.error("Could not find run with name:", currentRunName);
          return;
        }

        const rawRequirements = targetRun.requirements || {};

        // Convert requirements to form format
        const convertedRequirements = convertRequirementsToFormFormat(rawRequirements);

        // Basic form data without requirements first
        const basicFormData = {
          name: targetRun.name || "",
          description: targetRun.description || "",
          assumptions: Array.isArray(targetRun.assumptions) && targetRun.assumptions.length > 0
            ? targetRun.assumptions
            : [""],
          scenarios: Array.isArray(targetRun.scenarios) && targetRun.scenarios.length > 0
            ? targetRun.scenarios
            : [""],
          scheduledStart: targetRun.scheduled_start ? new Date(targetRun.scheduled_start).toISOString().split('T')[0] : "",
          scheduledEnd: targetRun.scheduled_end ? new Date(targetRun.scheduled_end).toISOString().split('T')[0] : ""
        };

        // Update state first
        setAssumptions(basicFormData.assumptions);
        setScenarios(basicFormData.scenarios);

        // Reset form without requirements
        reset(basicFormData);

        // After a short delay, set requirements directly and then set requirements initial data
        setTimeout(() => {
          // Set form requirements value directly
          setValue("requirements", convertedRequirements);

          // Set the requirements initial data last
          setRequirementsInitialData(null); // Clear first to force re-render
          setTimeout(() => {
            setRequirementsInitialData(convertedRequirements);
            setIsLoaded(true);
          }, 100);
        }, 100);

      } catch (error) {
        console.error("Error setting form data:", error);
      }
    }
  }, [projectRun, reset, currentRunName, setValue]);

  // Helper function to convert requirements from API to form format
  const convertRequirementsToFormFormat = (apiRequirements) => {
    if (!apiRequirements || typeof apiRequirements !== 'object') {
      return {};
    }

    try {
      const formRequirements = {};
      let counter = 0;

      // Handle the specific structure we're seeing in the logs
      Object.entries(apiRequirements).forEach(([reqKey, reqValue]) => {
        const id = `req_${counter++}`;

        if (typeof reqValue === 'object' && reqValue !== null) {
          // This is an object requirement (like r1: { k1: "v1", k2: "v2" })
          formRequirements[id] = {
            name: reqKey,
            type: 'object',
            value: { ...reqValue } // Deep copy the object
          };
        } else {
          // This is a string requirement
          formRequirements[id] = {
            name: reqKey,
            type: 'string',
            value: reqValue
          };
        }
      });

      // If no requirements were found, add a default empty one
      if (Object.keys(formRequirements).length === 0) {
        formRequirements.req_default = {
          name: "",
          type: "string",
          value: ""
        };
      }

      return formRequirements;
    } catch (error) {
      console.error("Error converting requirements:", error);
      return {};
    }
  };

  // Force refresh the component when projectRun data changes
  useEffect(() => {
    if (projectRun && isLoaded) {
      const watchedValues = watch();
      let targetRun = projectRun;

      if (Array.isArray(projectRun)) {
        targetRun = projectRun.find(run => run.name === currentRunName);
      }

      if (targetRun && !watchedValues.name && targetRun.name) {
        // Form wasn't initialized properly, try again
        setIsLoaded(false);
      }
    }
  }, [projectRun, isLoaded, watch, currentRunName]);

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

  // Extract scenario names when project data is available
  useEffect(() => {
    if (currentProject?.scenarios) {
      const names = currentProject.scenarios.map(scenario =>
        typeof scenario === 'string' ? scenario : scenario.name
      );
      setScenarioNames(names);
    }
  }, [currentProject]);

  const validateDates = (scheduledStart, scheduledEnd) => {
    if (!scheduledStart || isNaN(new Date(scheduledStart))) {
      return "Valid start date is required";
    }

    if (!scheduledEnd || isNaN(new Date(scheduledEnd))) {
      return "Valid end date is required";
    }

    if (new Date(scheduledStart) > new Date(scheduledEnd)) {
      return "Start date must be before end date";
    }

    // Check if dates are within project date constraints
    if (currentProject?.scheduled_start) {
      const projectStartDate = new Date(currentProject.scheduled_start);
      const scheduledStartDate = new Date(scheduledStart);

      const projectStartDateOnly = projectStartDate.toISOString().split('T')[0];
      const scheduledStartDateOnly = scheduledStartDate.toISOString().split('T')[0];

      if (projectStartDateOnly !== scheduledStartDateOnly && scheduledStartDate < projectStartDate) {
        return `Start date must be on or after project start date (${projectStartDate.toLocaleDateString()})`;
      }
    }

    if (currentProject?.scheduled_end) {
      const projectEndDate = new Date(currentProject.scheduled_end);
      const scheduledEndDate = new Date(scheduledEnd);

      const projectEndDateOnly = projectEndDate.toISOString().split('T')[0];
      const scheduledEndDateOnly = scheduledEndDate.toISOString().split('T')[0];

      if (projectEndDateOnly !== scheduledEndDateOnly && scheduledEndDate > projectEndDate) {
        return `End date must be on or before project end date (${projectEndDate.toLocaleDateString()})`;
      }
    }

    return true;
  };

  const onSubmit = async (data) => {
    clearErrors();
    setFormError(false);
    setFormErrorMessage("");
    setErrorDetails([]);

    // Clean and format data for API
    const formData = { ...data };

    // Clean assumptions - remove empty strings, keep empty array if no valid assumptions
    formData.assumptions = data.assumptions.filter(assumption => assumption.trim() !== "");

    // Clean scenarios - remove empty strings, keep empty array if no valid scenarios
    formData.scenarios = data.scenarios.filter(scenario => scenario.trim() !== "");

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
    const cleanedFormData = {
      name: formData.name.trim(),
      description: formData.description.trim() || "",
      assumptions: formData.assumptions,
      requirements: formData.requirements,
      scenarios: formData.scenarios,
      scheduled_start: formData.scheduledStart,
      scheduled_end: formData.scheduledEnd
    };

    try {
      await updateMutation.mutateAsync({
        projectName: currentProjectName,
        projectRunName: currentRunName,
        data: cleanedFormData
      });

      // Navigate to project run details page after successful update
      navigate('/projectrun');
    } catch (error) {
      setFormError(true);
      setFormErrorMessage("Failed to update project run");

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

  // Show loading state while data is being fetched
  if (isLoadingProject || isLoadingProjectRun) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName }} />
        <Container className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading project run data...</p>
        </Container>
      </>
    );
  }

  // Show error if project run couldn't be loaded
  if (projectRunError) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: currentProjectName }} />
        <Container className="mt-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error Loading Project Run</h4>
            <p>{projectRunError.message || "Failed to load project run data"}</p>
            <Button variant="outline-primary" onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: currentProjectName, prName: currentRunName, toUpdate: true }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Update Project Run" />
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

            <div className="px-3 py-5">
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                  <Form.Label className="form-field-label required-field">
                    <span className="form-field-text">Project Run Name</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-lg form-primary-input"
                    placeholder="Enter project run name"
                    isInvalid={!!errors.name}
                    {...register("name", { required: "Project run name is required" })}
                  />
                  {errors.name && (
                    <Form.Control.Feedback type="invalid" className="text-start">
                      {errors.name.message}
                    </Form.Control.Feedback>
                  )}
                </div>

                <div className="mb-4">
                  <Form.Label className="form-field-label">
                    <span className="form-field-text">Description</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="form-control-lg form-primary-input"
                    placeholder="Enter a brief description"
                    {...register("description")}
                  />
                </div>

                <div className="mb-4">
                  <Form.Label className="form-field-label">
                    <span className="form-field-text">Scenarios</span>
                  </Form.Label>
                  <div>
                    {scenarios.map((scenario, index) => (
                      <div key={index} className="d-flex mb-2 align-items-center gap-2">
                        <Form.Select
                          className="form-control-lg"
                          value={scenario}
                          onChange={(e) => {
                            const newScenarios = [...scenarios];
                            newScenarios[index] = e.target.value;
                            setScenarios(newScenarios);
                            setValue("scenarios", newScenarios);
                          }}
                        >
                          <option value="">Select a scenario</option>
                          {scenarioNames.map((name, idx) => (
                            <option key={idx} value={name}>
                              {name}
                            </option>
                          ))}
                        </Form.Select>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          type="button"
                          onClick={() => removeScenario(index)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline-primary"
                      type="button"
                      onClick={addScenario}
                      className="d-flex align-items-center gap-2"
                      style={{ padding: "0.5rem 1rem" }}
                    >
                      <Plus size={16} />
                      Scenario
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <Form.Label className="form-field-label">
                    <span className="form-field-text">Assumptions</span>
                  </Form.Label>
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

                <RequirementsSection
                  control={control}
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  initialData={requirementsInitialData}
                />

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
                      id="scheduledStart"
                      type="date"
                      className="form-control-lg form-date-input"
                      isInvalid={!!errors.scheduledStart}
                      placeholder="mm/dd/yyyy"
                      {...register("scheduledStart", {
                        required: "Start date is required"
                      })}
                    />
                    {errors.scheduledStart && (
                      <Form.Control.Feedback type="invalid">
                        {errors.scheduledStart.message}
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
                      id="scheduledEnd"
                      type="date"
                      className="form-control-lg form-date-input"
                      isInvalid={!!errors.scheduledEnd}
                      placeholder="mm/dd/yyyy"
                      {...register("scheduledEnd", {
                        required: "Start date is required"
                      })}
                    />
                    {errors.scheduledEnd && (
                      <Form.Control.Feedback type="invalid">
                        {errors.scheduledEnd.message}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Row>

                <div className="mt-4 d-flex justify-content-end form-action-buttons">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => navigate('/project/dashboard')}
                    className="action-button me-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ backgroundColor: "#0079c2", borderColor: "#0079c2" }}
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="action-button"
                  >
                    {isSubmitting ? "Updating Project Run..." : "Update Project Run"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UpdateProjectRunPage;
