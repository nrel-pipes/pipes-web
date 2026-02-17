import { Pencil, Settings, Share2, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


const CatalogDatasetContentHeaderButton = ({ disableUpdate = false, disableDelete = false }) => {
  const navigate = useNavigate();
  const { datasetName } = useParams();

  const handleUpdateCatalogDataset = () => {
    if (disableUpdate) return;
    navigate(`/catalogdataset/${encodeURIComponent(datasetName)}/update`);
  };

  const handleDeleteCatalogDataset = () => {
    if (disableDelete) return;
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
          disabled={disableDelete}
        >
          <Share2 size={16} className="me-2" style={{ marginTop: '-2px' }} />
          Share this Dataset
      </button>
      <Dropdown>
        <Dropdown.Toggle
          variant="primary"
          className={`px-4 py-3 actions-dropdown-toggle ${disableUpdate ? 'disabled' : ''}`}
          disabled={disableUpdate}
        >
          <Settings size={16} className="update-button-icon me-1 actions-dropdown-icon" />
          Actions
        </Dropdown.Toggle>

        <Dropdown.Menu className="actions-dropdown-menu">
          <Dropdown.Item
            onClick={handleUpdateCatalogDataset}
            className="d-flex align-items-center dropdown-item-update"
            disabled={disableUpdate}
          >
            <Pencil size={16} className="me-2" />
            Update Dataset
          </Dropdown.Item>
          <hr className="dropdown-divider" />
          <Dropdown.Item
            onClick={handleDeleteCatalogDataset}
            className="d-flex align-items-center dropdown-item-delete"
            disabled={disableDelete}
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
