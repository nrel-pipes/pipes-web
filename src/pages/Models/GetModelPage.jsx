import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useGetModelQuery } from "../../hooks/useModelQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import ContentHeader from "../Components/ContentHeader";

import "../PageStyles.css";
import ModelDropdownButton from "./Components/ModelDropdownButton";

const GetModelPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthStore();
  const { effectivePname } = useDataStore();
  const [searchParams] = useSearchParams();

  const modelName = searchParams.get('model');
  const projectName = searchParams.get('project') || effectivePname;
  const projectRunName = searchParams.get('projectrun');

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
    navigate('/models');
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

  // --- Sectioned, professional layout ---
  const requirements = model.requirements || {};
  const tags = model.tags || [];
  const assumptions = model.assumptions || [];
  const scenarioMappings = model.scenario_mappings || [];
  const expectedScenarios = model.expected_scenarios || [];
  const modelingTeam = model.modeling_team || "";
  const description = Array.isArray(model.description)
    ? model.description.join("\n")
    : (model.description || "");
  const other = model.other || {};

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: projectName, prName: projectRunName, mName: modelName }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader
            title={model.display_name || model.name}
            headerButton={<ModelDropdownButton isDisabled={effectivePname === 'pipes101'} />}
          />
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            {/* Basic Information */}
            <section style={{ marginBottom: "2.5rem" }}>
              <h4 className="mb-3" style={{ fontWeight: 700, textAlign: "left" }}>Basic Information</h4>
              <table style={{ width: "100%", marginBottom: 0, borderCollapse: "separate", borderSpacing: 0 }}>
                <tbody>
                  <tr>
                    <td className="text-muted" style={{ width: 220, textAlign: "left", fontWeight: 500, padding: "8px 12px" }}>Model Name</td>
                    <td style={{ textAlign: "left", fontWeight: 600, padding: "8px 12px" }}>{model.name || "—"}</td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px" }}>Display Name</td>
                    <td style={{ textAlign: "left", fontWeight: 600, padding: "8px 12px" }}>{model.display_name || "—"}</td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px" }}>Type</td>
                    <td style={{ textAlign: "left", padding: "8px 12px" }}>
                      <Badge bg="success" style={{ fontSize: "1em", fontWeight: 500 }}>
                        {model.type || "Model"}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px" }}>Project</td>
                    <td style={{ textAlign: "left", fontWeight: 600, padding: "8px 12px" }}>{model.context?.project || "—"}</td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px" }}>Project Run</td>
                    <td style={{ textAlign: "left", fontWeight: 600, padding: "8px 12px" }}>{model.context?.projectrun || "—"}</td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px" }}>Scheduled Start</td>
                    <td style={{ textAlign: "left", fontWeight: 600, padding: "8px 12px" }}>{formatDate(model.scheduled_start)}</td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px" }}>Scheduled End</td>
                    <td style={{ textAlign: "left", fontWeight: 600, padding: "8px 12px" }}>{formatDate(model.scheduled_end)}</td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px", verticalAlign: "top" }}>Description</td>
                    <td style={{ textAlign: "left", whiteSpace: "pre-line", padding: "8px 12px" }}>
                      {description || <span className="text-muted">No description.</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted" style={{ textAlign: "left", fontWeight: 500, padding: "8px 12px", verticalAlign: "top" }}>Tags</td>
                    <td style={{ textAlign: "left", padding: "8px 12px" }}>
                      {tags.length > 0 ? (
                        tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            bg="primary"
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 500,
                              marginRight: 8,
                              marginBottom: 4,
                              padding: "0.45em 0.9em",
                              borderRadius: 16,
                            }}
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">No tags.</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Scenarios Section */}
            <section style={{ marginBottom: "2.5rem" }}>
              <h4 className="mb-3" style={{ fontWeight: 700, textAlign: "left" }}>Scenarios</h4>
              <div className="mb-2">
                <strong className="text-muted">Expected Scenarios:</strong>
                {expectedScenarios.length > 0 ? (
                  <ul className="mb-2" style={{ paddingLeft: 24 }}>
                    {expectedScenarios.map((sc, idx) => (
                      <li key={idx} style={{ textAlign: "left" }}>{sc}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted ms-2">None</span>
                )}
              </div>
              <div>
                <strong className="text-muted">Scenario Mappings:</strong>
                {scenarioMappings.length > 0 ? (
                  <table className="table table-bordered mt-2" style={{ background: "#fff", width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Model Scenario</th>
                        <th style={{ textAlign: "left" }}>Project Scenarios</th>
                        <th style={{ textAlign: "left" }}>Description</th>
                        <th style={{ textAlign: "left" }}>Other</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioMappings.map((mapping, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: "left" }}>{mapping.model_scenario}</td>
                          <td style={{ textAlign: "left" }}>
                            {Array.isArray(mapping.project_scenarios)
                              ? mapping.project_scenarios.join(", ")
                              : String(mapping.project_scenarios || "")}
                          </td>
                          <td style={{ textAlign: "left" }}>
                            {Array.isArray(mapping.description)
                              ? mapping.description.join(" ")
                              : String(mapping.description || "")}
                          </td>
                          <td style={{ textAlign: "left" }}>
                            {mapping.other && Object.keys(mapping.other).length > 0
                              ? <pre style={{
                                  margin: 0,
                                  background: "#f8f9fa",
                                  borderRadius: 6,
                                  padding: "0.5em 1em",
                                  fontSize: "0.97em",
                                  fontFamily: "Menlo, Monaco, Consolas, monospace",
                                  color: "#444"
                                }}>{JSON.stringify(mapping.other, null, 2)}</pre>
                              : <span className="text-muted">—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <span className="text-muted ms-2">No scenario mappings.</span>
                )}
              </div>
            </section>

            {/* Assumptions Section */}
            <section style={{ marginBottom: "2.5rem" }}>
              <h4 className="mb-3" style={{ fontWeight: 700, textAlign: "left" }}>Assumptions</h4>
              {assumptions.length > 0 ? (
                <ul style={{ paddingLeft: 24 }}>
                  {assumptions.map((a, idx) => (
                    <li key={idx} style={{ textAlign: "left" }}>{a}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted">No assumptions defined for this model.</span>
              )}
            </section>

            {/* Requirements Section */}
            <section style={{ marginBottom: "2.5rem" }}>
              <h4 className="mb-3" style={{ fontWeight: 700, textAlign: "left" }}>Requirements</h4>
              {Object.keys(requirements).length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered" style={{ background: "#fff", width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Name</th>
                        <th style={{ textAlign: "left" }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(requirements).map(([key, value]) => (
                        <tr key={key}>
                          <td style={{ fontWeight: 500, textAlign: "left" }}>{key}</td>
                          <td style={{ textAlign: "left" }}>
                            {typeof value === "object" && value !== null ? (
                              <pre style={{
                                margin: 0,
                                background: "#f4f6fa",
                                borderRadius: 6,
                                padding: "0.7em 1em",
                                fontSize: "0.97em",
                                fontFamily: "Menlo, Monaco, Consolas, monospace",
                                color: "#444"
                              }}>
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
              ) : (
                <span className="text-muted">No requirements defined for this model.</span>
              )}
            </section>

            {/* Modeling Team Section */}
            <section style={{ marginBottom: "2.5rem" }}>
              <h4 className="mb-3" style={{ fontWeight: 700, textAlign: "left" }}>Modeling Team</h4>
              {modelingTeam && typeof modelingTeam === "object" && modelingTeam.name ? (
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: "1.1em" }}>Name: {modelingTeam.name}</div>
                  {modelingTeam.description && (
                    <div className="text-muted mb-2" style={{ fontSize: "0.97em" }}>
                      {modelingTeam.description}
                    </div>
                  )}
                  {Array.isArray(modelingTeam.members) && modelingTeam.members.length > 0 && (
                    <div className="mt-2">
                      <div style={{ fontWeight: 500, marginBottom: 6 }}>Members:</div>
                      <table className="table table-sm table-bordered" style={{ background: "#fff", width: "100%" }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left" }}>Name</th>
                            <th style={{ textAlign: "left" }}>Email</th>
                            <th style={{ textAlign: "left" }}>Organization</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modelingTeam.members.map((member, idx) => (
                            <tr key={idx}>
                              <td style={{ textAlign: "left" }}>
                                {member.first_name} {member.last_name}
                              </td>
                              <td style={{ textAlign: "left" }}>{member.email}</td>
                              <td style={{ textAlign: "left" }}>{member.organization}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : modelingTeam ? (
                <span style={{ textAlign: "left" }}>{modelingTeam}</span>
              ) : (
                <span className="text-muted">No modeling team specified.</span>
              )}
            </section>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GetModelPage;
