import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pencil, Settings, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Badge, Card, Container, Dropdown } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate, useParams } from "react-router-dom";

import { useGetAccessGroupQuery } from '../../hooks/useAccessGroupQuery';
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from '../Components/ContentHeader';

import "../Components/Cards.css";
import "../PageStyles.css";

const GetAccessGroupPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();
  const { accessGroupName } = useParams();

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

  // Only make the query if we have accessGroupName
  const { data: accessGroup, isLoading, error } = useGetAccessGroupQuery(
    accessGroupName,
    {
      enabled: !!accessGroupName,
      retry: false, // Don't retry at all to prevent repeated calls
      staleTime: 30000, // Consider data fresh for 30 seconds
      refetchOnMount: false, // Don't refetch when component mounts
      refetchOnWindowFocus: false // Don't refetch when window gains focus
    }
  );

  const handleBackToAccessGroups = () => {
    navigate('/accessgroups');
  };

  // Show loading while redirecting if no accessGroupName
  if (!accessGroupName) {
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
                {error.message || 'Failed to load access group details'}
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!accessGroup) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <h3 className="empty-state-title">Access Group Not Found</h3>
              <p className="empty-state-description">
                The requested access group could not be found.
              </p>
              <div className="empty-state-actions">
                <button
                  className="create-button"
                  onClick={handleBackToAccessGroups}
                >
                  Back to Access Groups
                </button>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  const AccessGroupContentHeaderButton = () => {
    const handleUpdateAccessGroup = () => {
      navigate(`/accessgroup/${encodeURIComponent(accessGroupName)}/update`);
    };

    const handleDeleteAccessGroup = () => {
      navigate(`/accessgroup/${encodeURIComponent(accessGroupName)}/delete`);
    };

    return (
      <div className="content-header-actions d-flex justify-content-end">
        <button
          className="btn create-run-button me-3"
          style={{
            backgroundColor: 'rgb(71, 148, 218)',
            color: 'white',
            fontWeight: 'bold',
            height: '50px',
          }}
          onMouseDown={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
          onMouseUp={(e) => e.currentTarget.style.color = 'white'}
          onClick={handleBackToAccessGroups}
        >
          ← Back to Access Groups
        </button>
        <Dropdown>
          <Dropdown.Toggle
            variant="primary"
            className="px-4 py-3 actions-dropdown-toggle"
          >
            <Settings size={16} className="update-button-icon me-1 actions-dropdown-icon" />
            Actions
          </Dropdown.Toggle>

          <Dropdown.Menu className="actions-dropdown-menu">
            <Dropdown.Item
              onClick={handleUpdateAccessGroup}
              className="d-flex align-items-center dropdown-item-update"
            >
              <Pencil size={16} className="me-2" />
              Update Access Group
            </Dropdown.Item>
            <hr className="dropdown-divider" />
            <Dropdown.Item
              onClick={handleDeleteAccessGroup}
              className="d-flex align-items-center dropdown-item-delete"
            >
              <Trash2 size={16} className="me-2" />
              Delete Access Group
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  return (
    <>
      <NavbarSub />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title={`Access Group: ${accessGroup.name}`} headerButton={<AccessGroupContentHeaderButton />} />
        </Row>

        {/* Access Group Information Banner */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body style={{ padding: '0' }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderBottom: '1px solid #e9ecef',
                  textAlign: 'left'
                }}>
                  <h2 style={{ color: '#2c3e50', margin: 0, fontWeight: '600' }}>
                    Access Group Details
                  </h2>
                </div>
                <div style={{ padding: '1.5rem', textAlign: 'left' }}>
                  <Row className="mb-3">
                    <Col md={3} style={{ textAlign: 'left' }}>
                      <strong style={{ color: '#495057' }}>Name:</strong>
                    </Col>
                    <Col md={9} style={{ textAlign: 'left' }}>
                      <span style={{ color: '#2c3e50' }}>{accessGroup.name}</span>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3} style={{ textAlign: 'left' }}>
                      <strong style={{ color: '#495057' }}>Description:</strong>
                    </Col>
                    <Col md={9} style={{ textAlign: 'left' }}>
                      <span style={{ color: '#2c3e50' }}>
                        {accessGroup.description || 'No description provided'}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3} style={{ textAlign: 'left' }}>
                      <strong style={{ color: '#495057' }}>Group Size:</strong>
                    </Col>
                    <Col md={9} style={{ textAlign: 'left' }}>
                      <span style={{
                        fontSize: '0.9rem',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--bs-border-radius-pill)',
                        backgroundColor: '#0079c2',
                        color: 'white',
                        display: 'inline-block',
                        fontWeight: '500'
                      }}>
                        {accessGroup.members ? accessGroup.members.length : 0} member{(accessGroup.members?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </Col>
                  </Row>
                  {accessGroup.created_date && (
                    <Row>
                      <Col md={3} style={{ textAlign: 'left' }}>
                        <strong style={{ color: '#495057' }}>Created:</strong>
                      </Col>
                      <Col md={9} style={{ textAlign: 'left' }}>
                        <span style={{ color: '#2c3e50' }}>
                          {new Date(accessGroup.created_date).toLocaleDateString()}
                        </span>
                      </Col>
                    </Row>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Access Group Members Section */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header style={{
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #e9ecef',
                padding: '1.5rem'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                    Members
                  </h4>
                  <span style={{
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--bs-border-radius-pill)',
                    backgroundColor: '#0079c2',
                    color: 'white',
                    display: 'inline-block',
                    fontWeight: '500'
                  }}>
                    {accessGroup.members ? accessGroup.members.length : 0} total
                  </span>
                </div>
              </Card.Header>
              <Card.Body style={{ padding: 0 }}>
                {accessGroup.members && accessGroup.members.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0" style={{ fontSize: '1rem' }}>
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th style={{
                            padding: '1rem 1.5rem',
                            fontWeight: '600',
                            color: '#495057',
                            border: 'none',
                            borderBottom: '1px solid #dee2e6',
                            textAlign: 'left',
                            width: '25%'
                          }}>
                            Email
                          </th>
                          <th style={{
                            padding: '1rem 1.5rem',
                            fontWeight: '600',
                            color: '#495057',
                            border: 'none',
                            borderBottom: '1px solid #dee2e6',
                            textAlign: 'left',
                            width: '50%'
                          }}>
                            Name
                          </th>
                          <th style={{
                            padding: '1rem 1.5rem',
                            fontWeight: '600',
                            color: '#495057',
                            border: 'none',
                            borderBottom: '1px solid #dee2e6',
                            textAlign: 'left',
                            width: '25%'
                          }}>
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessGroup.members.map((member, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #f1f3f5' }}>
                            <td style={{
                              padding: '1.25rem 1.5rem',
                              border: 'none',
                              color: '#6c757d',
                              textAlign: 'left'
                            }}>
                              {member.email || 'No email provided'}
                            </td>
                            <td style={{
                              padding: '1.25rem 1.5rem',
                              border: 'none',
                              color: '#2c3e50',
                              textAlign: 'left'
                            }}>
                              {member.first_name || member.last_name
                                ? `${member.first_name || ''} ${member.last_name || ''}`.trim()
                                : 'No name provided'}
                            </td>
                            <td style={{
                              padding: '1.25rem 1.5rem',
                              border: 'none',
                              textAlign: 'left'
                            }}>
                              {member.role ? (
                                <Badge bg="secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                  {member.role}
                                </Badge>
                              ) : (
                                <span style={{ color: '#6c757d', fontStyle: 'italic' }}>No role assigned</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{
                    padding: '4rem',
                    textAlign: 'center',
                    color: '#6c757d',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <i className="bi bi-people" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                    <h5>No Members</h5>
                    <p>This access group doesn't have any members yet.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GetAccessGroupPage;
