import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Badge, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate, useParams } from "react-router-dom";

import { useGetCatalogDatasetQuery } from "../../hooks/useCatalogDatasetQuery";
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from "../Components/ContentHeader";

import CatalogDatasetContentHeaderButton from "./Components/CatalogDatasetContentHeaderButton";

import "../PageStyles.css";
import "./GetCatalogDatasetPage.css";


const GetCatalogDatasetPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus, currentUser } = useAuthStore();
  const { datasetName } = useParams();

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const { data: catalogDataset, isLoading, error } = useGetCatalogDatasetQuery(datasetName);

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
    navigate('/catalogdatasets');
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
        <NavbarSub navData={{ cdList: true, cdName: datasetName }} />
        <Container className="mainContent" fluid>
          <Row className="w-100 mx-0">
            <ContentHeader title="Dataset Details" />
          </Row>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="xl" />
          </div>
        </Container>
      </>
    );
  }
  if (error || !catalogDataset) {
    return (
      <>
        <NavbarSub navData={{ cdList: true, cdName: datasetName }} />
        <Container className="mainContent" fluid>
          <Row className="w-100 mx-0">
            <ContentHeader title="Dataset Details" />
          </Row>
          <div className="alert alert-danger mt-4">
            <h4>Dataset Not Found in Catalog</h4>
            <p>
              The dataset you are trying to view could not be found. It may have been renamed or deleted.
            </p>
            <Button variant="primary" onClick={handleBackToList}>
              Go to Datasets List
            </Button>
          </div>
        </Container>
      </>
    );
  }

  // --- Data preparation ---
  const location = catalogDataset.location || {};
  const sourceCode = catalogDataset.source_code || {};
  const temporalInfo = catalogDataset.temporal_info || {};
  const spatialInfo = catalogDataset.spatial_info || {};
  const units = catalogDataset.units || [];
  const weatherYears = catalogDataset.weather_years || [];
  const modelYears = catalogDataset.model_years || [];
  const scenarios = catalogDataset.scenarios || [];
  const sensitivities = catalogDataset.sensitivities || [];
  const relevantLinks = catalogDataset.relevant_links || [];
  const description = Array.isArray(catalogDataset.description)
    ? catalogDataset.description.join("\n")
    : (catalogDataset.description || "");

  // Check if current user is the dataset creator
  const isDatasetCreator = currentUser?.email && catalogDataset.created_by?.email &&
                         currentUser.email.toLowerCase() === catalogDataset.created_by.email.toLowerCase();

  return (
    <>
      <NavbarSub navData={{ cdList: true, cdName: datasetName }} />
      <Container className="mainContent dataset-page-container" fluid>
        <Row className="w-100 mx-0">
          <ContentHeader
            title={catalogDataset.display_name || catalogDataset.name}
            headerButton={<CatalogDatasetContentHeaderButton isDisabled={!isDatasetCreator} />}
          />
        </Row>
        <Row className="mt-4">
          <Col xs={12}>
            {/* Basic Information Section */}
            <div className="dataset-section">
              <div className="dataset-section-header">
                <h4 className="dataset-section-title">Basic Information</h4>
              </div>
              <div className="dataset-section-content">
                <div className="dataset-field-row">
                  <div className="dataset-field-label">Dataset Name</div>
                  <div className="dataset-field-value">{catalogDataset.name || "—"}</div>
                </div>
                <div className="dataset-field-row">
                  <div className="dataset-field-label">Display Name</div>
                  <div className="dataset-field-value">{catalogDataset.display_name || "—"}</div>
                </div>
                <div className="dataset-field-row">
                  <div className="dataset-field-label">Description</div>
                  <div className="dataset-field-value dataset-field-value-pre">
                    {description || <span className="dataset-field-value-empty">No description provided</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            {Object.keys(location).length > 0 && (
              <div className="dataset-section">
                <div className="dataset-section-header">
                  <h4 className="dataset-section-title">Dataset Location</h4>
                </div>
                <div className="dataset-section-content">
                  {location.system_type && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">System Type</div>
                      <div className="dataset-field-value">{location.system_type}</div>
                    </div>
                  )}
                  {location.storage_path && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Storage Path</div>
                      <div className="dataset-field-value" style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                        {location.storage_path}
                      </div>
                    </div>
                  )}
                  {location.access_info && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Access Info</div>
                      <div className="dataset-field-value">{location.access_info}</div>
                    </div>
                  )}
                  {location.extra_note && location.extra_note.trim() !== "" && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Extra Note</div>
                      <div className="dataset-field-value">{location.extra_note}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Version & Format Section */}
            <div className="dataset-section">
              <div className="dataset-section-header">
                <h4 className="dataset-section-title">Version & Format</h4>
              </div>
              <div className="dataset-section-content">
                <div className="dataset-field-row">
                  <div className="dataset-field-label">Version</div>
                  <div className="dataset-field-value">
                    <Badge bg="info" className="dataset-type-badge">
                      {catalogDataset.version || "—"}
                    </Badge>
                  </div>
                </div>
                <div className="dataset-field-row">
                  <div className="dataset-field-label">Previous Version</div>
                  <div className="dataset-field-value">{catalogDataset.previous_version || "—"}</div>
                </div>
                <div className="dataset-field-row">
                  <div className="dataset-field-label">Data Format</div>
                  <div className="dataset-field-value">
                    <Badge bg="secondary" className="dataset-type-badge">
                      {catalogDataset.data_format || "—"}
                    </Badge>
                  </div>
                </div>
                <div className="dataset-field-row">
                  <div className="dataset-field-label">Hash Value</div>
                  <div className="dataset-field-value" style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                    {catalogDataset.hash_value || "—"}
                  </div>
                </div>
                {catalogDataset.resource_url && (
                  <div className="dataset-field-row">
                    <div className="dataset-field-label">Resource URL</div>
                    <div className="dataset-field-value">
                      <a href={catalogDataset.resource_url} target="_blank" rel="noopener noreferrer">
                        {catalogDataset.resource_url}
                      </a>
                    </div>
                  </div>
                )}
                {units.length > 0 && (
                  <div className="dataset-field-row">
                    <div className="dataset-field-label">Units</div>
                    <div className="dataset-field-value">
                      {units.map((unit, idx) => (
                        <Badge key={idx} bg="secondary" className="dataset-tag-badge">
                          {unit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {relevantLinks.length > 0 && (
                  <div className="dataset-field-row">
                    <div className="dataset-field-label">Relevant Links</div>
                    <div className="dataset-field-value">
                      <ul className="dataset-list">
                        {relevantLinks.map((link, idx) => (
                          <li key={idx} className="dataset-list-item">
                            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Temporal Information Section */}
            {(Object.keys(temporalInfo).length > 0 || weatherYears.length > 0 || modelYears.length > 0) && (
              <div className="dataset-section">
                <div className="dataset-section-header">
                  <h4 className="dataset-section-title">Temporal Information</h4>
                </div>
                <div className="dataset-section-content">
                  {weatherYears.length > 0 && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Weather Years</div>
                      <div className="dataset-field-value">
                        {weatherYears.map((year, idx) => (
                          <Badge key={idx} bg="secondary" className="dataset-tag-badge">
                            {year}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {modelYears.length > 0 && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Model Years</div>
                      <div className="dataset-field-value">
                        {modelYears.map((year, idx) => (
                          <Badge key={idx} bg="secondary" className="dataset-tag-badge">
                            {year}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {temporalInfo.start_date && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Start Date</div>
                      <div className="dataset-field-value">{temporalInfo.start_date}</div>
                    </div>
                  )}
                  {temporalInfo.end_date && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">End Date</div>
                      <div className="dataset-field-value">{temporalInfo.end_date}</div>
                    </div>
                  )}
                  {temporalInfo.resolution && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Temporal Resolution</div>
                      <div className="dataset-field-value">{temporalInfo.resolution}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spatial Information Section */}
            {Object.keys(spatialInfo).length > 0 && (
              <div className="dataset-section">
                <div className="dataset-section-header">
                  <h4 className="dataset-section-title">Spatial Information</h4>
                </div>
                <div className="dataset-section-content">
                  {spatialInfo.extent && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Spatial Extent</div>
                      <div className="dataset-field-value">{spatialInfo.extent}</div>
                    </div>
                  )}
                  {spatialInfo.resolution && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Spatial Resolution</div>
                      <div className="dataset-field-value">{spatialInfo.resolution}</div>
                    </div>
                  )}
                  {spatialInfo.coordinate_system && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Coordinate System</div>
                      <div className="dataset-field-value">{spatialInfo.coordinate_system}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scenarios & Sensitivities Section */}
            {(scenarios.length > 0 || sensitivities.length > 0) && (
              <div className="dataset-section">
                <div className="dataset-section-header">
                  <h4 className="dataset-section-title">Scenarios & Sensitivities</h4>
                </div>
                <div className="dataset-section-content">
                  {scenarios.length > 0 && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Scenarios</div>
                      <div className="dataset-field-value">
                        {scenarios.map((scenario, idx) => (
                          <Badge key={idx} bg="primary" className="dataset-tag-badge">
                            {scenario}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {sensitivities.length > 0 && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Sensitivities</div>
                      <div className="dataset-field-value">
                        {sensitivities.map((sensitivity, idx) => (
                          <Badge key={idx} bg="info" className="dataset-tag-badge">
                            {sensitivity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Source Code Section */}
            {Object.keys(sourceCode).length > 0 && sourceCode.location && (
              <div className="dataset-section">
                <div className="dataset-section-header">
                  <h4 className="dataset-section-title">Source Code Information</h4>
                </div>
                <div className="dataset-section-content">
                  <div className="dataset-field-row">
                    <div className="dataset-field-label">Location</div>
                    <div className="dataset-field-value" style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                      {sourceCode.location}
                    </div>
                  </div>
                  {sourceCode.branch && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Branch</div>
                      <div className="dataset-field-value">{sourceCode.branch}</div>
                    </div>
                  )}
                  {sourceCode.tag && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Tag</div>
                      <div className="dataset-field-value">{sourceCode.tag}</div>
                    </div>
                  )}
                  {sourceCode.image && (
                    <div className="dataset-field-row">
                      <div className="dataset-field-label">Container Image</div>
                      <div className="dataset-field-value" style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                        {sourceCode.image}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GetCatalogDatasetPage;
