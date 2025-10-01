import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Badge, Card, Container, Table } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useGetModelsQuery } from '../../hooks/useModelQuery';
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from '../Components/ContentHeader';

import "../Components/Cards.css";
import "../PageStyles.css";


const ListModelsPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get("P");
  const projectRunName = searchParams.get("p");

  // All hooks must be called before any conditional logic
  const { data: modelsData = [], isLoading, error } = useGetModelsQuery(projectName);

  // Sort models by project and project run
  const models = modelsData.sort((a, b) => {
    const projectA = a.context?.project || '';
    const projectB = b.context?.project || '';
    const projectRunA = a.context?.projectrun || '';
    const projectRunB = b.context?.projectrun || '';

    // First sort by project
    if (projectA !== projectB) {
      return projectA.localeCompare(projectB);
    }

    // Then sort by project run
    return projectRunA.localeCompare(projectRunB);
  });

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

  const handleCreateModelClick = () => {
    navigate("/model/startnew?P=" + encodeURIComponent(projectName) + "&p=" + encodeURIComponent(projectRunName));
  };

  const handleViewModelClick = (projectRunName, modelName) => {
    navigate(`/model/${modelName}?P=${encodeURIComponent(projectName)}&p=${encodeURIComponent(projectRunName)}`);
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

  if (!models || models.length === 0) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <Row className="w-100 mx-0">
            <ContentHeader title="Models" cornerMark={models.length}/>
          </Row>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-cpu-fill"></i>
              </div>
              <h3 className="empty-state-title">No Models Found</h3>
              <p className="empty-state-description">
                You don't have any models yet. Get started by creating your first model!
              </p>
              <div className="empty-state-actions">
                <button
                  className="create-button"
                  onClick={handleCreateModelClick}
                >
                  <Plus size={16} className="create-button-icon" />
                  Create Model
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
      <NavbarSub navData={{pList: true, pName: projectName, mList: true}} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader
            title="Models"
            cornerMark={models.length}
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
                          width: '25%'
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
                          width: '15%'
                        }}>
                          Model Type
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '15%'
                        }}>
                          Project
                        </th>
                        <th scope="col" style={{
                          padding: '1.5rem 1.5rem',
                          fontWeight: '700',
                          color: 'var(--bs-gray-700)',
                          border: 'none',
                          borderBottom: '1px solid var(--bs-border-color)',
                          textAlign: 'left',
                          width: '15%'
                        }}>
                          Project Run
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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {models.map((model, index) => (
                        <tr
                          key={[
                            model.context?.project || '',
                            model.context?.projectrun || '',
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
                            {model.name || 'Unnamed Model'}
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
                            color: 'var(--bs-gray-600)',
                            textAlign: 'left'
                          }}>
                            {projectName || 'N/A'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-gray-600)',
                            textAlign: 'left'
                          }}>
                            {model.context.projectrun || 'N/A'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'center'
                          }}>
                            <button
                              className="btn btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewModelClick(model.context.projectrun, model.name);
                              }}
                              style={{
                                fontWeight: '500',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--bs-border-radius)',
                                fontSize: '0.875rem',
                                backgroundColor: '#0079c2',
                                borderColor: '#0079c2',
                                color: 'white'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#005a94';
                                e.target.style.borderColor = '#005a94';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#0079c2';
                                e.target.style.borderColor = '#0079c2';
                              }}
                            >
                              View Model Details
                            </button>
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

export default ListModelsPage;
