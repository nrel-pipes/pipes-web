import { X } from "lucide-react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProjectUpdateCancelButton = ({projectName}) => {
  const navigate = useNavigate();

  const handleCancelProjectUpdate = () => {
    navigate(`/dashboard?P=${encodeURIComponent(projectName)}`);
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
      <Button
        variant="secondary"
        onClick={handleCancelProjectUpdate}
        className="px-4 py-3"
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: '6px'
        }}
      >
        <X size={16} className="update-button-icon me-1" />
        Cancel
      </Button>
    </div>
  );
}

export default ProjectUpdateCancelButton;
