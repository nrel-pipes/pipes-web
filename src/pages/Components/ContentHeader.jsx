import { Pencil } from "lucide-react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../PageStyles.css";
import "./ContentHeader.css";

function ContentHeader({
  title,
  showUpdateProjectButton = false,
  cornerMark
}) {
  const navigate = useNavigate();

  const handleUpdateProject = () => {
    navigate("/update-project");
  };

  return (
    <div className="container mt-4 mb-4 content-header-container">
      <div className="content-header-heading">
        <h2 className="d-inline-flex title-container content-header-text display-6">{title}</h2>
        {cornerMark !== undefined && (
          <span className="content-header-counter">({cornerMark})</span>
        )}
      </div>

      <div className="content-header-actions d-flex justify-content-end">
        {showUpdateProjectButton && (
          <Button
            className="update-button me-2"
            onClick={handleUpdateProject}
            style={{
              backgroundColor: 'rgb(71, 148, 218)',
              color: 'white',
              fontWeight: 'bold',
              width: '180px'
            }}
          >
            <Pencil size={16} className="update-button-icon me-1" />
            Update project
          </Button>
        )}
      </div>
    </div>
  );
}

export default ContentHeader;
