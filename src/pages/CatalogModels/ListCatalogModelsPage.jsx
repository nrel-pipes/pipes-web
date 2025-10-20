import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Badge, Card, Container, Table } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useGetCatalogModelsQuery } from '../../hooks/useCatalogModelQuery';
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from '../Components/ContentHeader';

import "../Components/Cards.css";
import "../PageStyles.css";
import CatalogModelListContentHeaderButton from "./Components/CatalogModelListContentHeaderButton";


const ListCatalogModelsPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();

  // All hooks must be called before any conditional logic
  const { data: modelsData = [], isLoading, error } = useGetCatalogModelsQuery();
  const catalogModels = modelsData;

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

  const handleCreateCatalogModelClick = () => {
    navigate('/catalogmodel/new');
  };

  const handleViewCatalogModelClick = (modelName) => {
    navigate(`/catalogmodel/${modelName}`);
  };

  // Helper function to get unique organizations from modeling team members
  const getUniqueOrganizations = (modelingTeam) => {
    if (!modelingTeam || !modelingTeam.members || modelingTeam.members.length === 0) {
      return [];
    }

    const organizations = modelingTeam.members
      .map(member => member.organization)
      .filter(org => org && org.trim() !== '');

    return [...new Set(organizations)];
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
                {error.message || 'Failed to load models'}
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!catalogModels || catalogModels.length === 0) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <Row className="w-100 mx-0">
            <ContentHeader title="Models" cornerMark={catalogModels.length}/>
          </Row>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-cpu-fill"></i>
              </div>
              <h3 className="empty-state-title">No Models Found in Catalog</h3>
              <p className="empty-state-description">
                You don't have any models yet. Get started by creating your first model!
              </p>
              <div className="empty-state-actions">
                <button
                  className="create-button"
                  onClick={handleCreateCatalogModelClick}
                >
                  <Plus size={16} className="create-button-icon" />
                  Create Model in Catalog
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
      <NavbarSub navData={{cmList: true}} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader
            title="Model Catalog"
            cornerMark={catalogModels.length}
            headerButton={<CatalogModelListContentHeaderButton/>}
          />
        </Row>

        {/* Models Table */}
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
                          width: '18%'
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
                          textAlign: 'left',
                          width: '10%'
                        }}>
                          Model Type
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'center',
                          width: '15%'
                        }}>
                          Modeling Team
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'center',
                          width: '15%'
                        }}>
                          Organizations
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
                          Created On
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {catalogModels.map((model, index) => (
                        <tr
                          key={[
                            model.name || index
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
                                handleViewCatalogModelClick(model.name);
                              }}
                              style={{
                                fontWeight: '500',
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
                              {model.name || 'Unnamed Model'}
                            </a>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-gray-600)',
                            textAlign: 'left'
                          }}>
                            {model.display_name || model.name || 'No display name'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'left'
                          }}>
                            <Badge bg="success" style={{
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--bs-border-radius-pill)'
                            }}>
                              {model.type || 'Model'}
                            </Badge>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            {model.modeling_team?.name || 'N/A'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            {(() => {
                              const orgs = getUniqueOrganizations(model.modeling_team);
                              if (orgs.length === 0) {
                                return 'N/A';
                              }
                              return orgs.join(', ');
                            })()}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            {model.created_at ? new Date(model.created_at).toLocaleDateString() : 'N/A'}
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

export default ListCatalogModelsPage;
