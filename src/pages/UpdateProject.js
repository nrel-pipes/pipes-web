import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
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

const UpdateProject = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, getProject, currentProject } = useDataStore();

  // Initial blank form state
  const [form, setForm] = useState(currentProject);
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
    console.log(form.description);
  };

  const handleDateChange = (field, value) => {
    setForm({
      ...Form,
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
    setSensitivities([
      ...sensitivities,
      {
        name: "",
        description: [""],
        list: [""],
      },
    ]);
  };

  // Setting Milestones
  const [milestones, setMilestones] = useState([
    {
      name: "Milestone 1",
      description: ["First major project milestone"],
      milestone_date: "2023-02-01",
    },
  ]);
  // Setting project Schedule
  const [schedule, setSchedule] = useState({
    scheduledStart: "2023-01-01",
    scheduledEnd: "2023-12-31",
  });

  //   const handleDateChange = (field, value) => {
  //     setSchedule({
  //       ...schedule,
  //       [field]: value,
  //     });
  //   };

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

      //   let form = {
      //     name: projectName,
      //     title: projectTitle,
      //     description: projectDescription,
      //     assumptions: assumptions,
      //     requirements: requirementsDict,
      //     scenarios: scenariosList,
      //     sensitivities: sensitivitiesList.map((sensitivity) => ({
      //       ...sensitivity,
      //       description: Array.isArray(sensitivity.description)
      //         ? [sensitivity.description[0]] // Keep as array with single string
      //         : [sensitivity.description], // Convert string to array with single element
      //     })),
      //     milestones: milestonesList.map((milestone) => ({
      //       ...milestone,
      //       description: Array.isArray(milestone.description)
      //         ? milestone.description[0]
      //         : milestone.description,
      //     })),
      //     scheduled_start: schedule.scheduledStart,
      //     scheduled_end: schedule.scheduledEnd,
      //     owner: {
      //       email: ownerEmail,
      //       first_name: ownerFirstName,
      //       last_name: ownerLastName,
      //       organization: ownerOrganization,
      //     },
      //   };
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
                          value={formatDateForInput(form.scheduled_end) || ""}
                          onChange={(e) =>
                            handleDateChange("scheduledEnd", e.target.value)
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
