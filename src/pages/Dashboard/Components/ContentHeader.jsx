import { Pencil, Settings, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../Components/ContentHeader.css";
import "../../PageStyles.css";


const ContentHeader = ({cornerMark}) => {
  const navigate = useNavigate();

  const handleUpdateProject = () => {
    navigate("/update-project");
  };

  const handleDeleteProject = () => {
    // Add your delete project logic here
    console.log("Delete project clicked");
  };

  return (
    <div className="container mt-4 mb-4 content-header-container">
      <div className="content-header-heading">
        <h2 className="d-inline-flex title-container content-header-text display-6">Project Dashboard</h2>
        {cornerMark !== undefined && (
          <span className="content-header-counter">({cornerMark})</span>
        )}
      </div>

      <div className="content-header-actions d-flex justify-content-end">
        <Dropdown>
          <Dropdown.Toggle
            variant="primary"
            className="px-4 py-3 actions-dropdown-toggle"
          >
            <Settings size={16} className="update-button-icon me-1 actions-dropdown-icon" />
            Actions
          </Dropdown.Toggle>

          <Dropdown.Menu className="actions-dropdown-menu">
            <Dropdown.Item
              onClick={handleUpdateProject}
              className="d-flex align-items-center dropdown-item-update"
            >
              <Pencil size={16} className="me-2" />
              Update Project
            </Dropdown.Item>
            <hr className="dropdown-divider" />
            <Dropdown.Item
              onClick={handleDeleteProject}
              className="d-flex align-items-center dropdown-item-delete"
            >
              <Trash2 size={16} className="me-2" />
              Delete Project
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default ContentHeader;
