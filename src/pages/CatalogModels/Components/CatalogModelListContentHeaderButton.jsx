import { useNavigate, useParams } from "react-router-dom";


const CatalogModelListContentHeaderButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();
  const { modelName } = useParams();

  const handleCatalogModelCreate = () => {
    navigate('/catalogmodel/new');
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
          onClick={handleCatalogModelCreate}
        >
          + Create Model
      </button>
    </div>
  );
};

export default CatalogModelListContentHeaderButton;
