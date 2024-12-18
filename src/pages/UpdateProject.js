import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

import PageTitle from "../components/pageTitle";
import SideColumn from "../components/form/SideColumn";
import useDataStore from "../pages/stores/DataStore";
import useAuthStore from "../pages/stores/AuthStore";
import FormError from "../components/form/FormError";
import "./FormStyles.css";
import { useState, useEffect } from "react";

const UpdateProject = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, getProject, currentProject } = useDataStore();

  const normalizeFormData = (form) => {
    // Normalize requirements into parallel arrays
    const keys = Object.keys(form.requirements || {});
    const values = keys.map((key) => {
      const value = form.requirements[key];

      if (value == null) {
        return [];
      }
      if (Array.isArray(value)) {
        return value.map(String);
      }
      return [String(value)];
    });
    // Normalize scenarios' other field into arrays of objects
    const normalizedScenarios = (form.scenarios || []).map((scenario) => ({
      ...scenario,
      description: Array.isArray(scenario.description)
        ? scenario.description
        : [scenario.description],
      other: Array.isArray(scenario.other)
        ? scenario.other
        : Object.entries(scenario.other || {}).map(([key, value]) => [
            String(key),
            String(value),
          ]),
    }));
    return {
      ...form,
      requirements: {
        keys,
        values,
      },
      scenarios: normalizedScenarios,
    };
  };
  const [form, setForm] = useState(() => normalizeFormData(currentProject));
  const handleRemoveSensitivity = (index, e) => {
    e.preventDefault();
    setForm((prevForm) => ({
      ...prevForm,
      sensitivities: prevForm.sensitivities.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddSensitivityListItem = (sensitivityIndex, e) => {
    e.preventDefault();
    setForm((prevForm) => {
      // If the last item is already empty, don't add another
      if (prevForm.sensitivities[sensitivityIndex].list.at(-1) === "") {
        return prevForm;
      }

      const newSensitivities = [...(prevForm.sensitivities || [])];
      newSensitivities[sensitivityIndex].list.push("");
      return {
        ...prevForm,
        sensitivities: newSensitivities,
      };
    });
  };
  const handleRemoveSensitivityListItem = (sensitivityIndex, listIndex, e) => {
    e.preventDefault();
    setForm((prevForm) => {
      const newSensitivities = [...(prevForm.sensitivities || [])];
      newSensitivities[sensitivityIndex].list = newSensitivities[
        sensitivityIndex
      ].list.filter((_, idx) => idx !== listIndex);
      return {
        ...prevForm,
        sensitivities: newSensitivities,
      };
    });
  };
  const handleMilestoneDateChange = (milestoneIndex, value) => {
    setForm((prevForm) => {
      const newMilestones = [...(prevForm.milestones || [])];
      if (!newMilestones[milestoneIndex]) {
        newMilestones[milestoneIndex] = {};
      }
      newMilestones[milestoneIndex].milestone_date = value;
      return {
        ...prevForm,
        milestones: newMilestones,
      };
    });
  };

  const handleKeyChange =
    (scenarioIndex, otherIndex, item, handleScenarioChange) => (e) => {
      const newOther = [...form.scenarios.other];
      newOther[otherIndex] = [e.target.value, item[1]];
      handleScenarioChange(scenarioIndex, "other", newOther);
    };

  const handleValueChange =
    (scenarioIndex, otherIndex, item, handleScenarioChange) => (e) => {
      const newOther = [...form.scenarios[scenarioIndex].other];
      newOther[otherIndex] = [item[0], e.target.value];
      handleScenarioChange(scenarioIndex, "other", newOther);
    };

  const handleRemove =
    (scenarioIndex, otherIndex, handleScenarioChange) => () => {
      const newOther = form.scenarios[scenarioIndex].other.filter(
        (_, index) => index !== otherIndex,
      );
      handleScenarioChange(scenarioIndex, "other", newOther);
    };

  const handleScenarioChange = (scenarioIndex, field, value) => {
    setForm((prevForm) => {
      const newScenarios = [...prevForm.scenarios];
      newScenarios[scenarioIndex] = {
        ...newScenarios[scenarioIndex],
        [field]: value,
      };
      return {
        ...prevForm,
        scenarios: newScenarios,
      };
    });
  };

  const handleRemoveScenario = (index, e) => {
    e.preventDefault();
    setForm((prevForm) => ({
      ...prevForm,
      scenarios: prevForm.scenarios.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddOtherInfo = (scenarioIndex, e) => {
    e.preventDefault();
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].other.push(["", ""]);
    setScenarios(newScenarios);
  };
  const handleRemoveOtherInfo = (scenarioIndex, otherIndex) => {
    setForm((prevForm) => {
      const newScenarios = [...prevForm.scenarios];
      newScenarios[scenarioIndex] = {
        ...newScenarios[scenarioIndex],
        other: newScenarios[scenarioIndex].other.filter(
          (_, idx) => idx !== otherIndex,
        ),
      };
      return {
        ...prevForm,
        scenarios: newScenarios,
      };
    });
  };

  // Add a new other info item to a scenario
  const handleSetArrayValue = (arrayPath, index, value) => {
    setForm((prevState) => {
      const keys = arrayPath.split(".");
      const newState = { ...prevState };
      let current = newState;

      // Navigate to the array
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      // Get the array name from the last key
      const arrayName = keys[keys.length - 1];
      // Create new array with updated value
      const newArray = [...current[arrayName]];
      newArray[index] = value;
      current[arrayName] = newArray;

      return newState;
    });
  };

  // Usage:
  const handleRequirementNameChange = (index, newName) => {
    setForm((prevForm) => {
      const newKeys = [...prevForm.requirements.keys];
      newKeys[index] = newName;

      return {
        ...prevForm,
        requirements: {
          ...prevForm.requirements,
          keys: newKeys,
        },
      };
    });
  };

  const handleRequirementValueChange = (index, valueIndex, newValue) => {
    setForm((prevForm) => {
      const newValues = [...prevForm.requirements.values];
      newValues[index] = [...newValues[index]];
      newValues[index][valueIndex] = newValue;

      return {
        ...prevForm,
        requirements: {
          ...prevForm.requirements,
          values: newValues,
        },
      };
    });
  };

  const handleRemoveRequirement = (index, e) => {
    e.preventDefault();
    setForm((prevForm) => {
      const newKeys = [...prevForm.requirements.keys];
      const newValues = [...prevForm.requirements.values];
      newKeys.splice(index, 1);
      newValues.splice(index, 1);

      return {
        ...prevForm,
        requirements: {
          ...prevForm.requirements,
          keys: newKeys,
          values: newValues,
        },
      };
    });
  };

  const handleRemoveSubRequirement = (index, valueIndex, e) => {
    e.preventDefault();
    setForm((prevForm) => {
      const newValues = [...prevForm.requirements.values];
      newValues[index] = [...newValues[index]];
      newValues[index].splice(valueIndex, 1);

      return {
        ...prevForm,
        requirements: {
          ...prevForm.requirements,
          values: newValues,
        },
      };
    });
  };

  const handleAddSubRequirement = (index, e) => {
    e.preventDefault();
    setForm((prevForm) => {
      const newValues = [...prevForm.requirements.values];
      newValues[index] = [...newValues[index], ""];

      return {
        ...prevForm,
        requirements: {
          ...prevForm.requirements,
          values: newValues,
        },
      };
    });
  };

  const handleAddRequirement = (e) => {
    e.preventDefault();
    setForm((prevForm) => {
      const newKeys = [...prevForm.requirements.keys, ""];
      const newValues = [...prevForm.requirements.values, [""]];

      return {
        ...prevForm,
        requirements: {
          ...prevForm.requirements,
          keys: newKeys,
          values: newValues,
        },
      };
    });
  };
  const handleMilestoneNameChange = (milestoneIndex, value) => {
    setForm((prevForm) => {
      const newMilestones = [...(prevForm.milestones || [])];
      if (!newMilestones[milestoneIndex]) {
        newMilestones[milestoneIndex] = {};
      }
      newMilestones[milestoneIndex].name = value;
      return {
        ...prevForm,
        milestones: newMilestones,
      };
    });
  };
  const handleMilestoneDescriptionChange = (milestoneIndex, value) => {
    setForm((prevForm) => {
      const newMilestones = [...(prevForm.milestones || [])];
      if (!newMilestones[milestoneIndex]) {
        newMilestones[milestoneIndex] = {};
      }
      newMilestones[milestoneIndex].description = [value];
      return {
        ...prevForm,
        milestones: newMilestones,
      };
    });
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    setForm((prevForm) => ({
      ...prevForm,
      milestones: [
        ...(prevForm.milestones || []),
        {
          name: "",
          description: [""],
          milestone_date: "", // Will be in YYYY-MM-DD format
        },
      ],
    }));
  };
  const handleSetString = (path, value) => {
    setForm((prevState) => {
      const keys = path.split(".");
      const newState = { ...prevState };
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };
  const handleAssumptionChange = (index, value) => {
    setForm((prevState) => ({
      ...prevState,
      assumptions: prevState.assumptions.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };
  const handleAddAssumption = () => {
    setForm((prevState) => ({
      ...prevState,
      assumptions: [...prevState.assumptions, ""],
    }));
  };
  const handleRemoveAssumption = (index, e) => {
    e.preventDefault(); // Prevent any default button behavior

    setForm((prevState) => ({
      ...prevState,
      assumptions: prevState.assumptions.filter((_, i) => i !== index),
    }));
  };

  const handleDateChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };
  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  // Handle auth and initial data loading
  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
    getProjectBasics(accessToken);
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  // Handle loading project data when we have a project name
  useEffect(() => {
    // console.log(JSON.stringify(currentProject, null, 2));

    if (projectName) {
      getProject(currentProject.name, accessToken);
    }
  }, [currentProject, getProject, accessToken]);

  // Update form when project data loads

  // Project information
  const [projectName, setProjectName] = useState("example project");

  // Owner information
  const [ownerFirstName] = useState("Jordan");
  const [ownerLastName] = useState("Eisenman");
  const [ownerEmail] = useState("Jordan.Eisenman@nrel.gov");
  const [ownerOrganization] = useState("NREL");

  // Requirement state
  const [requirements] = useState([{ KeyRequirement: ["Value1"] }]);

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
  const [sensitivities, setSensitivities] = useState([
    {
      name: "Default Sensitivity",
      description: ["Description of sensitivity"],
      list: ["Sensitivity factor 1"],
    },
  ]);

  const handleAddSensitivity = (e) => {
    e.preventDefault();
    setForm((prevForm) => ({
      ...prevForm,
      sensitivities: [
        ...(prevForm.sensitivities || []),
        {
          name: "",
          description: [""],
          list: [""],
        },
      ],
    }));
  };
  // Setting Milestones
  const [milestones, setMilestones] = useState([
    {
      name: "Milestone 1",
      description: ["First major project milestone"],
      milestone_date: "2023-02-01",
    },
  ]);

  const handleRemoveMilestone = (milestoneIndex, e) => {
    e.preventDefault();
    setForm((prevForm) => ({
      ...prevForm,
      milestones: prevForm.milestones.filter(
        (_, index) => index !== milestoneIndex,
      ),
    }));
  };
  // Setting project Schedule
  const [schedule, setSchedule] = useState({
    scheduledStart: "2023-01-01",
    scheduledEnd: "2023-12-31",
  });

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

      console.log(JSON.stringify(form, null, 2));

      try {
        await createProject(form, accessToken);
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
                    placeholder="Project Names"
                    className="mb-4"
                    value={form.name}
                    onChange={(e) => handleSetString("name", e.target.value)}
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
                          value={formatDateForInput(form.scheduled_start) || ""}
                          onChange={(e) =>
                            handleDateChange("scheduled_start", e.target.value)
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
                          value={formatDateForInput(form.scheduled_end) || ""}
                          onChange={(e) =>
                            handleDateChange("scheduled_end", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
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
                        value={form.owner.first_name}
                        onChange={(e) =>
                          handleSetString("owner.first_name", e.target.value)
                        }
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
                        value={form.owner.last_name}
                        onChange={(e) =>
                          handleSetString("owner.last_name", e.target.value)
                        }
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
                        value={form.owner.email}
                        onChange={(e) =>
                          handleSetString("owner.email", e.target.value)
                        }
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
                        value={form.owner.organization}
                        onChange={(e) =>
                          handleSetString("owner.organization", e.target.value)
                        }
                      />
                    </Col>
                  </Row>
                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Project Description
                  </Form.Label>
                  <Form.Control
                    id="projectDescription"
                    as="textarea"
                    rows={3}
                    placeholder="Describe your project"
                    className="mb-4"
                    value={form.description}
                    onChange={(e) =>
                      handleSetString("description", e.target.value)
                    }
                  />
                  <Form.Label className="d-block text-start w-100 custom-form-label">
                    Assumptions
                  </Form.Label>
                  {form.assumptions.map((assumption, index) => (
                    <div
                      key={index}
                      className="d-flex mb-2 align-items-center gap-2"
                    >
                      <Form.Control
                        id={`assumptions${index}`}
                        type="input"
                        placeholder="Enter assumption"
                        value={form.assumptions[index]} // Changed from assumption to assumptions
                        onChange={(e) =>
                          handleAssumptionChange(index, e.target.value)
                        }
                      />{" "}
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
                  <Form.Label className="d-block text-start w-100 custom-form-label mt-3">
                    Requirements
                  </Form.Label>
                  <div className="d-block">
                    {form.requirements.keys.map((requirementName, index) => {
                      const values = form.requirements.values[index];

                      return (
                        <div key={index}>
                          {values.map((value, valueIndex) => (
                            <Row
                              key={`${index}-${valueIndex}`}
                              className="mb-2 align-items-center"
                            >
                              {valueIndex === 0 ? (
                                <>
                                  <Col xs="auto">
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={(e) =>
                                        handleRemoveRequirement(index, e)
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
                                      id={`requirement-${index}`}
                                      placeholder="Requirement"
                                      value={requirementName}
                                      onChange={(e) =>
                                        handleRequirementNameChange(
                                          index,
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
                                  id={`value-${index}-${valueIndex}`}
                                  type="text"
                                  placeholder="Enter value"
                                  value={value}
                                  onChange={(e) =>
                                    handleRequirementValueChange(
                                      index,
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
                                        index,
                                        valueIndex,
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
                                    handleAddSubRequirement(index, e)
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
                  </div>{" "}
                  <div className="d-flex justify-content-start mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => handleAddRequirement(e)}
                      className="d-flex align-items-center me-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Requirement
                    </Button>
                  </div>
                  <Form.Label className="d-block text-start w-100 custom-form-label mt-3">
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
                              newScenarios[scenarioIndex].name = e.target.value;
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
                                  value={item[0] || ""} // Add fallback empty string
                                  onChange={(e) => {
                                    const newScenarios = [...scenarios];
                                    newScenarios[scenarioIndex].other[
                                      otherIndex
                                    ] = [
                                      e.target.value,
                                      item[1] || "", // Add fallback empty string
                                    ];
                                    setScenarios(newScenarios);
                                  }}
                                />
                              </Col>
                              <Col>
                                <Form.Control
                                  id={`scenarioOther-${scenarioIndex}`}
                                  type="input"
                                  placeholder="Value"
                                  value={item[1] || ""} // Add fallback empty string
                                  onChange={(e) => {
                                    const newScenarios = [...scenarios];
                                    newScenarios[scenarioIndex].other[
                                      otherIndex
                                    ] = [
                                      item[0] || "", // Add fallback empty string
                                      e.target.value,
                                    ];
                                    setScenarios(newScenarios);
                                  }}
                                />
                              </Col>
                              <Col xs="auto">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => {
                                    const newScenarios = [...scenarios];
                                    newScenarios[scenarioIndex].other =
                                      scenario.other.filter(
                                        (_, index) => index !== otherIndex,
                                      );
                                    setScenarios(newScenarios);
                                  }}
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
                          ))}{" "}
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
                  <div className="d-flex justify-content-start mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddScenario}
                      className="mt-2 align-items-left"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Scenario
                    </Button>
                  </div>
                  <Form.Label className="d-block text-start w-100 custom-form-label mt-3">
                    Milestones
                  </Form.Label>
                  <div className="d-block">
                    {form.milestones.map((milestone, milestoneIndex) => (
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
                              handleMilestoneNameChange(
                                milestoneIndex,
                                e.target.value,
                              );
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
                            onChange={(e) =>
                              handleMilestoneDescriptionChange(
                                milestoneIndex,
                                e.target.value,
                              )
                            }
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
                              value={
                                formatDateForInput(
                                  form.milestones[milestoneIndex]
                                    ?.milestone_date,
                                ) || ""
                              }
                              onChange={(e) =>
                                handleMilestoneDateChange(
                                  milestoneIndex,
                                  e.target.value,
                                )
                              }
                            />
                          </Form.Group>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-start mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddMilestone}
                      className="mt-2 align-items-left"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Scenario
                    </Button>
                  </div>
                  <Form.Label className="d-block text-start w-100 custom-form-label mt-3">
                    Sensitivities
                  </Form.Label>
                  <div className="d-block">
                    {form.sensitivities.map((sensitivity, sensitivityIndex) => (
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
                              setForm((prevForm) => {
                                const newSensitivities = [
                                  ...(prevForm.sensitivities || []),
                                ];
                                newSensitivities[sensitivityIndex].name =
                                  e.target.value;
                                return {
                                  ...prevForm,
                                  sensitivities: newSensitivities,
                                };
                              });
                            }}
                          />{" "}
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
                              setForm((prevForm) => {
                                const newSensitivities = [
                                  ...(prevForm.sensitivities || []),
                                ];
                                newSensitivities[sensitivityIndex].description =
                                  [e.target.value];
                                return {
                                  ...prevForm,
                                  sensitivities: newSensitivities,
                                };
                              });
                            }}
                          />{" "}
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
                                  setForm((prevForm) => {
                                    const newSensitivities = [
                                      ...(prevForm.sensitivities || []),
                                    ];
                                    newSensitivities[sensitivityIndex].list[
                                      listIndex
                                    ] = e.target.value;
                                    return {
                                      ...prevForm,
                                      sensitivities: newSensitivities,
                                    };
                                  });
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
                              Item
                            </Button>
                          </div>
                        </div>{" "}
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-start mt-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddSensitivity}
                      className="mt-2 align-items-left"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Sensitivity
                    </Button>
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

export default UpdateProject;
