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

const CreateProject = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, getProject } = useDataStore();

  const [formData, setFormData] = useState({
    name: "project name",
    title: "project_name",
    description: "example",
    assumptions: ["Assumption 1"],
    requirements: [{ KeyRequirement: ["Value1"] }],
    scenarios: [
      {
        name: "Base Scenario",
        description: ["Description of the base scenario"],
        other: [{ key: "Parameter1", value: "Value1" }],
      },
    ],
    sensitivities: [
      {
        name: "Default Sensitivity",
        description: ["Description of sensitivity"],
        list: ["Sensitivity factor 1"],
      },
    ],
    milestones: [
      {
        name: "Milestone 1",
        description: ["First major project milestone"],
        milestone_date: "2023-02-01",
      },
    ],
    scheduled_start: "2023-01-01",
    scheduled_end: "2023-12-31",
    owner: {
      email: "Jordan.Eisenman@nrel.gov",
      first_name: "Jordan",
      last_name: "Eisenman",
      organization: "NREL",
    },
  });

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
    getProjectBasics(accessToken);
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  // Project information
  const [projectName, setProjectName] = useState("example project");
  const [projectDescription, setProjectDescription] = useState("example");

  // Owner information
  const [ownerFirstName, setOwnerFirstName] = useState("Jordan");
  const [ownerLastName, setOwnerLastName] = useState("Eisenman");
  const [ownerEmail, setOwnerEmail] = useState("Jordan.Eisenman@nrel.gov");
  const [ownerOrganization, setOwnerOrganization] = useState("NREL");

  // Assumptions state
  const [assumptions, setAssumptions] = useState(["Assumption 1"]);
  const handleAddAssumption = (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      assumptions: [...prevState.assumptions, ""],
    }));
  };
  const handleRemoveAssumption = (index, e) => {
    e.preventDefault();
    const newAssumptions = assumptions.filter((_, idx) => idx !== index);
    setAssumptions(newAssumptions);
  };
  const handleAssumptionChange = (index, value) => {
    setAssumptions((prevAssumptions) => {
      const updatedAssumptions = [...prevAssumptions];
      updatedAssumptions[index] = value;
      return updatedAssumptions;
    });
  };
  // Requirement state
  const [requirements, setRequirments] = useState([
    { KeyRequirement: ["Value1"] },
  ]);
  const [requirementsType, setRequirmentsType] = useState(["str"]);

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
  const [scenarios, setScenarios] = useState([
    {
      name: "Base Scenario",
      description: ["Description of the base scenario"],
      other: [{ key: "Parameter1", value: "Value1" }],
    },
  ]);

  const handleAddScenario = (e) => {
    e.preventDefault();
    setScenarios([
      ...scenarios,
      {
        name: "",
        description: [""],
        other: [],
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
    newScenarios[scenarioIndex].other.push({
      key: "",
      value: "",
    });
    setScenarios(newScenarios);
  };

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

  const handleRemoveOtherInfo = (scenarioIndex, otherIndex) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].other.splice(otherIndex, 1);
    setScenarios(newScenarios);
  };

  const [sensitivities, setSensitivities] = useState([
    {
      name: "Default Sensitivity",
      description: ["Description of sensitivity"],
      list: ["Sensitivity factor 1"],
    },
  ]);

  const handleAddSensitivity = (e) => {
    e.preventDefault();
    setSensitivities([
      ...sensitivities,
      {
        name: "",
        description: [""],
        list: [""],
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
  const [milestones, setMilestones] = useState([
    {
      name: "Milestone 1",
      description: ["First major project milestone"],
      milestone_date: "2023-02-01",
    },
  ]);

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
    scheduledStart: "2023-01-01",
    scheduledEnd: "2023-12-31",
  });

  const handleDateChange = (field, value, e) => {
    e.preventDefault();
    console.log(value);
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const createProject = useDataStore((state) => state.createProject);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [submittingForm, setSubmittingForm] = useState(false);

  const retriesLimit = 2;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(false);
    setSubmittingForm(true);

    for (let i = 0; i < retriesLimit; i++) {
      // Generate the projectTitle as lowercase with underscores
      const projectTitle = projectName.toLowerCase().replace(/\s+/g, "_");

      // Process requirements into a dictionary
      let requirementsDict = {};
      requirements.forEach((requirementObj) => {
        const requirementName = Object.keys(requirementObj)[0];
        const values = requirementObj[requirementName];
        requirementsDict[requirementName] = values;
      });

      // Process scenarios
      let scenariosList = scenarios.map((scenario) => {
        let otherDict = {};
        scenario.other.forEach((item) => {
          if (item.key) {
            otherDict[item.key] = item.value;
          }
        });

        return {
          name: scenario.name,
          description: scenario.description,
          other: otherDict,
        };
      });

      // Process sensitivities
      let sensitivitiesList = sensitivities.map((sensitivity) => {
        return {
          name: sensitivity.name,
          description: sensitivity.description,
        };
      });

      // Process milestones
      let milestonesList = milestones.map((milestone) => {
        return {
          name: milestone.name,
          description: milestone.description,
          milestone_date: milestone.milestone_date,
        };
      });

      //  Required field validation
      // Validating ProjectName
      const title = document.getElementById("projectName");
      if (projectTitle.length === 0) {
        title.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage("You forgot to provide a title for your project.");
        return;
      }
      title.classList.remove("form-error");

      // Validating Schedule
      const scheduledStart = document.getElementById("scheduledStart");
      const scheduledEnd = document.getElementById("scheduledEnd");
      let hasScheduleError = false;
      if (!schedule.scheduledStart) {
        scheduledStart.classList.add("form-error");
        hasScheduleError = true;
      }
      if (!schedule.scheduledEnd) {
        scheduledEnd.classList.add("form-error");
        hasScheduleError = true;
      }
      if (schedule.scheduledStart && schedule.scheduledEnd) {
        if (
          new Date(schedule.scheduledEnd) < new Date(schedule.scheduledStart)
        ) {
          scheduledStart.classList.add("form-error");
          scheduledEnd.classList.add("form-error");
          hasScheduleError = true;
        }
      }
      if (hasScheduleError) {
        console.error(
          "Schedule is invalid: End date is before start date or fields are missing.",
        );
        setFormError(true);
        setFormErrorMessage(
          "The schedule is invalid. Please ensure both dates are provided and the end date is not before the start date.",
        );
        return;
      }
      scheduledStart.classList.remove("form-error");
      scheduledEnd.classList.remove("form-error");

      // Validating Owner
      const firstName = document.getElementById("firstName");
      if (ownerFirstName.length === 0) {
        firstName.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage("You forgot to provide your first name.");
        return;
      }
      firstName.classList.remove("form-error");

      const lastName = document.getElementById("lastName");
      if (ownerLastName.length === 0) {
        lastName.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage("You forgot to provide your last name.");
        return;
      }
      lastName.classList.remove("form-error");

      const email = document.getElementById("email");
      if (ownerEmail.length === 0) {
        email.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage("You forgot to provide the project owner's email.");
        return;
      }
      email.classList.remove("form-error");

      const organization = document.getElementById("organization");
      if (ownerOrganization.length === 0) {
        organization.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(
          "You forgot to provide the project owner's organization.",
        );
        return;
      }
      organization.classList.remove("form-error");

      // Assemble the final data object
      setFormData({
        name: projectName,
        title: projectTitle,
        description: projectDescription,
        assumptions: assumptions,
        requirements: requirementsDict,
        scenarios: scenariosList,
        sensitivities: sensitivitiesList,
        milestones: milestonesList,
        scheduled_start: schedule.scheduledStart,
        scheduled_end: schedule.scheduledEnd,
        owner: {
          email: ownerEmail,
          first_name: ownerFirstName,
          last_name: ownerLastName,
          organization: ownerOrganization,
        },
      });

      // Call createProject with the data and access token
      console.log(JSON.stringify(formData, null, 2));

      try {
        await createProject(formData, accessToken);
        console.log(`Project created successfully on attempt ${i + 1}`);
        // If successful, break out of the retry loop
        break;
      } catch (error) {
        console.error(
          `Error creating project (attempt ${i + 1}/${retriesLimit}):`,
          error.status,
        );

        // If this is not the last attempt, wait 1 second before retrying
        if (i < retriesLimit - 1) {
          setFormError(true);
          setFormErrorMessage(
            `Error creating project: ${error.message}. Retrying in 1 second...`,
          );
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        } else {
          // If this was the last attempt, set the final error message
          setFormError(true);
          setFormErrorMessage(
            `Failed to create project after ${retriesLimit} attempts: ${error.message}`,
          );
          setSubmittingForm(false);
          return;
        }
      }
    }

    // If we get here, the project was created successfully
    setFormError(false);
    await getProject(projectName, accessToken);
    navigate("/overview");
  };
  const [isExpanded, setIsExpanded] = useState(false);
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
          <PageTitle title="Create Project" />
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
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                        title: e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "_"),
                      }));
                    }}
                  />{" "}
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
                          value={formData.scheduledStart || ""}
                          onChange={(e) =>
                            handleDateChange(
                              "scheduledStart",
                              e.target.value,
                              e,
                            )
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
                          value={formData.scheduled_end || ""}
                          onChange={(e) =>
                            handleDateChange("scheduled_end", e.target.value, e)
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
                          value={formData.owner.name}
                          onChange={(e) => {
                            setFormData((prevState) => ({
                              ...prevState,
                              owner: {
                                ...prevState.owner,
                                name: e.target.value,
                              },
                            }));
                          }}
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

export default CreateProject;
