import { useNavigate } from "react-router-dom";

const ReturnToModelsButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();

  const handleReturnToModels = () => {
    if (isDisabled) return;
    navigate("/models");
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
      <button
        className="btn btn-primary px-4 py-3"
        onClick={handleReturnToModels}
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
        ← Back to Models
      </button>
    </div>
  );
}

export default ReturnToModelsButton;
