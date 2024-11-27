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
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, getProject, currentProject } = useDataStore();
  const [isExpanded, setIsExpanded] = useState(false);

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
    scheduledStart: "",
    scheduledEnd: "",
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

  const handleDateChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Project information

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                    Project Name
                  </Form.Label>
                  <Form.Control
                    type="input"
                    id="projectRunName"
                    name="projectRunName"
                    placeholder="Project Name"
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
                          {
                            new Date(currentProject.scheduled_start)
                              .toISOString()
                              .split("T")[0]
                          }
                        </Form.Text>

                        <Form.Control
                          id="scheduledStart"
                          name="scheduledStart"
                          type="date"
                          value={formData.scheduledStart || ""}
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
                        <Form.Text className="text-muted">
                          Date must be before{" "}
                          {
                            new Date(currentProject.scheduled_end)
                              .toISOString()
                              .split("T")[0]
                          }
                        </Form.Text>
                        <Form.Control
                          id="scheduledEnd"
                          name="scheduledEnd"
                          type="date"
                          value={formData.scheduledEnd || ""}
                          onChange={(e) =>
                            handleDateChange("scheduledEnd", e.target.value)
                          }
                        />
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
                          handleAddList("assumptions", e.target.value, index)
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
                  ))}
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
                    {/* Scenarios */}
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
                            handleAddList("scenarios", e.target.value, index)
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
                    {/* Add Scenario Button */}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => handleAddList("scenarios", "", e)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Scenario
                    </Button>{" "}
                  </div>
                </Form.Group>
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
