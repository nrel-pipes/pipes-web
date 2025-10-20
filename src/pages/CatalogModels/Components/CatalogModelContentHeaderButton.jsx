import { Pencil, Settings, Share2, Trash2 } from "lucide-react";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


const CatalogModelContentHeaderButton = ({ isDisabled = false }) => {
  const navigate = useNavigate();
  const { modelName } = useParams();

  const handleUpdateCatalogModel = () => {
    if (isDisabled) return;
    navigate(`/catalogmodel/${encodeURIComponent(modelName)}/update`);
  };

  const handleDeleteCatalogModel = () => {
    if (isDisabled) return;
    navigate(`/catalogmodel/${encodeURIComponent(modelName)}/delete`);
  };

  const handleShareCatalogModel = () => {
    navigate(`/catalogmodel/${encodeURIComponent(modelName)}/share`);
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
          onClick={handleShareCatalogModel}
          disabled={isDisabled}
        >
          <Share2 size={16} className="me-2" style={{ marginTop: '-2px' }} />
          Share this Model
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
            onClick={handleUpdateCatalogModel}
            className="d-flex align-items-center dropdown-item-update"
            disabled={isDisabled}
          >
            <Pencil size={16} className="me-2" />
            Update Model
          </Dropdown.Item>
          <hr className="dropdown-divider" />
          <Dropdown.Item
            onClick={handleDeleteCatalogModel}
            className="d-flex align-items-center dropdown-item-delete"
            disabled={isDisabled}
          >
            <Trash2 size={16} className="me-2" />
            Delete Model
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default CatalogModelContentHeaderButton;
