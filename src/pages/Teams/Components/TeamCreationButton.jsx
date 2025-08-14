import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


const TeamCreationButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    if (isDisabled) return;
    navigate("/create-team");
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
      <button
        className="btn btn-primary px-4 py-3"
        onClick={handleCreateTeam}
        disabled={isDisabled}
        style={{
          backgroundColor: '#0079c2',
          borderColor: '#0079c2',
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: '6px',
          minWidth: '180px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.65 : 1
        }}
      >
        <Plus size={20} className="me-2" />
        Create Team
      </button>
    </div>
  );
}

export default TeamCreationButton;
