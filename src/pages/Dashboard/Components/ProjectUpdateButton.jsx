import { Pencil } from "lucide-react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const ProjectUpdateButton = () => {
  const navigate = useNavigate();

  const handleUpdateProject = () => {
    navigate("/update-project");
  };

  return (
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
  );
}

export default ProjectUpdateButton;
