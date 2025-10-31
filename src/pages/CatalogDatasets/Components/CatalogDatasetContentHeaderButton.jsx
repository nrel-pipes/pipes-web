import { Pencil, Settings, Share2, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


const CatalogDatasetContentHeaderButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();
  const { datasetName } = useParams();

  const handleUpdateCatalogDataset = () => {
    if (isDisabled) return;
    navigate(`/catalogdataset/${encodeURIComponent(datasetName)}/update`);
  };

  const handleDeleteCatalogDataset = () => {
    if (isDisabled) return;
    navigate(`/catalogdataset/${encodeURIComponent(datasetName)}/delete`);
  };

  const handleShareCatalogDataset = () => {
    navigate(`/catalogdataset/${encodeURIComponent(datasetName)}/share`);
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
          onClick={handleShareCatalogDataset}
          disabled={isDisabled}
        >
          <Share2 size={16} className="me-2" style={{ marginTop: '-2px' }} />
          Share this Dataset
      </button>
      <Dropdown>
        <Dropdown.Toggle
          variant="primary"
          className={`px-4 py-3 actions-dropdown-toggle ${isDisabled ? 'disabled' : ''}`}
          disabled={isDisabled}
        >
          <Settings size={16} className="update-button-icon me-1 actions-dropdown-icon" />
          Actions
        </Dropdown.Toggle>

        <Dropdown.Menu className="actions-dropdown-menu">
          <Dropdown.Item
            onClick={handleUpdateCatalogDataset}
            className="d-flex align-items-center dropdown-item-update"
            disabled={isDisabled}
          >
            <Pencil size={16} className="me-2" />
            Update Dataset
          </Dropdown.Item>
          <hr className="dropdown-divider" />
          <Dropdown.Item
            onClick={handleDeleteCatalogDataset}
            className="d-flex align-items-center dropdown-item-delete"
            disabled={isDisabled}
          >
            <Trash2 size={16} className="me-2" />
            Delete Dataset
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default CatalogDatasetContentHeaderButton;
