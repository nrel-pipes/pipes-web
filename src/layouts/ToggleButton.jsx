import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './styles/ToggleButton.css';

const ToggleButton = ({ onToggle, isExpanded }) => {
  return (
    <div className="toggle-button-container">
      <button
        className="sidebar-toggle-btn"
        onClick={onToggle}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        type="button"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default ToggleButton;
