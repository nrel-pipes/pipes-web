import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


const FinalReviewSection = ({ control, register, errors, watch, setValue, storedData }) => {
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
            </Col>
          </Row>
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
      </div>

      {/* Requirements Section */}
      <div className="review-section mb-4">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Requirements</div>
            {allData.requirements &&
              Object.values(allData.requirements)
                .filter((value) => {
                  // Hide any requirements with empty name or empty value
                  if (
                    value &&
                    typeof value === "object" &&
                    ("name" in value || "type" in value || "value" in value)
                  ) {
                    if (!value.name || value.name.trim() === "") return false;
                  }
                  if (
                    value === "" ||
                    (typeof value === "object" && Object.keys(value).length === 0)
                  ) {
                    return false;
                  }
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
                    {Object.values(allData.requirements)
                      .filter((value) => {
                        if (
                          value &&
                          typeof value === "object" &&
                          ("name" in value || "type" in value || "value" in value)
                        ) {
                          if (!value.name || value.name.trim() === "") return false;
                        }
                        if (
                          value === "" ||
                          (typeof value === "object" && Object.keys(value).length === 0)
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((value, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            {value.name}
                          </td>
                          <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                            {value.type === "object"
                              ? (
                                  <pre style={{
                                    margin: 0,
                                    whiteSpace: "pre-wrap",
                                    padding: '8px',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem'
                                  }}>
                                    {JSON.stringify(value.value, null, 2)}
                                  </pre>
                                )
                              : <span>{value.value}</span>}
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

      {/* Assumptions Section */}
      <div className="review-section mb-4">
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

      {/* Modeling Team Section */}
      <div className="review-section">
        <div className="review-content">
          <div className="review-item">
            <div className="review-label">Modeling Team</div>
            {allData.modelingTeam && allData.modelingTeam.name ? (
              <div className="mt-3" style={{ width: '100%' }}>
                {/* Team Name */}
                <div className="mb-3">
                  <strong style={{ fontSize: '1.1rem' }}>{allData.modelingTeam.name}</strong>
                </div>

                {/* Team Members */}
                <div style={{ width: '100%' }}>
                  <div className="review-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Members</div>
                  {allData.modelingTeam.members && allData.modelingTeam.members.length > 0 ? (
                    <div style={{ width: '100%', overflow: 'auto' }}>
                      <table className="table table-borderless mb-0" style={{ width: '100%', minWidth: '600px' }}>
                        <thead>
                          <tr>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '30%' }}>Email</th>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '30%' }}>Name</th>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '40%' }}>Organization</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allData.modelingTeam.members.map((member, index) => (
                            <tr key={index}>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left', wordBreak: 'break-word' }}>
                                {member?.email || 'N/A'}
                              </td>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left' }}>
                                {`${member?.first_name || ''} ${member?.last_name || ''}`.trim() || 'N/A'}
                              </td>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left' }}>
                                {member?.organization || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted" style={{ fontStyle: 'italic' }}>
                      No members have been added to this team.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="review-value text-muted">
                No modeling team specified.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalReviewSection;
