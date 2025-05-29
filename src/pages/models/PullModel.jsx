import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import useAuthStore from "../../stores/AuthStore";
import NavbarSub from "../../layouts/NavbarSub";
import { useGetProjectsQuery } from "../../hooks/useProjectQuery";
import { useGetProjectRunsQuery } from "../../hooks/useProjectRunQuery";
import "../Components/Cards.css";
import "../PageStyles.css";
import "./ModelCatalog.css";
import "../FormStyles.css";

// Utility function to format date for input fields
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  return isoString.split("T")[0];
};

// API function to pull/create model
const pullModel = async (modelData, token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/models`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(modelData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to pull model");
  }

  return response.json();
};

const PullModel = () => {
  const navigate = useNavigate();
  const { checkAuthStatus, getIdToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectRun, setSelectedProjectRun] = useState("");

  // Default form state
  const [form, setForm] = useState({
    name: "",
    display_name: "",
    type: "",
    description: [""],
    modeling_team: "",
    assumptions: [],
    requirements: {},
    scheduled_start: "",
    scheduled_end: "",
    expected_scenarios: [],
    scenario_mappings: [],
    other: {},
    project: "", // Additional field for project
    projectrun: "", // Additional field for projectrun
  });

  // Fetch projects for dropdown
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();

  // Fetch project runs based on selected project
  const { data: projectRuns = [], isLoading: runsLoading } = useGetProjectRunsQuery(
    selectedProject,
    !!selectedProject
  );

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        // Get the ID token and extract email
        const idToken = await getIdToken();
        if (idToken) {
          const decodedIdToken = jwtDecode(idToken);
          const email = decodedIdToken.email.toLowerCase();
          setUserEmail(email);
        } else {
          console.error("ID token not available");
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, getIdToken, checkAuthStatus]);

  // Check for stored model data in localStorage
  useEffect(() => {
    const storedModelData = localStorage.getItem('pullModelDefaults');

    if (storedModelData) {
      try {
        const modelData = JSON.parse(storedModelData);
        setForm(modelData);

        // Set the selected project and run if available
        if (modelData.project) {
          setSelectedProject(modelData.project);
        }
        if (modelData.projectrun) {
          setSelectedProjectRun(modelData.projectrun);
        }

        // Clear the stored data to prevent it from persisting between sessions
        localStorage.removeItem('pullModelDefaults');
      } catch (error) {
        console.error("Error parsing stored model data:", error);
      }
    }
  }, []);

  // Form mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      const token = await getIdToken();
      return pullModel(data, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["modelCatalog"]);
      navigate("/models/catalog");
    },
    onError: (error) => {
      setFormError(error.message || "Failed to pull model. Please try again.");
    },
  });

  // Form handlers
  const handleChange = (path, value) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      const keys = path.split(".");
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleArrayChange = (path, index, value) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      const keys = path.split(".");
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      const newArray = [...current[lastKey]];
      newArray[index] = value;
      current[lastKey] = newArray;
      return newState;
    });
  };

  const handleAddArrayItem = (path) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      const keys = path.split(".");
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = [...current[lastKey], ""];
      return newState;
    });
  };

  const handleRemoveArrayItem = (path, index) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      const keys = path.split(".");
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];
      const newArray = [...current[lastKey]];
      newArray.splice(index, 1);
      current[lastKey] = newArray;
      return newState;
    });
  };

  // Handle project selection
  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    setSelectedProjectRun("");
    handleChange("project", projectId);
  };

  // Handle project run selection
  const handleProjectRunChange = (e) => {
    const runId = e.target.value;
    setSelectedProjectRun(runId);
    handleChange("projectrun", runId);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!form.name) {
      setFormError("Model name is required");
      return;
    }

    if (!form.display_name) {
      setFormError("Display name is required");
      return;
    }

    if (!form.description[0]) {
      setFormError("Description is required");
      return;
    }

    // Submit the form
    mutation.mutate(form);
  };

  // Handle adding a requirement key-value pair
  const handleAddRequirement = () => {
    const key = prompt("Enter requirement key:");
    if (key && key.trim()) {
      const value = prompt("Enter requirement value:");
      if (value && value.trim()) {
        setForm((prevState) => ({
          ...prevState,
          requirements: {
            ...prevState.requirements,
            [key.trim()]: value.trim()
          }
        }));
      }
    }
  };

  // Handle removing a requirement
  const handleRemoveRequirement = (key) => {
    setForm((prevState) => {
      const newRequirements = { ...prevState.requirements };
      delete newRequirements[key];
      return {
        ...prevState,
        requirements: newRequirements
      };
    });
  };

  // Handle adding "other" key-value pair
  const handleAddOther = () => {
    const key = prompt("Enter information key:");
    if (key && key.trim()) {
      const value = prompt("Enter information value:");
      if (value && value.trim()) {
        setForm((prevState) => ({
          ...prevState,
          other: {
            ...prevState.other,
            [key.trim()]: value.trim()
          }
        }));
      }
    }
  };

  // Handle removing an "other" item
  const handleRemoveOther = (key) => {
    setForm((prevState) => {
      const newOther = { ...prevState.other };
      delete newOther[key];
      return {
        ...prevState,
        other: newOther
      };
    });
  };

  return (
    <>
      <NavbarSub navData={{ pAll: true }} />
      <Container className="mainContent py-4">
        <Row className="mb-4">
          <Col>
            <h2>Pull Model</h2>
            <p className="text-muted">Create or pull a model into the catalog</p>
          </Col>
        </Row>

        {formError && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">{formError}</Alert>
            </Col>
          </Row>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="requiredField">Model Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter unique model name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  Unique identifier for the model
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="requiredField">Display Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter display name"
                  value={form.display_name}
                  onChange={(e) => handleChange("display_name", e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  Human-friendly name for the model
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Model type"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Modeling Team</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Team name"
                  value={form.modeling_team}
                  onChange={(e) => handleChange("modeling_team", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Project</Form.Label>
                <Form.Select
                  value={selectedProject}
                  onChange={handleProjectChange}
                  disabled={projectsLoading}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id || project.name} value={project.id || project.name}>
                      {project.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Project Run</Form.Label>
                <Form.Select
                  value={selectedProjectRun}
                  onChange={handleProjectRunChange}
                  disabled={runsLoading || !selectedProject}
                >
                  <option value="">Select a project run</option>
                  {projectRuns.map((run) => (
                    <option key={run.id} value={run.id}>
                      {run.name || run.id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Scheduled Start</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDateForInput(form.scheduled_start)}
                  onChange={(e) => handleChange("scheduled_start", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Scheduled End</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDateForInput(form.scheduled_end)}
                  onChange={(e) => handleChange("scheduled_end", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="requiredField">Description</Form.Label>
                {form.description.map((desc, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center gap-2">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter description"
                      value={desc}
                      onChange={(e) => handleArrayChange("description", index, e.target.value)}
                      required={index === 0}
                    />
                    {form.description.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveArrayItem("description", index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleAddArrayItem("description")}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Description
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Assumptions</Form.Label>
                {form.assumptions.map((assumption, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Enter assumption"
                      value={assumption}
                      onChange={(e) => handleArrayChange("assumptions", index, e.target.value)}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveArrayItem("assumptions", index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleAddArrayItem("assumptions")}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Assumption
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Expected Scenarios</Form.Label>
                {form.expected_scenarios.map((scenario, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Enter expected scenario"
                      value={scenario}
                      onChange={(e) => handleArrayChange("expected_scenarios", index, e.target.value)}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveArrayItem("expected_scenarios", index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleAddArrayItem("expected_scenarios")}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Expected Scenario
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Scenario Mappings</Form.Label>
                {form.scenario_mappings.map((mapping, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Enter scenario mapping"
                      value={mapping}
                      onChange={(e) => handleArrayChange("scenario_mappings", index, e.target.value)}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveArrayItem("scenario_mappings", index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleAddArrayItem("scenario_mappings")}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Scenario Mapping
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Requirements</Form.Label>
                {Object.entries(form.requirements).length === 0 ? (
                  <p className="text-muted">No requirements added yet</p>
                ) : (
                  <Table striped bordered hover size="sm" className="mb-2">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(form.requirements).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveRequirement(key)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddRequirement}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Requirement
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Additional Information</Form.Label>
                {Object.entries(form.other).length === 0 ? (
                  <p className="text-muted">No additional information added yet</p>
                ) : (
                  <Table striped bordered hover size="sm" className="mb-2">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(form.other).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveOther(key)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddOther}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Additional Information
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/models/catalog")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Pulling Model...
                  </>
                ) : (
                  "Pull Model"
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default PullModel;