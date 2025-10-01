import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


const ProjectCreationButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    if (isDisabled) return;
    navigate("/project/new");
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
      <button
        className="btn btn-primary px-4 py-3"
        onClick={handleCreateProject}
        style={{
          backgroundColor: '#0079c2',
          borderColor: '#0079c2',
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: '6px'
        }}
      >
        <Plus size={20} className="me-2" />
        Create Project
      </button>
    </div>
  );
}

export default ProjectCreationButton;
