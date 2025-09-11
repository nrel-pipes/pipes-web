import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetModelQuery } from "../../hooks/useModelQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import "../PageStyles.css";
import ModelContentHeaderButton from "./Components/ModelContentHeaderButton";
import "./GetModelPage.css";

const GetModelPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthStore();
  const { modelName } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get('P');
  const projectRunName = searchParams.get('p');

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const { data: model, isLoading, error } = useGetModelQuery(projectName, projectRunName, modelName);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthChecking(true);
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  const handleBackToList = () => {
    navigate(`/models?P=${projectName}&p=${projectRunName}`);
  };

  // Loading/auth/error states
  if (isAuthChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: projectName, mList: true }} />
        <Container className="mainContent" fluid>
          <Row className="w-100 mx-0">
            <ContentHeader title="Model Details" />
          </Row>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="xl" />
          </div>
        </Container>
      </>
    );
  }
  if (error || !model) {
    return (
      <>
        <NavbarSub navData={{ pList: true, pName: projectName, mList: true }} />
        <Container className="mainContent" fluid>
          <Row className="w-100 mx-0">
            <ContentHeader title="Model Details" />
          </Row>
          <div className="alert alert-danger mt-4">
            <h4>Model Not Found</h4>
            <p>The model you are trying to view could not be found.</p>
            <Button variant="primary" onClick={handleBackToList}>
              Go to Models List
            </Button>
          </div>
        </Container>
      </>
    );
  }

  // --- Data preparation ---
  const requirements = model.requirements || {};
  const tags = model.tags || [];
  const assumptions = model.assumptions || [];
  const scenarioMappings = model.scenario_mappings || [];
  const expectedScenarios = model.expected_scenarios || [];
  const modelingTeam = model.modeling_team || "";
  const description = Array.isArray(model.description)
    ? model.description.join("\n")
    : (model.description || "");

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, mName: modelName }} />
      <Container className="mainContent model-page-container" fluid>
        <Row className="w-100 mx-0">
          <ContentHeader
            title={model.display_name || model.name}
            headerButton={<ModelContentHeaderButton isDisabled={projectName === 'pipes101'} />}
          />
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            {/* Basic Information Section */}
            <div className="model-section">
              <div className="model-section-header">
                <h4 className="model-section-title">Basic Information</h4>
              </div>
              <div className="model-section-content">
                <div className="model-field-row">
                  <div className="model-field-label">Model Name</div>
                  <div className="model-field-value">{model.name || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Display Name</div>
                  <div className="model-field-value">{model.display_name || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Type</div>
                  <div className="model-field-value">
                    <Badge bg="success" className="model-type-badge">
                      {model.type || "Model"}
                    </Badge>
                  </div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Project</div>
                  <div className="model-field-value">{model.context?.project || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Project Run</div>
                  <div className="model-field-value">{model.context?.projectrun || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Scheduled Start</div>
                  <div className="model-field-value">{formatDate(model.scheduled_start)}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Scheduled End</div>
                  <div className="model-field-value">{formatDate(model.scheduled_end)}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Description</div>
                  <div className="model-field-value model-field-value-pre">
                    {description || <span className="model-field-value-empty">No description provided</span>}
                  </div>
                </div>
                {tags.length > 0 && (
                  <div className="model-field-row">
                    <div className="model-field-label">Tags</div>
                    <div className="model-field-value">
                      {tags.map((tag, idx) => (
                        <Badge key={idx} bg="secondary" className="model-tag-badge">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scenarios Section */}
            {(expectedScenarios.length > 0 || scenarioMappings.length > 0) && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Scenarios</h4>
                </div>
                <div className="model-section-content">
                  {expectedScenarios.length > 0 && (
                    <div style={{ marginBottom: scenarioMappings.length > 0 ? '32px' : '0' }}>
                      <h6 className="model-subsection-title">Expected Scenarios</h6>
                      <ul className="model-list">
                        {expectedScenarios.map((scenario, idx) => (
                          <li key={idx} className="model-list-item">
                            {scenario}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scenarioMappings.length > 0 && (
                    <div>
                      <h6 className="model-subsection-title">Scenario Mappings</h6>
                      <div className="model-table-container">
                        <table className="model-table">
                          <thead>
                            <tr>
                              <th className="model-table-header">Model Scenario</th>
                              <th className="model-table-header">Project Scenarios</th>
                              <th className="model-table-header">Description</th>
                              <th className="model-table-header">Other</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scenarioMappings.map((mapping, idx) => (
                              <tr key={idx}>
                                <td className="model-table-cell model-table-cell-bold">
                                  {mapping.model_scenario}
                                </td>
                                <td className="model-table-cell">
                                  {Array.isArray(mapping.project_scenarios)
                                    ? mapping.project_scenarios.join(", ")
                                    : String(mapping.project_scenarios || "")}
                                </td>
                                <td className="model-table-cell">
                                  {Array.isArray(mapping.description)
                                    ? mapping.description.join(" ")
                                    : String(mapping.description || "")}
                                </td>
                                <td className="model-table-cell">
                                  {mapping.other && Object.keys(mapping.other).length > 0 ? (
                                    <pre className="model-code-block">
                                      {JSON.stringify(mapping.other, null, 2)}
                                    </pre>
                                  ) : (
                                    <span className="model-table-cell-empty">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assumptions Section */}
            {assumptions.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Assumptions</h4>
                </div>
                <div className="model-section-content">
                  <ul className="model-list">
                    {assumptions.map((assumption, idx) => (
                      <li key={idx} className="model-list-item-spaced">
                        {assumption}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Requirements Section */}
            {Object.keys(requirements).length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Requirements</h4>
                </div>
                <div className="model-section-content">
                  <div className="model-table-container">
                    <table className="model-table">
                      <thead>
                        <tr>
                          <th className="model-table-header model-requirements-name-column">Name</th>
                          <th className="model-table-header">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(requirements).map(([key, value]) => (
                          <tr key={key}>
                            <td className="model-table-cell model-table-cell-bold">{key}</td>
                            <td className="model-table-cell">
                              {typeof value === "object" && value !== null ? (
                                <pre className="model-code-block-large">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              ) : (
                                <span>{String(value)}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Modeling Team Section */}
            {modelingTeam && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Modeling Team</h4>
                </div>
                <div className="model-section-content">
                  {typeof modelingTeam === "object" && modelingTeam.name ? (
                    <div>
                      <div className="model-field-row">
                        <div className="model-field-label">Team Name</div>
                        <div className="model-field-value model-team-name-value">{modelingTeam.name}</div>
                      </div>
                      {modelingTeam.description && (
                        <div className="model-field-row">
                          <div className="model-field-label">Description</div>
                          <div className="model-field-value">{modelingTeam.description}</div>
                        </div>
                      )}
                      {Array.isArray(modelingTeam.members) && modelingTeam.members.length > 0 && (
                        <div className="model-subsection-divider">
                          <h6 className="model-subsection-title">Team Members</h6>
                          <div className="model-table-container">
                            <table className="model-table">
                              <thead>
                                <tr>
                                  <th className="model-table-header">Name</th>
                                  <th className="model-table-header">Email</th>
                                  <th className="model-table-header">Organization</th>
                                </tr>
                              </thead>
                              <tbody>
                                {modelingTeam.members.map((member, idx) => (
                                  <tr key={idx}>
                                    <td className="model-table-cell model-table-cell-bold">
                                      {member.first_name} {member.last_name}
                                    </td>
                                    <td className="model-table-cell">
                                      <a
                                        href={`mailto:${member.email}`}
                                        className="model-table-cell-link"
                                      >
                                        {member.email}
                                      </a>
                                    </td>
                                    <td className="model-table-cell">{member.organization}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="model-field-value">{modelingTeam}</div>
                  )}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GetModelPage;
