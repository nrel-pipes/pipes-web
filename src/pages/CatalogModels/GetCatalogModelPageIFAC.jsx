import { Badge, Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";

import "../PageStyles.css";
import CatalogModelContentHeaderButton from "./Components/CatalogModelContentHeaderButton";
import "./GetCatalogModelPage.css";


function GetCatalogModelPageIFAC({catalogModel,currentUser}) {

  // --- Data preparation ---
  const modelName = catalogModel.name || "Unnamed Model";
  const toolTeams = catalogModel.teams || [];
  const requirements = catalogModel.requirements || {};
  const inputs = catalogModel.inputs || [];
  const outputs = catalogModel.outputs || [];
  const tags = catalogModel.tags || [];
  const use_cases = catalogModel.use_cases || [];
  const assumptions = catalogModel.assumptions || [];
  const features = catalogModel.features || [];
  const publications = catalogModel.publications || [];
  const trainings = catalogModel.trainings || [];
  const programming_languages = catalogModel.programming_languages || [];
  const workflow_integration_list = catalogModel.maturity.workflow_integration_list || [];
  const scenarioMappings = catalogModel.scenario_mappings || [];
  const expectedScenarios = catalogModel.expected_scenarios || [];
  const description = Array.isArray(catalogModel.description)
    ? catalogModel.description.join("\n")
    : (catalogModel.description || "");

  // Check if current user is the model creator
  const isModelCreator = currentUser?.email && catalogModel.created_by?.email &&
                         currentUser.email.toLowerCase() === catalogModel.created_by.email.toLowerCase();

  const isAccessGroupMember = currentUser?.email &&
        catalogModel.access_group?.some(group => group.members?.some(member => member.email.toLowerCase() === currentUser.email.toLowerCase()));

  return (
    <>
      <NavbarSub navData={{ cmList: true, cmName: modelName }} />
      <Container className="mainContent model-page-container" fluid>
        <Row className="w-100 mx-0">
          <ContentHeader
            title={catalogModel.display_name || catalogModel.name}
            headerButton={<CatalogModelContentHeaderButton disableDelete={!isModelCreator} disableUpdate={!(isAccessGroupMember || isModelCreator)} catalogSchema={catalogModel.catalog_schema} />}
          />
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            {/* Basic Information Section */}
            <h8 className="model-section-title">Schema: {catalogModel.catalog_schema} version {catalogModel.schema_version}</h8>
            <div className="model-section">
              <div className="model-section-header">
                <h4 className="model-section-title">Basic Information</h4>
              </div>
              <div className="model-section-content">
                <div className="model-field-row">
                  <div className="model-field-label">Model Name</div>
                  <div className="model-field-value">{catalogModel.name || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Display Name</div>
                  <div className="model-field-value">{catalogModel.display_name || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Type</div>
                  <div className="model-field-value">
                    <Badge bg="success" className="model-type-badge">
                      {catalogModel.type || "Model"}
                    </Badge>
                  </div>
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
                {use_cases.length > 0 && (
                  <div className="model-field-row">
                    <div className="model-field-label">IFAC Use Cases</div>
                    <div className="model-field-value">
                      {use_cases.map((use_case, idx) => (
                        <Badge key={idx} bg="secondary" className="model-tag-badge">
                          {use_case}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="model-field-row">
                  <div className="model-field-label">Model Source</div>
                  <div className="model-field-value">{catalogModel.source || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Version</div>
                  <div className="model-field-value">{catalogModel.version || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Feature Branch</div>
                  <div className="model-field-value">{catalogModel.branch || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Documentation Link</div>
                  <div className="model-field-value">{catalogModel.documentation || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Website Link</div>
                  <div className="model-field-value">{catalogModel.website || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">DOI</div>
                  <div className="model-field-value">{catalogModel.doi || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">License Type</div>
                  <div className="model-field-value">{catalogModel.license_type || "—"}</div>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Software Type</div>
                  <div className="model-field-value">{catalogModel.software_type || "—"}</div>
                </div>
              </div>
            </div>
            {/* Trainings Section */}
            {trainings.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Features</h4>
                </div>
                <div className="model-section-content">
                  <ul className="model-list">
                    {trainings.map((training, idx) => (
                      <li key={idx} className="model-list-item-spaced">
                        {training}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* Publications Section */}
            {publications.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Features</h4>
                </div>
                <div className="model-section-content">
                  <ul className="model-list">
                    {publications.map((publication, idx) => (
                      <li key={idx} className="model-list-item-spaced">
                        {publication}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* Features Section */}
            {features.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Features</h4>
                </div>
                <div className="model-section-content">
                  <ul className="model-list">
                    {features.map((feature, idx) => (
                      <li key={idx} className="model-list-item-spaced">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* Programming Languages Section */}
            {programming_languages.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Programming Languages</h4>
                </div>
                <div className="model-section-content">
                  <ul className="model-list">
                    {programming_languages.map((language, idx) => (
                      <li key={idx} className="model-list-item-spaced">
                        {language}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Maturity Section */}
            <div className="model-section">
              <div className="model-section-header">
                <h4 className="model-section-title">Tool Maturity Parameters</h4>
              </div>

              <div className="model-section-content">
                <div className="model-field-row">
                  <Col>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Software License</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.software_license || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Publication History</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.publication_history || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Documented External Validation</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.external_validation_documented || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Application</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.application || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">External Validation Via Usage</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.external_validation_via_usage || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Input/Output Interoperability</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.input_output_interoperability || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Public Data Accessibility</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.data_accessibility_public || false}/>
                      </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Proprietary Data Accessibility</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.data_accessibility_proprietary || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Secure for Sensitive Data Handling</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.secure_for_sensitive_data_handling || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Secure for Independent Usage</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.secure_independent_usage || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Usable via GUI</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox"
                          disabled checked={catalogModel.maturity.usability_via_GUI || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Usable via CLI</div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.usability_via_CLI || false}/>
                      </div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col>
                      <div className="model-field-col-compact">
                      <div className="model-field-label">Accessible for External Users</div></div>
                      </Col>
                      <Col className="model-field-col-compact">
                      <div className="model-field-col-compact">
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.accessible_for_external_users || false}/>
                      </div></div>
                      </Col>
                    </Row>
                    <Row className="model-field-row-compact">
                      <Col className="model-field-col-compact">
                      <div className="model-field-label">Support Available</div>
                      </Col>
                      <Col>
                      <div className="model-field-value">
                        <input className="form-check-input" type="checkbox" disabled
                          checked={catalogModel.maturity.support_available || false}/>
                      </div>
                      </Col>
                    </Row>
                  </Col>
                </div>
                <div className="model-field-row">
                  <div className="model-field-label">Workflow Integration List</div>
                  <div className="model-field-value">
                    {workflow_integration_list.map((integration, idx) => (
                      <Badge key={idx} bg="secondary" className="model-tag-badge">
                            {integration}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scenarios Section */}
            {(expectedScenarios.length > 0) && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Expected Scenarios</h4>
                </div>
                <div className="model-section-content">
                  {expectedScenarios.length > 0 && (
                    <div style={{ marginBottom: scenarioMappings.length > 0 ? '32px' : '0' }}>
                      <table className="model-table">
                        <thead>
                          <tr>
                            <th className="model-table-header model-requirements-name-column">Name</th>
                            <th className="model-table-header">Description</th>
                            <th className="model-table-header">Years</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expectedScenarios.map((scenario, idx) => (
                            <tr key={scenario.name}>
                              <td className="model-table-cell model-table-cell-bold">{scenario.name}</td>
                              <td className="model-table-cell">{scenario.description}</td>
                              <td className="model-table-cell">{scenario.years || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

            {/* Inputs Section */}
            {inputs.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Inputs</h4>
                </div>
                <div className="model-section-content">
                  <ul className="model-list">
                    {inputs.map((input, idx) => (
                      <li key={idx} className="model-list-item-spaced">
                        <pre className="model-code-block-large">
                          {JSON.stringify(input, null, 2)}
                        </pre>
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

            {/* Outputs Section */}
            {outputs.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Outputs</h4>
                </div>
                <div className="model-section-content">
                  <ul className="model-list">
                    {outputs.map((output, idx) => (
                      <li key={idx} className="model-list-item-spaced">
                        <pre className="model-code-block-large">
                          {JSON.stringify(output, null, 2)}
                        </pre>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Config Section */}
            <div className="model-section">
              <div className="model-section-header">
                <h4 className="model-section-title">Config</h4>
              </div>
              <div className="model-section-content">
                <pre className="model-code-block-large">
                  {JSON.stringify(catalogModel.config, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modeling Team Section */}
            {toolTeams.length > 0 && (
              <div className="model-section">
                <div className="model-section-header">
                  <h4 className="model-section-title">Tool Teams</h4>
                </div>
                <div className="model-section-content">

                      <div className="model-table-container">
                        <table className="model-table">
                          <thead>
                            <tr>
                              <th className="model-table-header">Lab</th>
                              <th className="model-table-header">Role</th>
                              <th className="model-table-header">Contact</th>
                            </tr>
                          </thead>
                          <tbody>
                            {toolTeams.map((team, idx) => (
                              <tr key={idx}>
                                <td className="model-table-cell">
                                  {team.organization || '—'}
                                </td>
                                <td className="model-table-cell">
                                  {team.role || '—'}
                                </td>
                                <td className="model-table-cell">
                                  {team.contact || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                </div>
              )}



          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GetCatalogModelPageIFAC;
