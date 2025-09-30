import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Col, Dropdown, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetHandoffsQuery } from "../../../hooks/useHandoffQuery";


export default function HandoffListComponent({ projectRun }) {
  const navigate = useNavigate();
  const projectName = projectRun.context.project;
  const projectRunName = projectRun.name;

  const { data: handoffs, isLoading, error } = useGetHandoffsQuery(projectName, projectRunName);

  if (isLoading) return <div>Loading handoffs...</div>;
  if (error) return <div>Error loading handoffs: {error.message}</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateHandoff = (handoffName) => {
    navigate(`/handoff/${encodeURIComponent(handoffName)}/update?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`);
  };

  const handleDeleteHandoff = async (handoffName) => {
    navigate(`/handoff/${encodeURIComponent(handoffName)}/delete?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`);
  };

  return (
    <div className="mt-5">
      <h4 className="text-lg font-semibold mb-4">
        Handoffs
      </h4>

      {handoffs.length === 0 ? (
        <p className="text-gray-500">No handoffs found for this project run.</p>
      ) : (
        <div className="space-y-4">
          {handoffs.map(handoff => (
            <div key={handoff.name} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Row>
                    <Col className="text-end">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="p-0 border-0 shadow-none">
                          <MoreVertical size={16} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="actions-dropdown-menu">
                          <Dropdown.Item
                            onClick={() => handleUpdateHandoff(handoff.name)}
                            className="d-flex align-items-center dropdown-item-update"
                          >
                            <Pencil size={16} className="me-2" />
                            Update Handoff
                          </Dropdown.Item>
                          <hr className="dropdown-divider" />
                          <Dropdown.Item
                            onClick={() => handleDeleteHandoff(handoff.name)}
                            className="d-flex align-items-center dropdown-item-delete"
                          >
                            <Trash2 size={16} className="me-2" />
                            Delete Handoff
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                  <h4 className="font-medium text-lg">{handoff.name}</h4>
                  <p className="text-sm text-gray-600">{handoff.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium"><b>From Model:</b></span> {handoff.from_model}
                  {handoff.from_modelrun && (
                    <span className="text-gray-500"> ({handoff.from_modelrun})</span>
                  )}
                </div>
                <div>
                  <span className="font-medium"><b>To Model:</b></span> {handoff.to_model}
                </div>

                {handoff.scheduled_start && (
                  <div>
                    <span className="font-medium"><b>Scheduled Start:</b></span> {formatDate(handoff.scheduled_start)}
                  </div>
                )}
                {handoff.scheduled_end && (
                  <div>
                    <span className="font-medium"><b>Scheduled End:</b></span> {formatDate(handoff.scheduled_end)}
                  </div>
                )}

                {handoff.submission_date && (
                  <div className="col-span-2">
                    <span className="font-medium"><b>Submitted:</b></span> {formatDate(handoff.submission_date)}
                  </div>
                )}
              </div>

              {handoff.notes && (
                <div className="mt-3 pt-3 border-t">
                  <span className="font-medium text-sm">Notes:</span>
                  <p className="text-sm text-gray-700 mt-1">{handoff.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
