import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";
import FormError from "../Components/form/FormError";
import SideColumn from "../Components/form/SideColumn";
import "../FormStyles.css";
import "./CreateProjectRunPage.css";

import { useGetProjectQuery } from "../../hooks/useProjectQuery";
import useDataStore from "../../stores/DataStore";

import { useEffect, useState } from "react";
import { useCreateProjectRunMutation } from "../../hooks/useProjectRunQuery";

const CreateProjectRunPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();

  const { effectivePname } = useDataStore();

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, validateToken, accessToken]);

  const projectName = location.state?.currentProject?.name || location.state?.projectName;

  const {
    data: currentProject,
    isLoading: isLoadingProject,
    error: projectError
  } = useGetProjectQuery(projectName);

  const {
    data: projectRuns,
  } = useQuery({
    queryKey: ["projectRuns", currentProject?.name],
  });

  useEffect(() => {
    if (!isLoadingProject && !currentProject && !projectName) {
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
    assumptions: [],
    requirements: {},
    scenarios: [],
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
  function validateProjectData(formData, projectRuns) {
    const formDataValidated = JSON.parse(JSON.stringify(formData));

    setFormError(false);
    setFormErrorMessage("");

    const projectRunName = document.getElementById("projectRunName");
    if (!formDataValidated.name) {
      projectRunName.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage("Project run name is required");
      return false;
    }

    if (projectRuns) {
      const projectRunsArray = Array.isArray(projectRuns) ? projectRuns : [];
      const nameExists = projectRunsArray.some(run => {
        return run && run.name === formDataValidated.name;
      });

      if (nameExists) {
        projectRunName.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`You have an existing project run with name: ${formDataValidated.name}`);
        return false;
      }
    }

    projectRunName.classList.remove("form-error");

    // Validate Schedule
    const scheduledStartElem = document.getElementById("scheduledStart");
    const scheduledEndElem = document.getElementById("scheduledEnd");
    let hasScheduleError = false;

    // Validate Scheduled Start
    if (!formDataValidated.scheduledStart || isNaN(new Date(formDataValidated.scheduledStart))) {
      scheduledStartElem.classList.add("form-error");
      hasScheduleError = true;
      setFormErrorMessage("Valid start date is required");
    } else {
      scheduledStartElem.classList.remove("form-error");
    }

    // Validate Scheduled End
    if (!formDataValidated.scheduledEnd || isNaN(new Date(formDataValidated.scheduledEnd))) {
      scheduledEndElem.classList.add("form-error");
      hasScheduleError = true;
      setFormErrorMessage("Valid end date is required");
    } else {
      scheduledEndElem.classList.remove("form-error");
    }

    // Check if Start Date is Before End Date
    if (
      formDataValidated.scheduledStart &&
      formDataValidated.scheduledEnd &&
      new Date(formDataValidated.scheduledStart) > new Date(formDataValidated.scheduledEnd)
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
      formDataValidated.scheduledStart
    ) {
      // Normalize date formats to handle cases where one might be a date string without time
      const projectStartRaw = currentProject.scheduled_start;

      // Create normalized dates for proper comparison (just date parts, no time)
      const projectStartDate = new Date(projectStartRaw);
      const scheduledStartDate = new Date(formDataValidated.scheduledStart);

      // Create date-only strings for comparison (YYYY-MM-DD)
      const projectStartDateOnly = projectStartDate.toISOString().split('T')[0];
      const scheduledStartDateOnly = scheduledStartDate.toISOString().split('T')[0];

      // Check if same day (comparing date parts only)
      const isSameDay = projectStartDateOnly === scheduledStartDateOnly;

      // If same day, make the times exactly match by using the project start time
      if (isSameDay) {
        formDataValidated.scheduledStart = projectStartRaw;
      }
      else {
        // Only do the time comparison if not the same day
        const projectStartTime = projectStartDate.getTime();
        const scheduledStartTime = scheduledStartDate.getTime();

        if (scheduledStartTime < projectStartTime) {
          scheduledStartElem.classList.add("form-error");
          setFormError(true);
          setFormErrorMessage(`Start date must be on or after project start date (${new Date(currentProject.scheduled_start).toLocaleDateString()})`);
          return false;
        }
      }
    }

    if (
      currentProject?.scheduled_end &&
      formDataValidated.scheduledEnd
    ) {
      // Normalize date formats to handle cases where one might be a date string without time
      const projectEndRaw = currentProject.scheduled_end;

      // Create normalized dates for proper comparison (just date parts, no time)
      const projectEndDate = new Date(projectEndRaw);
      const scheduledEndDate = new Date(formDataValidated.scheduledEnd);

      // Create date-only strings for comparison (YYYY-MM-DD)
      const projectEndDateOnly = projectEndDate.toISOString().split('T')[0];
      const scheduledEndDateOnly = scheduledEndDate.toISOString().split('T')[0];

      // Check if same day (comparing date parts only)
      const isSameDay = projectEndDateOnly === scheduledEndDateOnly;

      // If same day, make the times exactly match by using the project end time
      if (isSameDay) {
        formDataValidated.scheduledEnd = projectEndRaw;
      }
      else {
        // Only do the time comparison if not the same day
        const projectEndTime = projectEndDate.getTime();
        const scheduledEndTime = scheduledEndDate.getTime();

        if (scheduledEndTime > projectEndTime) {
          scheduledEndElem.classList.add("form-error");
          setFormError(true);
          setFormErrorMessage(`End date must be on or before project end date (${new Date(currentProject.scheduled_end).toLocaleDateString()})`);
          return false;
        }
      }
    }

    if (hasScheduleError) {
      setFormError(true);
      return false;
    }

    // Validate requirements keys
    if (formDataValidated.requirements) {
      const hasEmptyRequirementKey = Object.keys(formDataValidated.requirements).some(
        (key) => !key.trim()
      );
      if (hasEmptyRequirementKey) {
        setFormError(true);
        setFormErrorMessage("Requirements cannot have empty keys");
        return false;
      }
    }

    // Validate Scenarios: empty
    if (formDataValidated.scenarios && formDataValidated.scenarios.length > 0) {
      for (let i = 0; i < formDataValidated.scenarios.length; i++) {
        let scenario = document.getElementById(`scenarios${i}`);
        if (formDataValidated.scenarios[i] === "") {
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

    return formDataValidated;
  }

  const mutation = useCreateProjectRunMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

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
    <>
    <NavbarSub navData={{ pAll: true, pName: effectivePname }} />
    <Container fluid className="p-0">
      <Row className="g-0" style={{ display: "flex", flexDirection: "row" }}>
        <Col style={{ flex: 1, transition: "margin-left 0.3s ease" }}>
          <ContentHeader title="Create Project Run" />
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
    </>
  );
};

export default CreateProjectRunPage;
