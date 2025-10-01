import { Pencil, Settings, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const ProjectRunContentHeaderButton = ({ projectName, projectRunName, isDisabled = false }) => {
  const navigate = useNavigate();

  const handleUpdateProjectRun = () => {
    if (isDisabled) return;
    navigate(`/projectrun/${encodeURIComponent(projectRunName)}/update?P=${encodeURIComponent(projectName)}`);
  };

  const handleDeleteProjectRun = () => {
    if (isDisabled) return;
    navigate(`/projectrun/${encodeURIComponent(projectRunName)}/delete?P=${encodeURIComponent(projectName)}`);
  };

  const handleCreateModel = () => {
    if (isDisabled) return;
    navigate(`/model/startnew?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`);
  };

  const handleCreateHandoff = () => {
    if (isDisabled) return;
    navigate(`/handoff/new?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`);
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
      <button
        className={`btn create-run-button me-3 ${isDisabled ? 'disabled' : ''}`}
        style={{
          backgroundColor: 'rgb(71, 148, 218)',
          color: 'white',
          fontWeight: 'bold',
          height: '50px',
        }}
        onMouseDown={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
        onMouseUp={(e) => e.currentTarget.style.color = 'white'}
        onClick={handleCreateModel}
      >
        + Create Model
      </button>
      <button
        className={`btn me-3 ${isDisabled ? 'disabled' : ''}`}
        style={{
          backgroundColor: 'rgba(225, 225, 225, 1)',
          color: 'rgb(71, 148, 218)',
          fontWeight: 'bold',
          height: '50px',
        }}
        onMouseDown={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
        onMouseUp={(e) => e.currentTarget.style.color = 'white'}
        onClick={handleCreateHandoff}
      >
        + Add Handoff
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
            onClick={handleUpdateProjectRun}
            className="d-flex align-items-center dropdown-item-update"
            disabled={isDisabled}
          >
            <Pencil size={16} className="me-2" />
            Update Project Run
          </Dropdown.Item>
          <hr className="dropdown-divider" />
          <Dropdown.Item
            onClick={handleDeleteProjectRun}
            className="d-flex align-items-center dropdown-item-delete"
            disabled={isDisabled}
          >
            <Trash2 size={16} className="me-2" />
            Delete Project Run
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default ProjectRunContentHeaderButton;
