import { Pencil, Settings, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const ProjectRunDropdownButton = ({ projectName, projectRunName, isDisabled = false }) => {
  const navigate = useNavigate();

  const handleUpdateProjectRun = () => {
    if (isDisabled) return;
    navigate("/update-projectrun", {
      state: { projectName: projectName, projectRunName: projectRunName }
    });
  };

  const handleDeleteProjectRun = () => {
    if (isDisabled) return;
    navigate("/delete-projectrun");
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
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

export default ProjectRunDropdownButton;
