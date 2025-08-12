import { Pencil, Settings, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";


const TeamDropdownButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpdateTeam = () => {
    if (isDisabled) return;

    const searchParams = new URLSearchParams(location.search);
    const projectName = searchParams.get('project');
    const teamName = searchParams.get('team');

    if (projectName && teamName) {
      navigate(`/update-team?project=${encodeURIComponent(projectName)}&team=${encodeURIComponent(teamName)}`);
    } else {
      // Fallback - redirect to teams list if parameters are missing
      navigate("/teams");
    }
  };

  const handleDeleteTeam = () => {
    const searchParams = new URLSearchParams(location.search);
    const projectName = searchParams.get('project');
    const teamName = searchParams.get('team');

    if (projectName && teamName) {
      navigate(`/delete-team?project=${encodeURIComponent(projectName)}&team=${encodeURIComponent(teamName)}`);
    } else {
      // Fallback to using store values
      navigate(`/delete-team?project=${encodeURIComponent(projectName)}&team=${encodeURIComponent(teamName || 'unknown')}`);
    }
  };

  const handleBackToTeams = () => {
    navigate("/teams");
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
      <button
          className={`btn create-run-button me-3`}
          style={{
            backgroundColor: 'rgb(71, 148, 218)',
            color: 'white',
            fontWeight: 'bold',
            width: '180px',
            height: '50px',
          }}
          onMouseDown={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
          onMouseUp={(e) => e.currentTarget.style.color = 'white'}
          onClick={handleBackToTeams}
        >
          ← Back to Teams
      </button>
      <Dropdown>
        <Dropdown.Toggle
          variant="primary"
          className={`px-4 py-3 actions-dropdown-toggle ${isDisabled ? 'disabled' : ''}`}
          disabled={isDisabled}
        >
          <Settings size={16} className="update-button-icon me-1 actions-dropdown-icon" />
          Actions
        </Dropdown.Toggle>

        <Dropdown.Menu className="actions-dropdown-menu">
          <Dropdown.Item
            onClick={handleUpdateTeam}
            className="d-flex align-items-center dropdown-item-update"
            disabled={isDisabled}
          >
            <Pencil size={16} className="me-2" />
            Update Team
          </Dropdown.Item>
          <hr className="dropdown-divider" />
          <Dropdown.Item
            onClick={handleDeleteTeam}
            className="d-flex align-items-center dropdown-item-delete"
            disabled={isDisabled}
          >
            <Trash2 size={16} className="me-2" />
            Delete Team
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default TeamDropdownButton;
