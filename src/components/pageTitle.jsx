import "./PageTitle.css";
import "../pages/PageStyles.css";
import Col from "react-bootstrap/Col";


function PageTitle({ title }) {
    return (
        <div className="container mt-4 mb-4">
            <Col className="flex"><h2 className="d-inline-flex title-container">{title}</h2></Col>
        </div> 
    );
};
  
export default PageTitle;