import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Badge} from "react-bootstrap";


const FinalReviewSectionIFAC = ({ control, register, errors, watch, setValue, storedData }) => {
  // Get all current form data for review
  const allData = watch ? watch() : {};

  return (
    <div className="review">
      <div className="review-section mb-4">
        <div className="review-content">
          <Row>
            <Col md={12}>
              <div className="review-item mb-3">
                <div className="review-label">Model Name</div>
                <div className="review-value">{allData.name || 'Not specified'}</div>
              </div>
              <div className="review-item mb-3">
                <div className="review-label">Display Name</div>
                <div className="review-value">{allData.displayName || 'Not specified'}</div>
              </div>
              <div className="review-item mb-3">
                <div className="review-label">Type</div>
                <div className="review-value">{allData.type || 'Not specified'}</div>
              </div>
              {/* Use Cases Section */}
              <div className="review-content">
                <div className="review-item">
                  <div className="review-label">Use Cases</div>
                  {allData.use_cases && allData.use_cases.filter(a => a && a.trim()).length > 0 ? (
                    <div className="review-value">
                      {allData.use_cases.filter(a => a.trim()).map((use_case, i) => (
                        <Badge key={i} bg="secondary" className="model-tag-badge">
                          {use_case}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="review-value text-muted">No use cases specified</div>
                  )}
                </div>
              </div>
              {/* Features Section */}
              <div className="review-content">
                <div className="review-item">
                  <div className="review-label">Features</div>
                  {allData.use_cases && allData.features.filter(a => a && a.trim()).length > 0 ? (
                    <ul className="review-list-items mt-2 ps-3">
                      {allData.features.filter(a => a.trim()).map((features, i) => (
                        <li key={i}>{features}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="review-value text-muted">No features specified</div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* TODO: Maturity Section */}
      <div className="review-section mb-4">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Maturity Parameters</div>
            {allData.maturity  ? (
              <div className="review-value text-muted">
                <pre style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}>
                  {JSON.stringify(allData.maturity, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="review-value text-muted">No maturity parameters specified</div>
            )}
          </div>
        </div>
      </div>

      {/* Scenarios Section */}
      <div className="review-section mb-4">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Expected Scenarios</div>

            {/* Expected Scenarios List */}
            {allData.expectedScenarios && allData.expectedScenarios.filter(s => s && s.trim()).length > 0 ? (
              <ul className="review-list-items mt-2 ps-3">
                {allData.expectedScenarios.filter(s => s && s.trim()).map((scenario, i) => (
                  <li key={i}>{scenario}</li>
                ))}
              </ul>
            ) : (
              <div className="review-value text-muted">No scenarios specified</div>
            )}
          </div>

          {/* Scenario Mappings as table */}
          {allData.scenarioMappings && Object.keys(allData.scenarioMappings).length > 0 && (
            <div className="review-item mt-4">
              <div className="review-label">Scenario Mappings</div>
              <div className="table-responsive">
                <table className="table table-borderless table-sm mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '30%', textAlign: 'left', fontSize: '0.85rem', color: '#6c757d' }}>Model Scenario</th>
                      <th style={{ width: '35%', textAlign: 'left', fontSize: '0.85rem', color: '#6c757d' }}>Project Scenarios</th>
                      <th style={{ width: '35%', textAlign: 'left', fontSize: '0.85rem', color: '#6c757d' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(allData.scenarioMappings)
                      .filter(([id, mapping]) => mapping.modelScenario && mapping.modelScenario.trim())
                      .map(([id, mapping]) => (
                        <tr key={id}>
                          <td style={{ textAlign: 'left', verticalAlign: 'top', paddingBottom: '1rem' }}>
                            {mapping.modelScenario}
                          </td>
                          <td style={{ textAlign: 'left', verticalAlign: 'top', paddingBottom: '1rem' }}>
                            {mapping.projectScenarios && mapping.projectScenarios.length > 0 ? (
                              <div style={{ textAlign: 'left' }}>
                                {mapping.projectScenarios.map((scenario, idx) => (
                                  <div key={idx} style={{ marginBottom: '0.25rem' }}>• {scenario}</div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted" style={{ fontStyle: 'italic' }}>No project scenarios mapped</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'left', verticalAlign: 'top', paddingBottom: '1rem' }}>
                            {mapping.description && mapping.description.filter(d => d && d.trim()).length > 0 ? (
                              <div style={{ textAlign: 'left' }}>
                                {mapping.description.filter(d => d && d.trim()).map((desc, idx) => (
                                  <div key={idx} style={{ marginBottom: '0.25rem' }}>• {desc}</div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted" style={{ fontStyle: 'italic' }}>No description provided</span>
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

      {/* Assumptions Section */}
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Assumptions</div>
            {allData.assumptions && allData.assumptions.filter(a => a && a.trim()).length > 0 ? (
              <ul className="review-list-items mt-2 ps-3">
                {allData.assumptions.filter(a => a.trim()).map((assumption, i) => (
                  <li key={i}>{assumption}</li>
                ))}
              </ul>
            ) : (
              <div className="review-value text-muted">No assumptions specified</div>
            )}
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="review-section mb-4">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Spatial Requirements</div>
            {allData.requirements &&
              allData.requirements['spatial'] &&
              Object.values(allData.requirements['spatial'])
                .filter((requirement) => {
                  // Hide any requirements with empty name or empty value
                  if (
                    requirement &&
                    typeof requirement === "object" &&
                    ("name" in requirement && Object.keys(requirement).length > 1)
                  ) {
                    if (!requirement.name || requirement.name.trim() === "") return false;
                  } else return false;
                  return true;
                }).length > 0 ? (
              <div className="table-responsive">
                <table className="table table-borderless table-sm mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '30%', textAlign: 'left' }}>Name</th>
                      <th style={{ textAlign: 'left' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(allData.requirements['spatial'])
                      .filter((requirement) => {// Hide any requirements with empty name or empty value
                        if (
                          requirement &&
                          typeof requirement === "object" &&
                          ("name" in requirement && Object.keys(requirement).length > 1)
                        ) {
                          if (!requirement.name || requirement.name.trim() === "") return false;
                        } else return false;
                        return true;
                      })
                      .map((value, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            {value.name}
                          </td>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            <pre style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              padding: '8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem'
                            }}>
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="review-value text-muted">No requirements specified</div>
            )}
          </div>
        </div>
      </div>

      <div className="review-section mb-4">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Input Data</div>

            {/* List of Inputs */}
            {Object.values(allData.inputs)
                .filter((input) => {
                  // Hide any requirements with empty name or empty value
                  if (
                    input &&
                    typeof input === "object" &&
                    ("type" in input && Object.keys(input).length > 1)
                  ) {
                    if (!input.type || input.type.trim() === "" || !input[input.type] || Object.keys(input[input.type]).length === 0) {return false}
                    else if (!input[input.type].name || input[input.type].name.trim() === "") return false; 
                  } else return false;
                  return true;
                }).length > 0 ? (
              <div className="table-responsive">
                <table className="table table-borderless table-sm mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '30%', textAlign: 'left' }}>Name</th>
                      <th style={{ textAlign: 'left' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(allData.inputs)
                      .filter((input) => {// Hide any inputs with empty type or empty value
                        if (
                          input &&
                          typeof input === "object" &&
                          ("type" in input && Object.keys(input).length > 1)
                        ) {
                          if (!input.type || input.type.trim() === "" || !input[input.type] || Object.keys(input[input.type]).length === 0) {return false}
                          else if (!input[input.type].name || input[input.type].name.trim() === "") return false; 
                        } else return false;
                        return true;
                      })
                      .map((value, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            {value[value.type].name}
                          </td>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            <pre style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              padding: '8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem'
                            }}>
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="review-value text-muted">No inputs specified</div>
            )}
          </div>

        </div>
      </div>

      <div className="review-section mb-4">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Output Data</div>

            {/* List of Outputs */}
            {Object.values(allData.outputs)
                .filter((output) => {
                  // Hide any requirements with empty name or empty value
                  if (
                    output &&
                    typeof output === "object" &&
                    ("type" in output && Object.keys(output).length > 1)
                  ) {
                    if (!output.type || output.type.trim() === "" || !output[output.type] || Object.keys(output[output.type]).length === 0) {return false}
                      else if (!output[output.type].name || output[output.type].name.trim() === "") return false; 
                  } else return false;
                  return true;
                }).length > 0 ? (
              <div className="table-responsive">
                <table className="table table-borderless table-sm mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '30%', textAlign: 'left' }}>Name</th>
                      <th style={{ textAlign: 'left' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(allData.outputs)
                      .filter((output) => {// Hide any inputs with empty type or empty value
                        if (
                          output &&
                          typeof output === "object" &&
                          ("type" in output && Object.keys(output).length > 1)
                        ) {
                          if (!output.type || output.type.trim() === "" || !output[output.type] || Object.keys(output[output.type]).length === 0) {return false}
                          else if (!output[output.type].name || output[output.type].name.trim() === "") return false; 
                        } else return false;
                        return true;
                      })
                      .map((value, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            {value[value.type].name}
                          </td>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            <pre style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              padding: '8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem'
                            }}>
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="review-value text-muted">No outputs specified</div>
            )}
          </div>

        </div>
      </div>

      {/* Teams Section */}
      <div className="review-section">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Tool Teams</div>
            {allData.teams && Object.values(allData.teams).length > 0 ? (
              <div className="mt-3" style={{ width: '100%' }}>
                {/* Teams Members */}
                <div style={{ width: '100%' }}>
                  <div className="review-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Members</div>
                    <div style={{ width: '100%', overflow: 'auto' }}>
                      <table className="table table-borderless mb-0" style={{ width: '100%', minWidth: '600px' }}>
                        <thead>
                          <tr>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '30%' }}>Lab</th>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '30%' }}>Role</th>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '40%' }}>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.values(allData.teams).map((team, index) => (
                            <tr key={index}>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left', wordBreak: 'break-word' }}>
                                {team?.lab || 'N/A'}
                              </td>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left' }}>
                                {team?.role || 'N/A'}
                              </td>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left' }}>
                                {team?.contact || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                </div>
              </div>
            ) : (
              <div className="review-value text-muted">
                No tool teams specified.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalReviewSectionIFAC;
