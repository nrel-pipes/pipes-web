import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

import PageTitle from "../components/pageTitle";
import SideColumn from "../components/form/SideColumn";
import useDataStore from "./stores/DataStore";
import useAuthStore from "./stores/AuthStore";
import FormError from "../components/form/FormError";
import "./FormStyles.css";
import { useState, useEffect } from "react";
import { postProject, getProject } from "./api/ProjectAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "./PageStyles.css";
import "../components/Cards.css";


const CreateProject2 = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, currentProject } = useDataStore();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: postProject,
    onSuccess: async (data, variables) => {
      setFormError(false);
      try {
        // Fetch the newly created project
        await queryClient.fetchQuery({
          queryKey: ["project", variables.data.name],
          queryFn: () =>
            getProject({
              name: variables.data.name,
              token: variables.token,
            }),
        });
        setSubmittingForm(false);
        navigate("/overview");
      } catch (error) {
        console.error("Error fetching project after creation:", error);
        setFormError(true);
        setFormErrorMessage("Project created but failed to fetch details");
        setSubmittingForm(false);
      }
    },
    onError: (error) => {
      setFormError(true);
      setFormErrorMessage(
        `Failed to create project: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`,
      );
      setSubmittingForm(false);
    },
  });
  const initializeForm = () => {
    return {
      name: "",
      title: "",
      description: "",
      assumptions: [],
      leads: [],
      milestones: [],
      owner: {
        email: "",
        first_name: "",
        last_name: "",
        organization: "",
      },
      requirements: {
        keys: [],
        values: [],
      },
      scenarios: [],
      scheduled_end: "",
      scheduled_start: "",
      sensitivities: [],
      teams: [],
    };
  };
  const denormalizeFormData = (normalizedForm) => {
    const requirements = {};
    normalizedForm.requirements.keys.forEach((key, index) => {
      const values = normalizedForm.requirements.values[index];
      requirements[key] = values.length === 1 ? values[0] : values;
    });
    const scenarios = normalizedForm.scenarios.map((scenario) => {
      const description =
        Array.isArray(scenario.description) && scenario.description.length === 1
          ? scenario.description[0]
          : scenario.description;
      const other = Array.isArray(scenario.other)
        ? scenario.other.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {})
        : scenario.other;

      return {
        ...scenario,
        description,
        other,
      };
    });

    return {
      ...normalizedForm,
      requirements,
      scenarios,
    };
  };

  const [form, setForm] = useState(() => initializeForm(currentProject));
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

  const handleRemoveScenario = (index, e) => {
    e.preventDefault();
    setForm((prevForm) => ({
      ...prevForm,
      scenarios: prevForm.scenarios.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddOtherInfo = (scenarioIndex, e) => {
    e.preventDefault();
    setForm((prevState) => {
      const updatedScenarios = [...prevState.scenarios];
      updatedScenarios[scenarioIndex] = {
        ...updatedScenarios[scenarioIndex],
        other: [...(updatedScenarios[scenarioIndex].other || []), ["", ""]],
      };

      return {
        ...prevState,
        scenarios: updatedScenarios,
      };
    });
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
          milestone_date: "",
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
    e.preventDefault();

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

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  const handleAddScenario = (e) => {
    e.preventDefault();
    console.log(form.scenarios);
    setForm((prevState) => ({
      ...prevState,
      scenarios: [
        ...(prevState.scenarios || []),
        {
          name: "",
          description: [""],
          other: [],
        },
      ],
    }));
  };

  // Add the new handler functions here
  const handleScenarioNameChange = (scenarioIndex, value) => {
    setForm((prevState) => {
      const updatedScenarios = [...prevState.scenarios];
      updatedScenarios[scenarioIndex] = {
        ...updatedScenarios[scenarioIndex],
        name: value,
      };

      return {
        ...prevState,
        scenarios: updatedScenarios,
      };
    });
  };
  const handleScenarioDescriptionChange = (scenarioIndex, value) => {
    setForm((prevState) => {
      const updatedScenarios = [...prevState.scenarios];
      updatedScenarios[scenarioIndex] = {
        ...updatedScenarios[scenarioIndex],
        description: [value], // Keep it as an array with single value since that's your data structure
      };

      return {
        ...prevState,
        scenarios: updatedScenarios,
      };
    });
  };
  const handleOtherInfoChange = (
    scenarioIndex,
    otherIndex,
    keyOrValue,
    value,
  ) => {
    setForm((prevState) => {
      const updatedScenarios = [...prevState.scenarios];
      const currentOther = [...updatedScenarios[scenarioIndex].other];
      const currentPair = currentOther[otherIndex] || ["", ""];
      currentOther[otherIndex] =
        keyOrValue === "key"
          ? [value, currentPair[1]]
          : [currentPair[0], value];

      updatedScenarios[scenarioIndex] = {
        ...updatedScenarios[scenarioIndex],
        other: currentOther,
      };

      return {
        ...prevState,
        scenarios: updatedScenarios,
      };
    });
  };

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
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [submittingForm, setSubmittingForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(false);
    setSubmittingForm(true);

    const retriesLimit = 3;

    // Denormalize the form data to match the backend model
    const denormalizedForm = denormalizeFormData(form);

    // Required field validation - adapted for denormalized form
    // Validating Project Name
    const projectNameElement = document.getElementById("projectName");
    if (!denormalizedForm.name || denormalizedForm.name.trim().length === 0) {
      projectNameElement.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage("You forgot to provide a name for your project.");
      setSubmittingForm(false);
      return;
    }
    projectNameElement.classList.remove("form-error");

    // Validating Schedule
    const scheduledStartElement = document.getElementById("scheduledStart");
    const scheduledEndElement = document.getElementById("scheduledEnd");
    let hasScheduleError = false;
    if (
      !denormalizedForm.scheduled_start ||
      denormalizedForm.scheduled_start.trim().length === 0
    ) {
      scheduledStartElement.classList.add("form-error");
      hasScheduleError = true;
    }
    if (
      !denormalizedForm.scheduled_end ||
      denormalizedForm.scheduled_end.trim().length === 0
    ) {
      scheduledEndElement.classList.add("form-error");
      hasScheduleError = true;
    }
    if (
      denormalizedForm.scheduled_start &&
      denormalizedForm.scheduled_end &&
      new Date(denormalizedForm.scheduled_end) <
        new Date(denormalizedForm.scheduled_start)
    ) {
      scheduledStartElement.classList.add("form-error");
      scheduledEndElement.classList.add("form-error");
      hasScheduleError = true;
    }
    if (hasScheduleError) {
      setFormError(true);
      setFormErrorMessage(
        "The schedule is invalid. Please ensure both dates are provided and the end date is not before the start date.",
      );
      setSubmittingForm(false);
      return;
    }
    scheduledStartElement.classList.remove("form-error");
    scheduledEndElement.classList.remove("form-error");

    // Validating Owner
    const ownerFirstNameElement = document.getElementById("firstName");
    const ownerLastNameElement = document.getElementById("lastName");
    const ownerEmailElement = document.getElementById("email");
    const ownerOrganizationElement = document.getElementById("organization");

    if (
      !denormalizedForm.owner.first_name ||
      denormalizedForm.owner.first_name.trim().length === 0
    ) {
      ownerFirstNameElement.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage("You forgot to provide your first name.");
      setSubmittingForm(false);
      return;
    }
    ownerFirstNameElement.classList.remove("form-error");

    if (
      !denormalizedForm.owner.last_name ||
      denormalizedForm.owner.last_name.trim().length === 0
    ) {
      ownerLastNameElement.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage("You forgot to provide your last name.");
      setSubmittingForm(false);
      return;
    }
    ownerLastNameElement.classList.remove("form-error");

    if (
      !denormalizedForm.owner.email ||
      denormalizedForm.owner.email.trim().length === 0
    ) {
      ownerEmailElement.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage("You forgot to provide the project owner's email.");
      setSubmittingForm(false);
      return;
    }
    ownerEmailElement.classList.remove("form-error");

    if (
      !denormalizedForm.owner.organization ||
      denormalizedForm.owner.organization.trim().length === 0
    ) {
      ownerOrganizationElement.classList.add("form-error");
      setFormError(true);
      setFormErrorMessage(
        "You forgot to provide the project owner's organization.",
      );
      setSubmittingForm(false);
      return;
    }
    ownerOrganizationElement.classList.remove("form-error");

    // Validating Milestones
    for (let i = 0; i < denormalizedForm.milestones.length; i++) {
      const milestone = denormalizedForm.milestones[i];
      const milestoneNameElement = document.getElementById(
        `milestoneName-${i}`,
      );
      const milestoneDescriptionElement = document.getElementById(
        `milestoneDescription-${i}`,
      );
      const milestoneDateElement = document.getElementById(
        `milestoneDate-${i}`,
      );

      if (!milestone.name || milestone.name.trim().length === 0) {
        milestoneNameElement.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Milestone ${i + 1} is missing a name.`);
        setSubmittingForm(false);
        return;
      }
      milestoneNameElement.classList.remove("form-error");

      if (!milestone.description || milestone.description.trim().length === 0) {
        milestoneDescriptionElement.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Milestone ${i + 1} is missing a description.`);
        setSubmittingForm(false);
        return;
      }
      milestoneDescriptionElement.classList.remove("form-error");

      if (
        !milestone.milestone_date ||
        milestone.milestone_date.trim().length === 0
      ) {
        milestoneDateElement.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Milestone ${i + 1} is missing a date.`);
        setSubmittingForm(false);
        return;
      }
      milestoneDateElement.classList.remove("form-error");
    }

    // Validating Scenarios
    for (let i = 0; i < denormalizedForm.scenarios.length; i++) {
      const scenario = denormalizedForm.scenarios[i];
      const scenarioNameElement = document.getElementById(`scenarioName-${i}`);
      const scenarioDescriptionElement = document.getElementById(
        `scenarioDescription-${i}`,
      );

      if (!scenario.name || scenario.name.trim().length === 0) {
        scenarioNameElement.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Scenario ${i + 1} is missing a name.`);
        setSubmittingForm(false);
        return;
      }
      scenarioNameElement.classList.remove("form-error");

      if (
        !scenario.description ||
        scenario.description.toString().trim().length === 0
      ) {
        scenarioDescriptionElement.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Scenario ${i + 1} is missing a description.`);
        setSubmittingForm(false);
        return;
      }
      scenarioDescriptionElement.classList.remove("form-error");
    }

    // Validating Sensitivities
    for (let i = 0; i < denormalizedForm.sensitivities.length; i++) {
      const sensitivity = denormalizedForm.sensitivities[i];
      const sensitivityNameElement = document.getElementById(
        `sensitivityName-${i}`,
      );
      const sensitivityDescriptionElement = document.getElementById(
        `sensitivityDescription-${i}`,
      );

      if (!sensitivity.name || sensitivity.name.trim().length === 0) {
        sensitivityNameElement.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Sensitivity ${i + 1} is missing a name.`);
        setSubmittingForm(false);
        return;
      }
      sensitivityNameElement.classList.remove("form-error");

      if (
        !sensitivity.description ||
        sensitivity.description.toString().trim().length === 0
      ) {
        sensitivityDescriptionElement.classList.add("form-error");
        setFormError(true);
        setFormErrorMessage(`Sensitivity ${i + 1} is missing a description.`);
        setSubmittingForm(false);
        return;
      }
      sensitivityDescriptionElement.classList.remove("form-error");
    }

    // Prepare the payload for the API
    const payload = {
      ...denormalizedForm,
      title: denormalizedForm.name.toLowerCase().replace(/\s+/g, "_"), // Generate title from name
      scheduled_start: denormalizedForm.scheduled_start,
      scheduled_end: denormalizedForm.scheduled_end,
    };

    console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

    // API call with retries
    for (let attempt = 0; attempt < retriesLimit; attempt++) {
      try {
        await createProjectMutation.mutateAsync({
          data: payload,
          token: accessToken,
        });
        console.log(`Project created successfully on attempt ${attempt + 1}`);
        break; // Exit loop on success
      } catch (error) {
        console.error(
          `Error creating project (attempt ${attempt + 1}/${retriesLimit}):`,
          error,
        );
        if (attempt < retriesLimit - 1) {
          setFormError(true);
          setFormErrorMessage(
            `Error creating project: ${error.message}. Retrying in 1 second...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          setFormError(true);
          setFormErrorMessage(
            `Failed to create project after ${retriesLimit} attempts: ${error.message}`,
          );
          setSubmittingForm(false);
          return; // Exit function after final failure
        }
      }
    }
  };
  // Separate validation logic
  const validateForm = (formData) => {
    // Project Title
    if (!formData.name?.trim()) {
      return {
        field: "projectName",
        message: "You forgot to provide a title for your project.",
      };
    }

    // Schedule validation
    if (!formData.scheduled_start || !formData.scheduled_end) {
      return {
        field: "schedule",
        message: "Both start and end dates are required.",
      };
    }

    if (new Date(formData.scheduled_end) < new Date(formData.scheduled_start)) {
      return {
        field: "schedule",
        message: "The end date cannot be before the start date.",
      };
    }

    // Owner Information
    if (!formData.owner?.first_name?.trim()) {
      return {
        field: "firstName",
        message: "You forgot to provide your first name.",
      };
    }

    if (!formData.owner?.last_name?.trim()) {
      return {
        field: "lastName",
        message: "You forgot to provide your last name.",
      };
    }

    if (!formData.owner?.email?.trim()) {
      return {
        field: "email",
        message: "You forgot to provide the project owner's email.",
      };
    }

    if (!formData.owner?.organization?.trim()) {
      return {
        field: "organization",
        message: "You forgot to provide the project owner's organization.",
      };
    }

    return null;
  };

  // In your component, add these mutation-related effects
  useEffect(() => {
    if (createProjectMutation.isSuccess) {
      setFormError(false);
      setSubmittingForm(false);
    }
  }, [createProjectMutation.isSuccess]);

  useEffect(() => {

    if (createProjectMutation.isError && createProjectMutation.error) {
      setFormError(true);
      setFormErrorMessage(
        `Failed to create project: ${
          createProjectMutation.error instanceof Error
            ? createProjectMutation.error.message
            : "Unknown error occurred"
        }`,
      );
      setSubmittingForm(false);
    }
  }, [createProjectMutation.isError, createProjectMutation.error]);

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
          <PageTitle title={"Create Project"} />
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
                        value={form.assumptions[index]}
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
                    {form.scenarios.map((scenario, scenarioIndex) => (
                      <div
                        key={scenarioIndex}
                        className="border rounded p-3 mb-4"
                      >
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

                        <div className="d-flex mb-3 align-items-center gap-2">
                          <Form.Control
                            id={`scenario${scenarioIndex}`}
                            type="input"
                            placeholder="Scenario name"
                            value={scenario.name}
                            onChange={(e) =>
                              handleScenarioNameChange(
                                scenarioIndex,
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="d-flex mb-3 align-items-center gap-2">
                          <Form.Control
                            id={`scenarioDescription${scenarioIndex}`}
                            as="textarea"
                            rows={3}
                            placeholder="Enter description"
                            value={scenario.description[0]}
                            onChange={(e) =>
                              handleScenarioDescriptionChange(
                                scenarioIndex,
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <h5 className="mb-3" style={{ fontSize: "1.1rem" }}>
                            Other
                          </h5>
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
                                  value={item[0] || ""}
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
                                  value={item[1] || ""}
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
                  </div>{" "}
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

export default CreateProject2;
