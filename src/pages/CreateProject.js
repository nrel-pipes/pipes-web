import React, { useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Plus, Minus } from "lucide-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PageTitle from "../components/pageTitle";
import DropdownButton from "react-bootstrap/DropdownButton";
import SideColumn from "../components/SideColumn";
import "./CreateProject.css";

const CreateProject = () => {
  // Assumptions state
  const [assumptions, setAssumptions] = useState([]);
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

  // Requirement state
  const [requirements, setRequirments] = useState([]);
  const [requirementsType, setRequirmentsType] = useState([]);

  const handleAddRequirement = (type, e) => {
    e.preventDefault();
    // Initialize with an empty requirement name and an array with one default value
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

  // New function to handle adding a sub-requirement value
  const handleAddSubRequirement = (requirementIndex, e) => {
    e.preventDefault();
    const newRequirements = [...requirements];
    const requirement = newRequirements[requirementIndex];
    const requirementName = Object.keys(requirement)[0];
    const defaultValue = requirementsType[requirementIndex] === "int" ? 0 : "";

    requirement[requirementName] = [
      ...requirement[requirementName],
      defaultValue,
    ];
    setRequirments(newRequirements);
  };

  // New function to handle removing a sub-requirement value
  const handleRemoveSubRequirement = (requirementIndex, valueIndex, e) => {
    e.preventDefault();
    const newRequirements = [...requirements];
    const requirement = newRequirements[requirementIndex];
    const requirementName = Object.keys(requirement)[0];

    requirement[requirementName] = requirement[requirementName].filter(
      (_, idx) => idx !== valueIndex,
    );
    setRequirments(newRequirements);
  };

  // New function to handle requirement name changes
  const handleRequirementNameChange = (requirementIndex, newName) => {
    const newRequirements = [...requirements];
    const requirement = newRequirements[requirementIndex];
    const oldName = Object.keys(requirement)[0];
    const values = requirement[oldName];

    // Create new object with updated name but same values
    newRequirements[requirementIndex] = { [newName]: values };
    setRequirments(newRequirements);
  };

  // New function to handle requirement value changes
  const handleRequirementValueChange = (
    requirementIndex,
    valueIndex,
    newValue,
  ) => {
    const newRequirements = [...requirements];
    const requirement = newRequirements[requirementIndex];
    const requirementName = Object.keys(requirement)[0];

    // Handle type conversion for integers
    if (requirementsType[requirementIndex] === "int") {
      const intValue = parseInt(newValue) || 0;
      requirement[requirementName][valueIndex] = intValue;
    } else {
      requirement[requirementName][valueIndex] = newValue;
    }

    setRequirments(newRequirements);
  };

  // Adding scenario
  const [scenarios, setScenarios] = useState([]); // Will hold array of {name, description[], other}

  const handleAddScenario = (e) => {
    e.preventDefault();
    setScenarios([
      ...scenarios,
      {
        name: "",
        description: [""],
        other: [], // Initialize with empty array instead of object
      },
    ]);
  };

  const handleRemoveScenario = (index, e) => {
    e.preventDefault();
    const newScenarios = scenarios.filter((_, idx) => idx !== index);
    setScenarios(newScenarios);
  };

  const handleAddOtherInfo = (scenarioIndex, e) => {
    e.preventDefault();
    const newScenarios = [...scenarios];
    // Add a new entry with empty key and value
    newScenarios[scenarioIndex].other.push({
      key: "",
      value: "",
    });
    setScenarios(newScenarios);
  };

  // Example of handling other info changes
  const handleOtherInfoChange = (
    scenarioIndex,
    otherIndex,
    field,
    newValue,
  ) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].other[otherIndex][field] = newValue;
    setScenarios(newScenarios);
  };

  // Example of removing other info
  const handleRemoveOtherInfo = (scenarioIndex, otherIndex) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].other.splice(otherIndex, 1);
    setScenarios(newScenarios);
  };

  // Add this with other state declarations
  // Adding Sensitivity to state
  const [sensitivities, setSensitivities] = useState([]); // Will hold array of {name, description[], list[]}

  const handleAddSensitivity = (e) => {
    e.preventDefault();
    setSensitivities([
      ...sensitivities,
      {
        name: "",
        description: [""],
        list: [""], // Initialize with one empty string in the list
      },
    ]);
  };

  const handleRemoveSensitivity = (index, e) => {
    e.preventDefault();
    const newSensitivities = sensitivities.filter((_, idx) => idx !== index);
    setSensitivities(newSensitivities);
  };

  const handleAddSensitivityListItem = (sensitivityIndex, e) => {
    e.preventDefault();
    const newSensitivities = [...sensitivities];
    newSensitivities[sensitivityIndex].list.push("");
    setSensitivities(newSensitivities);
  };

  const handleRemoveSensitivityListItem = (sensitivityIndex, listIndex, e) => {
    e.preventDefault();
    const newSensitivities = [...sensitivities];
    newSensitivities[sensitivityIndex].list = newSensitivities[
      sensitivityIndex
    ].list.filter((_, idx) => idx !== listIndex);
    setSensitivities(newSensitivities);
  };
  // Setting Milestones
  const [milestones, setMilestones] = useState([]); // Will hold array of {name, description[], milestone_date}

  const handleAddMilestone = (e) => {
    e.preventDefault();
    setMilestones([
      ...milestones,
      {
        name: "",
        description: [""],
        milestone_date: "", // Will be in YYYY-MM-DD format
      },
    ]);
  };

  const handleRemoveMilestone = (index, e) => {
    e.preventDefault();
    const newMilestones = milestones.filter((_, idx) => idx !== index);
    setMilestones(newMilestones);
  };
  // Setting project Schedule
  const [schedule, setSchedule] = useState({
    scheduledStart: null,
    scheduledEnd: null,
  });

  const handleDateChange = (field, value) => {
    setSchedule({
      ...schedule,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  const [isExpanded, setIsExpanded] = useState(false);
  // Adding definitions
  const [definitions] = useState([
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
  ]);

  return (
    <Container fluid className="p-0">
      <Row className="g-0" style={{ display: "flex", flexDirection: "row" }}>
        {/* SideColumn wrapper with dynamic width */}
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
            definitions={definitions} // Pass definitions here
          />
        </div>
        <Col style={{ flex: 1, transition: "margin-left 0.3s ease" }}>
          <PageTitle title="Create Project" />
          <div className="d-flex justify-content-center">
            <Col
              className="justify-content-center mw-600"
              style={{ maxWidth: "1000px" }}
              xs={12}
              md={9}
            >
              <Form className="my-4 justify-content" onSubmit={handleSubmit}>
                <Form.Group className="mb-3 w-100" controlId="formProjectName">
                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Project Name
                  </Form.Label>
                  <Form.Control
                    type="input"
                    placeholder="Project Name"
                    className="mb-4"
                  />

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="scheduledStart">
                        <Form.Label className="d-block text-start custom-form-label">
                          Scheduled Start
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={schedule.scheduledStart || ""}
                          onChange={(e) =>
                            handleDateChange("scheduledStart", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="scheduledEnd">
                        <Form.Label className="d-block text-start custom-form-label">
                          Scheduled End
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={schedule.scheduledEnd || ""}
                          onChange={(e) =>
                            handleDateChange("scheduledEnd", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formProjectOwner">
                    <Form.Label className="d-block text-start w-100 custom-form-label">
                      Project Owner
                    </Form.Label>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          First Name
                        </Form.Label>
                        <Form.Control type="input" placeholder="First Name" />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          Last Name
                        </Form.Label>
                        <Form.Control type="input" placeholder="Last Name" />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          Email
                        </Form.Label>
                        <Form.Control type="input" placeholder="Email" />
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label className="d-block text-start">
                          Organization
                        </Form.Label>
                        <Form.Control type="input" placeholder="Organiztion" />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Project Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe your project"
                    className="mb-4"
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
                        variant="outline-success"
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
                            {values.map((value, value_i) => (
                              <Row
                                key={`${requirements_i}-${value_i}`}
                                className="mb-2 align-items-center"
                              >
                                {value_i === 0 ? (
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
                                        value_i,
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
                                          value_i,
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
                                    variant="outline-success"
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
                        variant="outline-success"
                        size="sm"
                        onClick={(e) => handleAddRequirement("str", e)}
                        className="d-flex align-items-center me-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        String Requirement
                      </Button>

                      <Button
                        variant="outline-success"
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
                                variant="outline-success"
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
                        variant="outline-success"
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
                        variant="outline-success"
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
                              controlId={`milestone-date-${milestoneIndex}`}
                              className="w-100"
                            >
                              <Form.Label
                                className="d-block text-start"
                                style={{ fontSize: "1.0rem" }}
                              >
                                Milestone Date (YYYY-MM-DD)
                              </Form.Label>
                              <Form.Control
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
                        variant="outline-success"
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

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProject;
