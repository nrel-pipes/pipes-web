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
import { useState, useEffect } from "react";

const CreateProjectRun = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, getProject, createProject } = useDataStore();

  // ================== INITIALIZATION AND VALIDATION ==================

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
    getProjectBasics(accessToken);
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  // ================== PROJECT DATA STATES ==================

  // Project Info
  const [projectName, setProjectName] = useState("example project");
  const [projectDescription, setProjectDescription] = useState("example");

  // Owner Info
  const [ownerFirstName, setOwnerFirstName] = useState("Jordan");
  const [ownerLastName, setOwnerLastName] = useState("Eisenman");
  const [ownerEmail, setOwnerEmail] = useState("Jordan.Eisenman@nrel.gov");
  const [ownerOrganization, setOwnerOrganization] = useState("NREL");

  // Assumptions
  const [assumptions, setAssumptions] = useState(["Assumption 1"]);

  // Requirements
  const [requirements, setRequirments] = useState([
    { KeyRequirement: ["Value1"] },
  ]);
  const [requirementsType, setRequirmentsType] = useState(["str"]);

  // Scenarios
  const [scenarios, setScenarios] = useState([
    {
      name: "Base Scenario",
      description: ["Description of the base scenario"],
      other: [{ key: "Parameter1", value: "Value1" }],
    },
  ]);

  // Sensitivities
  const [sensitivities, setSensitivities] = useState([
    {
      name: "Default Sensitivity",
      description: ["Description of sensitivity"],
      list: ["Sensitivity factor 1"],
    },
  ]);

  // Milestones
  const [milestones, setMilestones] = useState([
    {
      name: "Milestone 1",
      description: ["First major project milestone"],
      milestone_date: "2023-02-01",
    },
  ]);

  // Schedule
  const [schedule, setSchedule] = useState({
    scheduledStart: "2023-01-01",
    scheduledEnd: "2023-12-31",
  });

  // Form States
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formData, setFormData] = useState({});
  const retriesLimit = 2;

  // ================== HANDLERS ==================

  // Assumption Handlers
  const handleAddAssumption = (e) => {
    e.preventDefault();
    setAssumptions([...assumptions, ""]);
  };

  const handleRemoveAssumption = (index, e) => {
    e.preventDefault();
    const newAssumptions = assumptions.filter((_, idx) => idx !== index);
    setAssumptions(newAssumptions);
  };

  const handleAssumptionChange = (index, value) => {
    const newAssumptions = [...assumptions];
    newAssumptions[index] = value;
    setAssumptions(newAssumptions);
  };

  // Requirement Handlers
  const handleAddRequirement = (type, e) => {
    e.preventDefault();
    const defaultValue = type === "int" ? 0 : "";
    const newRequirements = [...requirements, { "": [defaultValue] }];
    setRequirments(newRequirements);

    const newRequirementsType = [...requirementsType, type];
    setRequirmentsType(newRequirementsType);
  };

  const handleRemoveRequirement = (index, e) => {
    e.preventDefault();
    const newRequirements = requirements.filter((_, idx) => idx !== index);
    setRequirments(newRequirements);

    const newRequirementsType = requirementsType.filter(
      (_, idx) => idx !== index,
    );
    setRequirmentsType(newRequirementsType);
  };

  const handleRequirementNameChange = (requirementIndex, newName) => {
    const newRequirements = [...requirements];
    const requirement = newRequirements[requirementIndex];
    const oldName = Object.keys(requirement)[0];
    const values = requirement[oldName];
    newRequirements[requirementIndex] = { [newName]: values };
    setRequirments(newRequirements);
  };

  const handleRequirementValueChange = (
    requirementIndex,
    valueIndex,
    newValue,
  ) => {
    const newRequirements = [...requirements];
    const requirement = newRequirements[requirementIndex];
    const requirementName = Object.keys(requirement)[0];
    const value =
      requirementsType[requirementIndex] === "int"
        ? parseInt(newValue) || 0
        : newValue;

    requirement[requirementName][valueIndex] = value;
    setRequirments(newRequirements);
  };

  // Scenario Handlers
  const handleAddScenario = (e) => {
    e.preventDefault();
    setScenarios([...scenarios, { name: "", description: [""], other: [] }]);
  };

  const handleRemoveScenario = (index, e) => {
    e.preventDefault();
    const newScenarios = scenarios.filter((_, idx) => idx !== index);
    setScenarios(newScenarios);
  };

  // Sensitivity Handlers
  const handleAddSensitivity = (e) => {
    e.preventDefault();
    setSensitivities([
      ...sensitivities,
      { name: "", description: [""], list: [""] },
    ]);
  };

  const handleRemoveSensitivity = (index, e) => {
    e.preventDefault();
    const newSensitivities = sensitivities.filter((_, idx) => idx !== index);
    setSensitivities(newSensitivities);
  };

  // Milestone Handlers
  const handleAddMilestone = (e) => {
    e.preventDefault();
    setMilestones([
      ...milestones,
      { name: "", description: [""], milestone_date: "" },
    ]);
  };

  const handleRemoveMilestone = (index, e) => {
    e.preventDefault();
    const newMilestones = milestones.filter((_, idx) => idx !== index);
    setMilestones(newMilestones);
  };

  // Schedule Handlers
  const handleDateChange = (field, value) => {
    setSchedule({ ...schedule, [field]: value });
  };

  // ================== FORM SUBMISSION ==================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(false);
    setSubmittingForm(true);

    const prepareFormData = () => ({
      name: projectName,
      title: projectName.toLowerCase().replace(/\s+/g, "_"),
      description: projectDescription,
      assumptions,
      requirements: Object.fromEntries(
        requirements.map((req, i) => [
          Object.keys(req)[0],
          Object.values(req)[0],
        ]),
      ),
      scenarios,
      sensitivities,
      milestones,
      scheduled_start: schedule.scheduledStart,
      scheduled_end: schedule.scheduledEnd,
      owner: {
        email: ownerEmail,
        first_name: ownerFirstName,
        last_name: ownerLastName,
        organization: ownerOrganization,
      },
    });

    for (let i = 0; i < retriesLimit; i++) {
      try {
        const formData = prepareFormData();
        await createProject(formData, accessToken);
        console.log("Project created successfully!");
        navigate("/overview");
        break;
      } catch (error) {
        console.error(`Error on attempt ${i + 1}: ${error.message}`);
        if (i < retriesLimit - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          setFormError(true);
          setFormErrorMessage(
            `Failed after ${retriesLimit} attempts: ${error.message}`,
          );
        }
      }
    }
    setSubmittingForm(false);
  };
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
                <Form.Group className="mb-3 w-100">
                  <Form.Label
                    id="projectNameLabel"
                    className="d-block text-start w-100 custom-form-label requiredField"
                  >
                    Project Name
                  </Form.Label>
                  <Form.Control
                    type="input"
                    id="projectName"
                    name="projectName"
                    placeholder="Project Name"
                    className="mb-4"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="d-block text-start custom-form-label requiredField">
                          Scheduled Start
                        </Form.Label>
                        <Form.Control
                          id="scheduledStart"
                          name="scheduledStart"
                          type="date"
                          value={schedule.scheduledStart || ""}
                          onChange={(e) =>
                            handleDateChange("scheduledStart", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="d-block text-start custom-form-label requiredField">
                          Scheduled End
                        </Form.Label>
                        <Form.Control
                          id="scheduledEnd"
                          name="scheduledEnd"
                          type="date"
                          value={schedule.scheduledEnd || ""}
                          onChange={(e) =>
                            handleDateChange("scheduledEnd", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="d-block text-start w-100 custom-form-label requiredField">
                      Project Owner
                    </Form.Label>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          First Name
                        </Form.Label>
                        <Form.Control
                          id="firstName"
                          type="input"
                          placeholder="First Name"
                          value={ownerFirstName}
                          onChange={(e) => setOwnerFirstName(e.target.value)}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          Last Name
                        </Form.Label>
                        <Form.Control
                          id="lastName"
                          type="input"
                          placeholder="Last Name"
                          value={ownerLastName}
                          onChange={(e) => setOwnerLastName(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          Email
                        </Form.Label>
                        <Form.Control
                          id="email"
                          type="input"
                          placeholder="Email"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                        />
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          Organization
                        </Form.Label>
                        <Form.Control
                          id="organization"
                          type="input"
                          placeholder="Organization"
                          value={ownerOrganization}
                          onChange={(e) => setOwnerOrganization(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Project Description
                  </Form.Label>
                  <Form.Control
                    id="projectDescription"
                    as="textarea"
                    rows={3}
                    placeholder="Describe your project"
                    className="mb-4"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />

                  {/* Assumptions Section */}
                  <div className="mb-3">
                    <Form.Label className="d-block text-start w-100 custom-form-label">
                      Assumptions
                    </Form.Label>
                    {assumptions.map((assumption, index) => (
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
                            handleAssumptionChange(index, e.target.value)
                          }
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => handleRemoveAssumption(index, e)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="d-flex justify-content-start mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleAddAssumption}
                        className="mt-2 align-items-left"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Assumption
                      </Button>
                    </div>
                  </div>

                  {/* Requirements Section */}
                  <div className="mb-3">
                    <Form.Label className="d-block text-start w-100 custom-form-label">
                      Requirements
                    </Form.Label>
                    <div className="d-block">
                      {requirements.map((requirement, requirements_i) => {
                        const requirementName = Object.keys(requirement)[0];
                        const values = requirement[requirementName];
                        const type = requirementsType[requirements_i];

                        return (
                          <div key={requirements_i}>
                            {values.map((value, index) => (
                              <Row
                                key={`${requirements_i}-${index}`}
                                className="mb-2 align-items-center"
                              >
                                {index === 0 ? (
                                  <>
                                    <Col xs="auto">
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={(e) =>
                                          handleRemoveRequirement(
                                            requirements_i,
                                            e,
                                          )
                                        }
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          padding: "4px",
                                        }}
                                        className="d-flex align-items-center justify-content-center"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </Button>
                                    </Col>
                                    <Col xs={3}>
                                      <Form.Control
                                        type="text"
                                        id={`requirement${index}`}
                                        placeholder="Requirement"
                                        value={requirementName}
                                        onChange={(e) =>
                                          handleRequirementNameChange(
                                            requirements_i,
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
                                    id={`requirementValue-${index}`}
                                    type={type === "int" ? "number" : "text"}
                                    placeholder={
                                      type === "int"
                                        ? "Enter number"
                                        : "Enter value"
                                    }
                                    value={value}
                                    onChange={(e) =>
                                      handleRequirementValueChange(
                                        requirements_i,
                                        index,
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
                                          requirements_i,
                                          index,
                                          e,
                                        )
                                      }
                                      style={{
                                        width: "32px",
                                        height: "32px",
                                        padding: "4px",
                                      }}
                                      className="d-flex align-items-center justify-content-center"
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
                                      handleAddSubRequirement(requirements_i, e)
                                    }
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      padding: "4px",
                                    }}
                                    className="d-flex align-items-center justify-content-center"
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
                        );
                      })}
                    </div>
                    <div className="d-flex justify-content-start mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => handleAddRequirement("str", e)}
                        className="d-flex align-items-center me-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        String Requirement
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => handleAddRequirement("int", e)}
                        className="d-flex align-items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Integer Requirement
                      </Button>
                    </div>
                  </div>

                  {/* Scenarios Section */}
                  <div className="mb-3">
                    {/* Here */}
                    <Form.Label className="d-block text-start w-100 custom-form-label">
                      Scenarios
                    </Form.Label>
                    <div className="d-block">
                      {scenarios.map((scenario, scenarioIndex) => (
                        <div
                          key={scenarioIndex}
                          className="border rounded p-3 mb-4"
                        >
                          {/* Scenario Header with Delete Button */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0" style={{ fontSize: "1.1rem" }}>
                              Scenario {scenarioIndex + 1}
                            </h4>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) =>
                                handleRemoveScenario(scenarioIndex, e)
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "4px",
                              }}
                              className="d-flex align-items-center justify-content-center"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Scenario Name */}
                          <div className="d-flex mb-3 align-items-center gap-2">
                            <Form.Control
                              id={`scenario${scenarioIndex}`}
                              type="input"
                              placeholder="Scenario name"
                              value={scenario.name}
                              onChange={(e) => {
                                const newScenarios = [...scenarios];
                                newScenarios[scenarioIndex].name =
                                  e.target.value;
                                setScenarios(newScenarios);
                              }}
                            />
                          </div>

                          {/* Scenario Description */}
                          <div className="d-flex mb-3 align-items-center gap-2">
                            <Form.Control
                              id={`scenarioDescription${scenarioIndex}`}
                              as="textarea"
                              rows={3}
                              placeholder="Enter description"
                              value={scenario.description[0]}
                              onChange={(e) => {
                                const newScenarios = [...scenarios];
                                newScenarios[scenarioIndex].description = [
                                  e.target.value,
                                ];
                                setScenarios(newScenarios);
                              }}
                            />
                          </div>

                          {/* Other Information Section */}
                          <div className="mb-3">
                            <h5 className="mb-3" style={{ fontSize: "1.1rem" }}>
                              Other
                            </h5>

                            {/* Other Key-Value Pairs */}
                            {scenario.other.map((item, otherIndex) => (
                              <Row
                                key={otherIndex}
                                className="mb-2 align-items-center"
                              >
                                <Col xs={3}>
                                  <Form.Control
                                    id={`scenarioOther${otherIndex}`}
                                    type="input"
                                    placeholder={`key${otherIndex + 1}`}
                                    value={item.key}
                                    onChange={(e) =>
                                      handleOtherInfoChange(
                                        scenarioIndex,
                                        otherIndex,
                                        "key",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Col>
                                <Col>
                                  <Form.Control
                                    id={`scenarioOther-${scenarioIndex}`}
                                    type="input"
                                    placeholder="Value"
                                    value={item.value}
                                    onChange={(e) =>
                                      handleOtherInfoChange(
                                        scenarioIndex,
                                        otherIndex,
                                        "value",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </Col>
                                <Col xs="auto">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveOtherInfo(
                                        scenarioIndex,
                                        otherIndex,
                                      )
                                    }
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      padding: "4px",
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                </Col>
                              </Row>
                            ))}

                            {/* Add Other Information Button */}
                            <div className="d-flex justify-content-start mt-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={(e) =>
                                  handleAddOtherInfo(scenarioIndex, e)
                                }
                                className="d-flex align-items-center gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                Other Information
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Scenario Button */}
                    <div className="d-flex justify-content-start mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleAddScenario}
                        className="mt-2 align-items-left"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Scenario
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <Form.Label className="d-block text-start w-100 custom-form-label">
                      Sensitivities
                    </Form.Label>
                    <div className="d-block">
                      {sensitivities.map((sensitivity, sensitivityIndex) => (
                        <div
                          key={sensitivityIndex}
                          className="border rounded p-3 mb-4"
                        >
                          {/* Sensitivity Header with Delete Button */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0" style={{ fontSize: "1.1rem" }}>
                              {" "}
                              {/* Set font size to 1.0rem */}
                              Sensitivity {sensitivityIndex + 1}
                            </h4>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) =>
                                handleRemoveSensitivity(sensitivityIndex, e)
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "4px",
                              }}
                              className="d-flex align-items-center justify-content-center"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Sensitivity Name */}
                          <div className="d-flex mb-3 align-items-center gap-2">
                            <Form.Control
                              id={`sensitivityName-${sensitivityIndex}`}
                              type="input"
                              placeholder="Sensitivity name"
                              value={sensitivity.name}
                              onChange={(e) => {
                                const newSensitivities = [...sensitivities];
                                newSensitivities[sensitivityIndex].name =
                                  e.target.value;
                                setSensitivities(newSensitivities);
                              }}
                            />
                          </div>

                          {/* Sensitivity Description */}
                          <div className="d-flex mb-3 align-items-center gap-2">
                            <Form.Control
                              id={`sensitivityDescription-${sensitivityIndex}`}
                              as="textarea"
                              rows={3}
                              placeholder="Enter description"
                              value={sensitivity.description[0]}
                              onChange={(e) => {
                                const newSensitivities = [...sensitivities];
                                newSensitivities[sensitivityIndex].description =
                                  [e.target.value];
                                setSensitivities(newSensitivities);
                              }}
                            />
                          </div>

                          {/* Sensitivity List Items */}
                          <div className="mb-3">
                            {sensitivity.list.map((item, listIndex) => (
                              <div
                                key={listIndex}
                                className="d-flex mb-2 align-items-center gap-2"
                              >
                                <Form.Control
                                  id={`senstivityItem-${sensitivityIndex}`}
                                  type="input"
                                  placeholder="Enter sensitivity item"
                                  value={item}
                                  onChange={(e) => {
                                    const newSensitivities = [...sensitivities];
                                    newSensitivities[sensitivityIndex].list[
                                      listIndex
                                    ] = e.target.value;
                                    setSensitivities(newSensitivities);
                                  }}
                                />
                                {sensitivity.list.length > 1 && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={(e) =>
                                      handleRemoveSensitivityListItem(
                                        sensitivityIndex,
                                        listIndex,
                                        e,
                                      )
                                    }
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}

                            {/* Add List Item Button */}
                            <div className="d-flex justify-content-start mt-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={(e) =>
                                  handleAddSensitivityListItem(
                                    sensitivityIndex,
                                    e,
                                  )
                                }
                                className="d-flex align-items-center gap-1"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Item
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Sensitivity Button */}
                    <div className="d-flex justify-content-start mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleAddSensitivity}
                        className="mt-2 align-items-left"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Sensitivity
                      </Button>
                    </div>
                  </div>

                  {/* Milestones Section */}
                  <div className="mb-3">
                    <Form.Label className="d-block text-start w-100 custom-form-label">
                      Milestones
                    </Form.Label>
                    <div className="d-block">
                      {milestones.map((milestone, milestoneIndex) => (
                        <div
                          key={milestoneIndex}
                          className="border rounded p-3 mb-4"
                        >
                          {/* Milestone Header with Delete Button */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0" style={{ fontSize: "1.1rem" }}>
                              {" "}
                              {/* Set font size to 1.0rem */}
                              Milestone {milestoneIndex + 1}
                            </h4>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) =>
                                handleRemoveMilestone(milestoneIndex, e)
                              }
                              style={{
                                width: "32px",
                                height: "32px",
                                padding: "4px",
                              }}
                              className="d-flex align-items-center justify-content-center"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Milestone Name */}
                          <div className="d-flex mb-3 align-items-center gap-2">
                            <Form.Control
                              id={`milestoneName-${milestoneIndex}`}
                              type="input"
                              placeholder="Milestone name"
                              value={milestone.name}
                              onChange={(e) => {
                                const newMilestones = [...milestones];
                                newMilestones[milestoneIndex].name =
                                  e.target.value;
                                setMilestones(newMilestones);
                              }}
                            />
                          </div>

                          {/* Milestone Description */}
                          <div className="d-flex mb-3 align-items-center gap-2">
                            <Form.Control
                              id={`milestoneDescription-${milestoneIndex}`}
                              as="textarea"
                              rows={3}
                              placeholder="Enter description"
                              value={milestone.description[0]}
                              onChange={(e) => {
                                const newMilestones = [...milestones];
                                newMilestones[milestoneIndex].description = [
                                  e.target.value,
                                ];
                                setMilestones(newMilestones);
                              }}
                            />
                          </div>

                          {/* Milestone Date */}
                          <div className="d-flex mb-3 align-items-center gap-2">
                            <Form.Group
                              id={`milestone-date-${milestoneIndex}`}
                              className="w-100"
                            >
                              <Form.Label
                                className="d-block text-start"
                                style={{ fontSize: "1.0rem" }}
                              >
                                Milestone Date (YYYY-MM-DD)
                              </Form.Label>
                              <Form.Control
                                id={`milestoneDate-${milestoneIndex}`}
                                type="date"
                                value={milestone.milestone_date}
                                onChange={(e) => {
                                  const newMilestones = [...milestones];
                                  newMilestones[milestoneIndex].milestone_date =
                                    e.target.value;
                                  setMilestones(newMilestones);
                                }}
                              />
                            </Form.Group>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Milestone Button */}
                    <div className="d-flex justify-content-start mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleAddMilestone}
                        className="mt-2 align-items-left"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Milestone
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
