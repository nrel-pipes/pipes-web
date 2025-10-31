import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Badge, Card, Container, Table } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useGetCatalogDatasetsQuery } from '../../hooks/useCatalogDatasetQuery';
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from '../Components/ContentHeader';

import "../Components/Cards.css";
import "../PageStyles.css";
import CatalogDatasetListContentHeaderButton from "./Components/CatalogDatasetListContentHeaderButton";


const ListCatalogDatasetPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();

  // All hooks must be called before any conditional logic
  const { data: datasetsData = [], isLoading, error } = useGetCatalogDatasetsQuery();
  const catalogDatasets = datasetsData;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
          return;
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  const handleCreateCatalogDatasetClick = () => {
    navigate('/catalogdataset/new');
  };

  const handleViewCatalogDatasetClick = (datasetName) => {
    navigate(`/catalogdataset/${datasetName}`);
  };

  if (isLoading) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <FontAwesomeIcon icon={faSpinner} spin size="xl" />
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <p style={{ color: "red" }}>
                {error.message || 'Failed to load datasets'}
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!catalogDatasets || catalogDatasets.length === 0) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <Row className="w-100 mx-0">
            <ContentHeader title="Datasets" cornerMark={catalogDatasets.length}/>
          </Row>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-database-fill"></i>
              </div>
              <h3 className="empty-state-title">No Datasets Found in Catalog</h3>
              <p className="empty-state-description">
                You don't have any datasets yet. Get started by creating your first dataset!
              </p>
              <div className="empty-state-actions">
                <button
                  className="create-button"
                  onClick={handleCreateCatalogDatasetClick}
                >
                  <Plus size={16} className="create-button-icon" />
                  Create Dataset in Catalog
                </button>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{cdList: true}} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader
            title="Dataset Catalog"
            cornerMark={catalogDatasets.length}
            headerButton={<CatalogDatasetListContentHeaderButton/>}
          />
        </Row>

        {/* Datasets Table */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body style={{ padding: 0 }}>
                <div className="table-responsive">
                  <Table className="table table-striped table-hover mb-0" style={{ fontSize: '1rem' }}>
                    <thead style={{ backgroundColor: 'var(--bs-gray-100)' }}>
                      <tr style={{ borderTop: '3px solid #0071b8' }}>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '20%'
                        }}>
                          Name
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '20%'
                        }}>
                          Display Name
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'center',
                          width: '10%'
                        }}>
                          Version
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'center',
                          width: '12%'
                        }}>
                          Format
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '25%'
                        }}>
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {catalogDatasets.map((dataset, index) => (
                        <tr
                          key={[
                            dataset.name || index
                          ].join(':')}
                          style={{
                            borderBottom: '1px solid var(--bs-border-color)',
                            color: 'var(--bs-body-color)'
                          }}
                        >
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-dark)',
                            textAlign: 'left',
                            fontWeight: '500'
                          }}>
                            <a
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewCatalogDatasetClick(dataset.name);
                              }}
                              style={{
                                fontWeight: '700',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--bs-border-radius)',
                                fontSize: '0.875rem',
                                color: '#0079c2',
                                borderColor: '#0079c2',
                                cursor: 'pointer',
                                textDecoration: 'none'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.textDecoration = 'underline';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.textDecoration = 'none';
                              }}
                            >
                              {dataset.name || 'Unnamed Dataset'}
                            </a>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-gray-600)',
                            textAlign: 'left'
                          }}>
                            {dataset.display_name || dataset.name || 'No display name'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            <Badge bg="info" style={{
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--bs-border-radius-pill)'
                            }}>
                              {dataset.version || 'N/A'}
                            </Badge>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            <Badge bg="secondary" style={{
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--bs-border-radius-pill)'
                            }}>
                              {dataset.data_format || 'N/A'}
                            </Badge>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'left',
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {dataset.location?.path || dataset.location?.url || dataset.resource_url || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ListCatalogDatasetPage;
