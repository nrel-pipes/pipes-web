import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Container, Table } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useListAccessGroupsQuery } from '../../hooks/useAccessGroupQuery';
import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from "../../stores/AuthStore";
import ContentHeader from '../Components/ContentHeader';

import "../Components/Cards.css";
import "../PageStyles.css";


const ListAccessGroupsPage = () => {
  const { checkAuthStatus } = useAuthStore();
  const navigate = useNavigate();

  // All hooks must be called before any conditional logic
  const { data: accessGroups = [], isLoading, error } = useListAccessGroupsQuery();

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

  const handleCreateAccessGroupClick = () => {
    navigate('/accessgroup/new');
  };

  const handleViewAccessGroupClick = (accessGroupName) => {
    navigate(`/accessgroup/${encodeURIComponent(accessGroupName)}`);
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
                {error.message || 'Failed to load access groups'}
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!accessGroups || accessGroups.length === 0) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <h3 className="empty-state-title">No Access Groups Found</h3>
              <p className="empty-state-description">
                You don't have any access groups yet. Get started by creating your first access group!
              </p>
              <div className="empty-state-actions">
                <button
                  className="create-button"
                  onClick={handleCreateAccessGroupClick}
                >
                  <Plus size={16} className="create-button-icon" />
                  Create Access Group
                </button>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  const AccessGroupCreationButton = () => (
    <button
      className="create-button"
      onClick={handleCreateAccessGroupClick}
    >
      <Plus size={16} className="create-button-icon" />
      Create Access Group
    </button>
  );

  return (
    <>
      <NavbarSub />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader
            title="Access Groups"
            cornerMark={accessGroups.length}
            headerButton={<AccessGroupCreationButton />}
          />
        </Row>

        {/* Access Groups Table */}
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
                          width: '30%'
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
                          width: '40%'
                        }}>
                          Description
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
                          Members
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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessGroups.map((accessGroup, index) => (
                        <tr key={accessGroup.id || accessGroup.name || index} style={{
                          borderBottom: '1px solid var(--bs-border-color)',
                          color: 'var(--bs-body-color)'
                        }}>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-dark)',
                            textAlign: 'left',
                            fontWeight: '500'
                          }}>
                            {accessGroup.name}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            color: 'var(--bs-gray-600)',
                            textAlign: 'left'
                          }}>
                            {accessGroup.description || 'No description provided'}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            border: 'none',
                            textAlign: 'left'
                          }}>
                            <span style={{
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--bs-border-radius-pill)',
                              backgroundColor: '#0079c2',
                              color: 'white',
                              display: 'inline-block',
                              fontWeight: '500'
                            }}>
                              {accessGroup.members ? accessGroup.members.length : 0} member{(accessGroup.members?.length || 0) !== 1 ? 's' : ''}
                            </span>
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
                                handleViewAccessGroupClick(accessGroup.name);
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
                              View Access Group Details
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

export default ListAccessGroupsPage;
