import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Plus, Minus } from "lucide-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTitle from "../components/pageTitle";
import SideColumn from "../components/form/SideColumn";
import useDataStore from "../pages/stores/DataStore";
import useAuthStore from "../pages/stores/AuthStore";
import FormError from "../components/form/FormError";
import "./FormStyles.css";
import "./createProjectRun.css";


import { postProject, postProjectRun, getProjectBasics, getProject } from "./api/ProjectAPI";

import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const CreateProjectRun = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const createProjectRun = useDataStore((state) => state.createProjectRun);
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      console.log("User not logged in, navigating to login.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate, validateToken, accessToken]);

  // Get the project name from location state
  const projectName = location.state?.currentProject?.name || location.state?.projectName;
  const {
    data: projectBasics = [],
    isLoading: isLoadingBasics,
    isError: isErrorBasics,
    error: errorBasics,
  } = useQuery({
    queryKey: ["projectBasics"],
    queryFn: getProjectBasics,
    enabled: isLoggedIn,
    retry: 3,
  });

  // Use React Query directly to access the project data
  const {
    data: currentProject,
    isLoading: isLoadingProject,
    isError: isErrorProject,
    error: errorProject
  } = useQuery({
    queryKey: ["project", projectName],
    queryFn: () => getProject({ projectName, accessToken }),
    enabled: isLoggedIn && !!projectName,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching project:", error);
    }
  });

  const {
    data: projectRuns,
    isLoading: isLoadingRuns,
    isError: isErrorRuns,
    error: errorRuns,
    refetch: refetchProjectRuns
  } = useQuery({
    queryKey: ["projectRuns", currentProject?.name],
  });

  useEffect(() => {
    if (!isLoadingProject && !currentProject && !projectName) {
      console.log("No project data available, navigating to projects list.");
      navigate("/projects");
    }
  }, [isLoadingProject, currentProject, projectName, navigate]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [scenarioNames, setScenarioNames] = useState([]);

  // Extract scenario names when project data is available
  useEffect(() => {
    if (currentProject?.scenarios) {
      const names = currentProject.scenarios.map(scenario =>
        typeof scenario === 'string' ? scenario : scenario.name
      );
      setScenarioNames(names);
    }
  }, [currentProject]);

  // Initialize form data with defaults
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assumptions: [""],
    requirements: {},
    scenarios: [""],
    scheduledStart: "",
    scheduledEnd: "",
  });

  // Update form data when currentProject changes
  useEffect(() => {
    if (currentProject?.scheduled_start || currentProject?.scheduled_end) {
      setFormData(prevState => ({
        ...prevState,
        scheduledStart: currentProject.scheduled_start ? new Date(currentProject.scheduled_start).toISOString().split('T')[0] : prevState.scheduledStart,
        scheduledEnd: currentProject.scheduled_end ? new Date(currentProject.scheduled_end).toISOString().split('T')[0] : prevState.scheduledEnd,
      }));
    }
  }, [currentProject]);

  const handleSetString = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleAddList = (key, value, e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      [key]: [...(prevState[key] || []), ""],
    }));
  };

  const handleRemoveFromList = (key, index, e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      [key]: prevState[key].filter((_, i) => i !== index),
    }));
  };

  const handleListValueChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedList = [...prev[field]];
      updatedList[index] = value;
      return {
        ...prev,
        [field]: updatedList,
      };
    });
  };

  const handleDateChange = (field, value, e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Add new requirement
  const handleAddRequirement = (type, e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        "": type === "int" ? [0] : [""],
      },
    }));
  };

  // Remove requirement
  const handleRemoveRequirement = (name, e) => {
    e.preventDefault();
    setFormData((prevState) => {
      const { [name]: removed, ...rest } = prevState.requirements;
      return {
        ...prevState,
        requirements: rest,
      };
    });
  };

  // Add sub-requirement value
  const handleAddSubRequirement = (name, e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        [name]: [...prevState.requirements[name], ""],
      },
    }));
  };

  // Remove sub-requirement value
  const handleRemoveSubRequirement = (name, index, e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        [name]: prevState.requirements[name].filter((_, i) => i !== index),
      },
    }));
  };

  // Update requirement name
  const handleRequirementNameChange = (oldName, newName) => {
    setFormData((prevState) => {
      const { [oldName]: values, ...rest } = prevState.requirements;
      return {
        ...prevState,
        requirements: {
          ...rest,
          [newName]: values,
        },
      };
    });
  };

  // Update requirement value
  const handleRequirementValueChange = (name, index, value) => {
    setFormData((prevState) => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        [name]: prevState.requirements[name].map((v, i) =>
          i === index ? value : v,
        ),
      },
    }));
  };

  // Project information
  function validateProjectData(formData) {
    // Reset previous errors
    setFormError(false);
    setFormErrorMessage("");

    // Validate Project Run name
    const projectRunName = document.getElementById("projectRunName");
    if (!formData.name) {
      projectRunName.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage("Project run name is required");
      return false;
    }
    projectRunName.classList.remove("form-error");

    // Validate Schedule
    const scheduledStartElem = document.getElementById("scheduledStart");
    const scheduledEndElem = document.getElementById("scheduledEnd");
    let hasScheduleError = false;

    // Validate Scheduled Start
    if (!formData.scheduledStart || isNaN(new Date(formData.scheduledStart))) {
      scheduledStartElem.classList.add("form-error");
      hasScheduleError = true;
      setFormErrorMessage("Valid start date is required");
    } else {
      scheduledStartElem.classList.remove("form-error");
    }

    // Validate Scheduled End
    if (!formData.scheduledEnd || isNaN(new Date(formData.scheduledEnd))) {
      scheduledEndElem.classList.add("form-error");
      hasScheduleError = true;
      setFormErrorMessage("Valid end date is required");
    } else {
      scheduledEndElem.classList.remove("form-error");
    }

    // Check if Start Date is Before End Date
    if (
      formData.scheduledStart &&
      formData.scheduledEnd &&
      new Date(formData.scheduledStart) > new Date(formData.scheduledEnd)
    ) {
      scheduledStartElem.classList.add("form-error");
      scheduledEndElem.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage("Start date must be before end date");
      return false;
    }

    // Check if dates are within project date constraints
    if (
      currentProject?.scheduled_start &&
      formData.scheduledStart
    ) {
      const projectStartTime = new Date(currentProject.scheduled_start).getTime();
      const scheduledStartTime = new Date(formData.scheduledStart).getTime();
      console.log(projectStartTime, scheduledStartTime)
      if (scheduledStartTime < projectStartTime) {
        scheduledStartElem.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Start date must be on or after project start date (${new Date(currentProject.scheduled_start).toLocaleDateString()})`);
        return false;
      }
    }

    if (
      currentProject?.scheduled_end &&
      formData.scheduledEnd
    ) {
      const projectEndTime = new Date(currentProject.scheduled_end).getTime();
      const scheduledEndTime = new Date(formData.scheduledEnd).getTime();

      if (scheduledEndTime > projectEndTime) {
        scheduledEndElem.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`End date must be on or before project end date (${new Date(currentProject.scheduled_end).toLocaleDateString()})`);
        return false;
      }
    }

    if (hasScheduleError) {
      setFormError(true);
      return false;
    }

    // Validate requirements keys
    if (formData.requirements) {
      const hasEmptyRequirementKey = Object.keys(formData.requirements).some(
        (key) => !key.trim()
      );
      if (hasEmptyRequirementKey) {
        setFormError(true);
        setFormErrorMessage("Requirements cannot have empty keys");
        return false;
      }
    }

    // Validate Scenarios: empty
    if (formData.scenarios && formData.scenarios.length > 0) {
      for (let i = 0; i < formData.scenarios.length; i++) {
        let scenario = document.getElementById(`scenarios${i}`);
        if (formData.scenarios[i] === "") {
          if (scenario) {
            scenario.classList.add("form-error");
          }
          setFormError(true);
          setFormErrorMessage("You must either delete or fill in a scenario.");
          return false;
        }
        if (scenario) {
          scenario.classList.remove("form-error");
        }
      }
    }

    return true;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  const mutation = useMutation({
    mutationFn: async (formData) => {
      setSubmittingForm(true);
      setFormError(false);

      // Validation function call commented out as requested
      const isValid = validateProjectData(formData);
      if (!isValid) {
        setSubmittingForm(false);
        throw new Error("Validation failed");
      }

      if (!currentProject || !currentProject.name) {
        throw new Error("No current project selected");
      }

      return await createProjectRun(
        currentProject.name,
        formData,
        accessToken
      );
    },
    onSuccess: (data) => {
      console.log("Project run created successfully", data);
      setSubmittingForm(false);
      queryClient.invalidateQueries(['projectRuns']);
      // navigate("/projectrun");
    },
    onError: (error) => {
      console.error("Error creating project run:", error);
      setFormError(true);
      setFormErrorMessage(
        `Failed to create project run: ${error.message}. Please try again later.`
      );
      setSubmittingForm(false);
    }
  });

  // Adding definitions
  const [documentation] = useState({
    description: "This is a sample description of the project creation page",
    definitions: [
      {
        name: "Project Name",
        definition: "Choose the name of your project",
      },
      {
        name: "Scheduled Start",
        definition: "Fill in the starting date of your modeling project",
      },
      {
        name: "Scheduled End",
        definition: "This will be ending date of your modeling project",
      },
      {
        name: "Assumptions",
        definition: "List what you take for granted in your project.",
      },
      {
        name: "Sensitivity",
        definition: "What is a sensitivity?",
      },
      {
        name: "Milestone",
        definition: "What is a Milestone?",
      },
    ],
  });

  // Show loading state while project data is being fetched
  if (isLoadingProject) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading project data...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Row className="g-0" style={{ display: "flex", flexDirection: "row" }}>
        <Col style={{ flex: 1, transition: "margin-left 0.3s ease" }}>
          <PageTitle title="Create Project Run" />
          {currentProject?.name && (
            <div className="text-center mb-3">
              <p className="lead">Creating a run for project: <strong>{currentProject.title || currentProject.name || currentProject.projectBasics}</strong></p>
            </div>
          )}
          <Row className="justify-content-center"></Row>
          <div className="d-flex justify-content-center">
            <Col
              className="justify-content-center mw-600"
              style={{ maxWidth: "1000px" }}
              xs={12}
              md={9}
            >
              <Form className="my-4 justify-content" onSubmit={handleSubmit}>
                {" "}
                <Form.Group className="mb-3 w-100">
                  <Form.Label
                    id="projectRunNameLabel"
                    className="d-block text-start w-100 custom-form-label requiredField"
                  >
                    Project Run Name
                  </Form.Label>
                  <Form.Control
                    type="input"
                    id="projectRunName"
                    name="projectRunName"
                    placeholder="Name"
                    className="mb-4"
                    value={formData.name}
                    onChange={(e) => handleSetString("name", e.target.value)}
                  />
                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Project Description
                  </Form.Label>
                  <Form.Control
                    id="projectRunDescription"
                    as="textarea"
                    rows={3}
                    placeholder="Describe your project"
                    className="mb-4"
                    value={formData.description}
                    onChange={(e) =>
                      handleSetString("description", e.target.value)
                    }
                  />
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="d-block text-start custom-form-label requiredField">
                          Scheduled Start
                        </Form.Label>
                        {currentProject?.scheduled_start && (
                          <Form.Text className="text-muted d-block text-start">
                            Date must be after{" "}
                            {new Date(
                              currentProject.scheduled_start,
                            ).toLocaleDateString()}
                          </Form.Text>
                        )}
                        <Form.Control
                          id="scheduledStart"
                          name="scheduledStart"
                          type="date"
                          value={formData.scheduledStart || ""}
                          className={
                            formError && !formData.scheduledStart
                              ? "form-error"
                              : ""
                          }
                          onChange={(e) =>
                            handleDateChange(
                              "scheduledStart",
                              e.target.value,
                              e,
                            )
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Please select a valid start date.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="d-block text-start custom-form-label requiredField">
                          Scheduled End
                        </Form.Label>
                        {currentProject?.scheduled_end && (
                          <Form.Text className="text-muted d-block text-start">
                            Date must be before{" "}
                            {new Date(
                              currentProject.scheduled_end,
                            ).toLocaleDateString()}
                          </Form.Text>
                        )}
                        <Form.Control
                          id="scheduledEnd"
                          name="scheduledEnd"
                          type="date"
                          value={formData.scheduledEnd || ""}
                          className={
                            formError && !formData.scheduledEnd
                              ? "form-error"
                              : ""
                          }
                          onChange={(e) =>
                            handleDateChange("scheduledEnd", e.target.value, e)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Please select a valid end date.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Assumptions
                  </Form.Label>
                  {formData.assumptions.map((assumption, index) => (
                    <div
                      key={index}
                      className="d-flex mb-2 align-items-center gap-2"
                    >
                      <Form.Control
                        id={`assumptions${index}`}
                        type="input"
                        placeholder="Enter assumption"
                        value={assumption}
                        onChange={(e) =>
                          handleListValueChange(
                            "assumptions",
                            index,
                            e.target.value,
                          )
                        }
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) =>
                          handleRemoveFromList("assumptions", index, e)
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}{" "}
                  <div className="flex justify-start mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => handleAddList("assumptions", "", e)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Assumption
                    </Button>
                  </div>
                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Scenarios
                  </Form.Label>
                  <div className="d-block">
                    {formData.scenarios.map((scenario, index) => (
                      <div
                        key={index}
                        className="d-flex mb-2 align-items-center gap-2 "
                      >
                        <Form.Select
                          id={`scenarios${index}`}
                          value={scenario}
                          onChange={(e) =>
                            handleListValueChange(
                              "scenarios",
                              index,
                              e.target.value,
                            )
                          }
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
                          onClick={(e) =>
                            handleRemoveFromList("scenarios", index, e)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => handleAddList("scenarios", "", e)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Scenario
                    </Button>
                  </div>{" "}
                  <div className="mb-3">
                    <Form.Label className="d-block text-start w-100 custom-form-label">
                      Requirements
                    </Form.Label>
                    <div className="d-block">
                      {Object.entries(formData.requirements).map(
                        ([name, values], idx) => (
                          <div key={idx}>
                            {values.map((value, valueIndex) => (
                              <Row
                                key={`${idx}-${valueIndex}`}
                                className="mb-2 align-items-center"
                              >
                                {valueIndex === 0 ? (
                                  <>
                                    <Col xs="auto">
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={(e) =>
                                          handleRemoveRequirement(name, e)
                                        }
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          padding: "4px",
                                        }}
                                      >
                                        <Minus className="w-4 h-4" />
                                      </Button>
                                    </Col>
                                    <Col xs={3}>
                                      <Form.Control
                                        type="text"
                                        placeholder="Requirement"
                                        value={name}
                                        onChange={(e) =>
                                          handleRequirementNameChange(
                                            name,
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </Col>
                                  </>
                                ) : (
                                  <>
                                    <Col xs="auto">
                                      <div style={{ width: "32px" }}></div>
                                    </Col>
                                    <Col xs={3}>
                                      <div></div>
                                    </Col>
                                  </>
                                )}
                                <Col>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter value"
                                    value={value}
                                    onChange={(e) =>
                                      handleRequirementValueChange(
                                        name,
                                        valueIndex,
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Col>
                                <Col xs="auto">
                                  {values.length > 1 && (
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={(e) =>
                                        handleRemoveSubRequirement(
                                          name,
                                          valueIndex,
                                          e,
                                        )
                                      }
                                      className="d-flex align-items-center justify-content-center"
                                      style={{
                                        width: "32px",
                                        height: "32px",
                                        padding: "4px",
                                      }}
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                  )}
                                </Col>
                              </Row>
                            ))}
                            <Row>
                              <Col xs="auto">
                                <div style={{ width: "32px" }}></div>
                              </Col>
                              <Col xs={3}></Col>
                              <Col>
                                <div className="d-flex mb-3">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={(e) =>
                                      handleAddSubRequirement(name, e)
                                    }
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      padding: "4px",
                                    }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </Col>
                              <Col xs="auto">
                                <div style={{ width: "32px" }}></div>
                              </Col>
                            </Row>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="d-flex justify-content-start mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => handleAddRequirement("str", e)}
                        className="d-flex align-items-center me-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Requirement
                      </Button>
                    </div>
                  </div>
                </Form.Group>
                <Row>
                  {formError ? (
                    <FormError errorMessage={formErrorMessage} />
                  ) : null}
                </Row>
                <Button
                  variant="primary"
                  disabled={submittingForm}
                  type="submit"
                >
                  {submittingForm ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            </Col>
          </div>
        </Col>
        <div
          style={{
            width: isExpanded ? "calc(30vw + 40px)" : "40px",
            transition: "width 0.3s ease",
            flexShrink: 0,
          }}
        >
          <SideColumn
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
            documentation={documentation}
          />
        </div>
      </Row>
    </Container>
  );
};

export default CreateProjectRun;