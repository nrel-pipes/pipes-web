import "../PageStyles.css";
import "./ContentHeader.css";


const ContentHeader = ({title, cornerMark, headerButton}) => {
  return (
    <div className="container mt-4 mb-4 content-header-container">
      <div className="content-header-heading">
        <h2 className="d-inline-flex title-container content-header-text display-6">{title}</h2>
        {cornerMark !== undefined && (
          <span className="content-header-counter">({cornerMark})</span>
        )}
      </div>
      {headerButton}
    </div>
  );
}

export default ContentHeader;
