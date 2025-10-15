import { useEffect, useRef } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useListTeamsQuery } from "../../../../hooks/useTeamQuery";


const ModelingTeamSection = ({ control, register, errors, watch, setValue, storedData, projectName }) => {
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  // Fetch teams for the modeling team dropdown
  const { data: teams = [] } = useListTeamsQuery(projectName, {
    enabled: !!projectName,
  });

  // Initialize form field with stored data only once when teams are first loaded
  useEffect(() => {
    if (storedData?.modelingTeam && setValue && teams.length > 0 && !hasInitialized.current) {
      setValue("modelingTeam", storedData.modelingTeam);
      hasInitialized.current = true;
    }
  }, [teams.length, storedData?.modelingTeam, setValue]);

  // Watch the selected team to show details and members
  const selectedTeamName = watch ? watch("modelingTeam") : "";
  const selectedTeam = teams.find(team => team.name === selectedTeamName);

  return (
    <div className="form-field-group mb-4">
      <Form.Label className="form-field-label required-field">Modeling Team</Form.Label>
      <div className="d-flex align-items-start gap-2">
        <div className="flex-grow-1">
          <Form.Select
            className="form-control-lg form-primary-input"
            isInvalid={!!errors?.modelingTeam}
            {...register("modelingTeam", { required: "Modeling team is required" })}
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.name} value={team.name}>
                {team.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid" className="text-start">
            {errors?.modelingTeam?.message}
          </Form.Control.Feedback>
        </div>
        <Button
          variant="outline-primary"
          type="button"
          onClick={() => window.open(`/team/new?P=${encodeURIComponent(projectName)}`, '_blank')}
          className="d-flex align-items-center justify-content-center"
          style={{
            minWidth: '44px',
            height: '44px',
            padding: '0'
          }}
          title="Create a new team"
        >
          +
        </Button>
      </div>

      {/* Team Details Card */}
      <div className="mt-3">
        <Card>
          {/* DESCRIPTION SECTION */}
          <Card.Body style={{ padding: 0 }}>
            {selectedTeam ? (
              <>
                <div style={{ padding: '1rem 1.5rem', borderBottom: selectedTeam.members && selectedTeam.members.length > 0 ? '1px solid #f1f3f5' : 'none' }}>
                  <h6 style={{ margin: 0, marginBottom: '.5rem', fontSize: '1rem'}}>Description</h6>
                  {selectedTeam.description ? (
                    <p className="mb-0 text-muted">{selectedTeam.description}</p>
                  ) : (
                    <p className="mb-0 text-muted" style={{ fontStyle: 'italic' }}>No description provided.</p>
                  )}
                </div>

                {/* MEMBERS SECTION */}
                <div style={{ padding: 0 }}>
                  <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #f1f3f5', backgroundColor: '#f8f9fa', textAlign: 'left' }} className="text-start">
                    <strong style={{ fontSize: '0.95rem' }}>Members</strong>
                  </div>

                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0" style={{ fontSize: '1rem' }}>
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th style={{
                              padding: '1rem 1.5rem',
                              fontWeight: '600',
                              color: '#495057',
                              border: 'none',
                              borderBottom: '1px solid #dee2e6',
                              textAlign: 'left',
                              width: '30%'
                            }}>
                              Email
                            </th>
                            <th style={{
                              padding: '1rem 1.5rem',
                              fontWeight: '600',
                              color: '#495057',
                              border: 'none',
                              borderBottom: '1px solid #dee2e6',
                              textAlign: 'left',
                              width: '45%'
                            }}>
                              Name
                            </th>
                            <th style={{
                              padding: '1rem 1.5rem',
                              fontWeight: '600',
                              color: '#495057',
                              border: 'none',
                              borderBottom: '1px solid #dee2e6',
                              textAlign: 'left',
                              width: '25%'
                            }}>
                              Role
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTeam.members.map((member, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f1f3f5' }}>
                              <td style={{
                                padding: '1.25rem 1.5rem',
                                border: 'none',
                                color: '#6c757d',
                                textAlign: 'left'
                              }}>
                                {member?.email || 'No email provided'}
                              </td>
                              <td style={{
                                padding: '1.25rem 1.5rem',
                                border: 'none',
                                color: '#2c3e50',
                                textAlign: 'left'
                              }}>
                                {member?.first_name || member?.last_name
                                  ? `${member?.first_name || ''} ${member?.last_name || ''}`.trim()
                                  : (member?.name || 'No name provided')}
                              </td>
                              <td style={{
                                padding: '1.25rem 1.5rem',
                                border: 'none',
                                textAlign: 'left'
                              }}>
                                {member?.role ? (
                                  <Badge bg="secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                    {member.role}
                                  </Badge>
                                ) : (
                                  <span style={{ color: '#6c757d', fontStyle: 'italic' }}>No role assigned</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      padding: '2.5rem',
                      textAlign: 'center',
                      color: '#6c757d',
                      backgroundColor: '#fff'
                    }}>
                      <h5 style={{ marginBottom: '.5rem' }}>No Team Members</h5>
                      <p className="mb-0">This team doesn't have any members yet.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{
                padding: '1.5rem',
                color: '#6c757d',
                backgroundColor: '#f8f9fa',
                textAlign: 'center'
              }}>
                <p className="mb-0">Select a team to view description and members.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default ModelingTeamSection;
