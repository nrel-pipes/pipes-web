import { Pencil } from "lucide-react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../Components/ContentHeader.css";
import "../../PageStyles.css";


const ContentHeader = ({cornerMark}) => {
  const navigate = useNavigate();

  const handleUpdateProject = () => {
    navigate("/update-project");
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
        <Button
          variant="primary"
          onClick={handleUpdateProject}
          className="px-4 py-3"
          style={{
            backgroundColor: '#0079c2',
            borderColor: '#0079c2',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '6px',
            minWidth: '180px'
          }}
        >
          <Pencil size={16} className="update-button-icon me-1" />
          Update Project
        </Button>
      </div>
    </div>
  );
}

export default ContentHeader;
