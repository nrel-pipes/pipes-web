import { Pencil, Settings, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";


const ModelDropdownButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpdateModel = () => {
    if (isDisabled) return;

    const searchParams = new URLSearchParams(location.search);
    const projectName = searchParams.get('project');
    const modelName = searchParams.get('model');

    if (projectName && modelName) {
      navigate(`/update-model?project=${encodeURIComponent(projectName)}&model=${encodeURIComponent(modelName)}`);
    } else {
      // Fallback - redirect to models list if parameters are missing
      navigate("/models");
    }
  };

  const handleDeleteModel = () => {
    const searchParams = new URLSearchParams(location.search);
    const projectName = searchParams.get('project');
    const modelName = searchParams.get('model');

    if (projectName && modelName) {
      navigate(`/delete-model?project=${encodeURIComponent(projectName)}&model=${encodeURIComponent(modelName)}`);
    } else {
      // Fallback to using store values
      navigate(`/delete-model?project=${encodeURIComponent(projectName)}&model=${encodeURIComponent(modelName || 'unknown')}`);
    }
  };

  const handleBackToModels = () => {
    navigate("/models");
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
          onClick={handleBackToModels}
        >
          ← Back to Models
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
            onClick={handleUpdateModel}
            className="d-flex align-items-center dropdown-item-update"
            disabled={isDisabled}
          >
            <Pencil size={16} className="me-2" />
            Update Model
          </Dropdown.Item>
          <hr className="dropdown-divider" />
          <Dropdown.Item
            onClick={handleDeleteModel}
            className="d-flex align-items-center dropdown-item-delete"
            disabled={isDisabled}
          >
            <Trash2 size={16} className="me-2" />
            Delete Model
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default ModelDropdownButton;
