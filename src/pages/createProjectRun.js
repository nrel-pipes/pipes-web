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

const CreateProjectRun = (projectData) => {
  // Notice, project data will be set the bounds for scheduledStart and end in validation
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { getProjectBasics, getProject } = useDataStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
    getProjectBasics(accessToken);
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  // State Variables
  const [formData, setFormData] = useState({
    name: "example prun name",
    description: "This is an example description",
    assumptions: [],
    requirements: {},
    scenarios: [],
    scheduled_start: "",
    scheduled_end: "",
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
      [key]: [...value, ""],
    }));
  };

  const handleRemoveList = (key, value, e) => {
    e.preventDefault();
    const updatedList = value.slice(0, -1); // Removes the last item (adjust logic as needed)
    setFormData((prevState) => ({
      ...prevState,
      [key]: updatedList,
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
