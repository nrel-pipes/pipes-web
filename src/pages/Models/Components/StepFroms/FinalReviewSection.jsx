

import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useListTeamsQuery } from "../../../../hooks/useTeamQuery";


const FinalReviewSection = ({ control, register, errors, watch, setValue, projectRun, storedData }) => {
  // Get all current form data for review
  const allData = watch ? watch() : {};

  // Extract project name from storedData for team query
  const projectName = storedData?.projectName;

  // Fetch teams to get team details
  const { data: teams = [] } = useListTeamsQuery(projectName, {
    enabled: !!projectName,
  });

  // Find the selected team details
  const selectedTeam = teams.find(team => team.name === allData.modelingTeam);

  return (
    <div className="review">
      <div className="review-section mb-4">
        <div className="review-content">
          <Row>
            <Col md={4}>
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
            <Col md={8}>
              <div className="review-item mb-3">
                <div className="review-label">Scheduled Start</div>
                <div className="review-value">{allData.scheduledStart || 'Not specified'}</div>
              </div>
              <div className="review-item mb-3">
                <div className="review-label">Scheduled End</div>
                <div className="review-value">{allData.scheduledEnd || 'Not specified'}</div>
              </div>
              <div className="review-item mb-3">
                <div className="review-label">Description</div>
                <div className="review-value">{allData.description || 'Not specified'}</div>
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
                      <th style={{ width: '35%', textAlign: 'left', fontSize: '0.85rem', color: '#6c757d' }}>Project Scenario</th>
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
            {selectedTeam ? (
              <div className="mt-3" style={{ width: '100%' }}>
                {/* Team Name */}
                <div className="mb-3">
                  <strong style={{ fontSize: '1.1rem' }}>{selectedTeam.name}</strong>
                </div>

                {/* Team Description */}
                <div className="mb-3">
                  <div className="review-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Description</div>
                  <div className="review-value">
                    {selectedTeam.description ? (
                      <p className="mb-0">{selectedTeam.description}</p>
                    ) : (
                      <span className="text-muted" style={{ fontStyle: 'italic' }}>No description provided</span>
                    )}
                  </div>
                </div>

                {/* Team Members */}
                <div style={{ width: '100%' }}>
                  <div className="review-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Members</div>
                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    <div style={{ width: '100%', overflow: 'auto' }}>
                      <table className="table table-borderless mb-0" style={{ width: '100%', minWidth: '600px' }}>
                        <thead>
                          <tr>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '35%' }}>Email</th>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '35%' }}>Name</th>
                            <th style={{ fontSize: '0.85rem', color: '#6c757d', textAlign: 'left', width: '30%' }}>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTeam.members.map((member, index) => (
                            <tr key={index}>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left', wordBreak: 'break-word' }}>
                                {member?.email || 'No email provided'}
                              </td>
                              <td style={{ fontSize: '0.9rem', textAlign: 'left' }}>
                                {member?.first_name || member?.last_name
                                  ? `${member?.first_name || ''} ${member?.last_name || ''}`.trim()
                                  : (member?.name || 'No name provided')}
                              </td>
                              <td style={{ textAlign: 'left' }}>
                                {member?.role ? (
                                  <Badge style={{ fontSize: '0.75rem' }}>
                                    {member.role}
                                  </Badge>
                                ) : (
                                  <span style={{ color: '#6c757d', fontStyle: 'italic', fontSize: '0.85rem' }}>No role assigned</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted" style={{ fontStyle: 'italic' }}>
                      This team doesn't have any members yet.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="review-value text-muted">
                {allData.modelingTeam ? `Team "${allData.modelingTeam}" not found` : 'Not selected'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalReviewSection;
