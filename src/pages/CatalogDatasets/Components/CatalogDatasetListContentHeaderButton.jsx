import { useNavigate } from "react-router-dom";


const CatalogDatasetListContentHeaderButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();

  const handleCatalogDatasetCreate = () => {
    navigate('/catalogdataset/new');
  };

  return (
    <div className="content-header-actions d-flex justify-content-end">
      <button
          className={`btn create-run-button me-3`}
          style={{
            backgroundColor: 'rgb(71, 148, 218)',
            color: 'white',
            fontWeight: 'bold',
            height: '50px',
          }}
          onMouseDown={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
          onMouseUp={(e) => e.currentTarget.style.color = 'white'}
          onClick={handleCatalogDatasetCreate}
        >
          + Create Dataset
      </button>
    </div>
  );
};

export default CatalogDatasetListContentHeaderButton;
