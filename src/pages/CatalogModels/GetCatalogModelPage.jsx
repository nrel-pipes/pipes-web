import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate, useParams } from "react-router-dom";

import { useGetCatalogModelQuery } from "../../hooks/useCatalogModelQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import "../PageStyles.css";
import "./GetCatalogModelPage.css";
import GetCatalogModelPageIFAC from "./GetCatalogModelPageIFAC";
import GetCatalogModelPageDefault from "./GetCatalogModelPageDefault";

const SCHEMAS = {
    "IFAC": {"1.0":GetCatalogModelPageIFAC},
    "Default": {"1.0":GetCatalogModelPageDefault},
};

const GetCatalogModelPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus, currentUser } = useAuthStore();
  const { modelName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const { data: catalogModel, isLoading, error } = useGetCatalogModelQuery(modelName);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthChecking(true);
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  const handleBackToList = () => {
    navigate('/catalogmodels');
  };

  // Loading/auth/error states
  if (isAuthChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <>
        <NavbarSub navData={{ cmList: true, cmName: modelName }} />
        <Container className="mainContent" fluid>
          <Row className="w-100 mx-0">
            <ContentHeader title="Model Details" />
          </Row>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="xl" />
          </div>
        </Container>
      </>
    );
  }
  if (error || !catalogModel) {
    return (
      <>
        <NavbarSub navData={{ cmList: true, cmName: modelName }} />
        <Container className="mainContent" fluid>
          <Row className="w-100 mx-0">
            <ContentHeader title="Model Details" />
          </Row>
          <div className="alert alert-danger mt-4">
            <h4>Model Not Found in Catalog</h4>
            <p>The model you are trying to view could not be found.</p>
            <Button variant="primary" onClick={handleBackToList}>
              Go to Models List
            </Button>
          </div>
        </Container>
      </>
    );
  }

  const catalogSchema = catalogModel.catalog_schema || "Default";
  const schemaVersion = catalogModel.schema_version || "1.0";
  
  const SchemaComponent = SCHEMAS[catalogSchema][schemaVersion] || SCHEMAS["Default"]["1.0"];
  return (
    <SchemaComponent
      catalogModel={catalogModel}
      currentUser={currentUser}
    />
  );
};

export default GetCatalogModelPage;
