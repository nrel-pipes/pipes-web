import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Plus, Minus } from "lucide-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

import PageTitle from "../components/pageTitle";
import SideColumn from "../components/form/SideColumn";
import useDataStore from "../pages/stores/DataStore";
import useAuthStore from "../pages/stores/AuthStore";
import FormError from "../components/form/FormError";
import "./FormStyles.css";
import "./createProjectRun.css";
import { useState, useEffect } from "react";

const CreateProjectRun = (projectData) => {
  // Notice, project data will be set the bounds for scheduledStart and end in validation
  const navigate = useNavigate();
  const createProjectrun = useDataStore((state) => state.createProjectrun);
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, getProject, currentProject } = useDataStore();
  console.log(currentProject);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [hasScheduleError, setHasScheduleError] = useState(false);

  useEffect(() => {
    validateToken(accessToken);
    console.log(projectData);
    if (!isLoggedIn) {
      navigate("/login");
    }
    getProjectBasics(accessToken);
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  // State Variables
  const [formData, setFormData] = useState({
    name: "example prun name",
    description: "This is an example description",
    assumptions: [""],
    requirements: {},
    scenarios: [""],
    scheduledStart: "2024-11-03",
    scheduledEnd: "2024-11-30",
  });

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
    console.log(JSON.stringify(formData.requirements));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);
    setFormError(false);

    const scheduledStartElem = document.getElementById("scheduledStart");
    const scheduledEndElem = document.getElementById("scheduledEnd");

    let hasError = false;

    // Validate Scheduled Start
    if (!formData.scheduledStart || isNaN(new Date(formData.scheduledStart))) {
      scheduledStartElem.classList.add("form-error");
      hasError = true;
    } else {
      scheduledStartElem.classList.remove("form-error");
    }

    // Validate Scheduled End
    if (!formData.scheduledEnd || isNaN(new Date(formData.scheduledEnd))) {
      scheduledEndElem.classList.add("form-error");
      hasError = true;
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
      return;
    }

    if (hasError) {
      setFormError(true);
      return;
    }

    // Proceed with form submission
    console.log("Form submitted successfully!");
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

  return (
    <Container fluid className="p-0">
      <Row className="g-0" style={{ display: "flex", flexDirection: "row" }}>
        <Col style={{ flex: 1, transition: "margin-left 0.3s ease" }}>
          <PageTitle title="Create Project Run" />
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
                        <Form.Text className="text-muted align-left">
                          Date must be after{" "}
                          {new Date(
                            currentProject.scheduled_start,
                          ).toLocaleDateString()}
                        </Form.Text>
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
                        <Form.Text className="text-muted">
                          Date must be before{" "}
                          {new Date(
                            currentProject.scheduled_end,
                          ).toLocaleDateString()}
                        </Form.Text>
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
                        className="d-flex mb-2 align-items-center gap-2"
                      >
                        <Form.Control
                          id={`scenarios${index}`}
                          type="input"
                          placeholder="Enter scenario"
                          value={scenario}
                          onChange={(e) =>
                            handleListValueChange(
                              "scenarios",
                              index,
                              e.target.value,
                            )
                          }
                        />
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
                    </Button>{" "}
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
                  {submittingForm ? "Submitted" : "Submit"}
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
