import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Container, Table } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useGetProjectsQuery } from "../../hooks/useProjectQuery";
import { useGetUserQuery } from '../../hooks/useUserQuery';
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";

import "../Components/Cards.css";
import "../PageStyles.css";
import ProjectCreationButton from "./Components/ProjectCreationButton";


const ListMyProjectsPage = () => {
  const { currentUser, setCurrentUser, getIdToken, checkAuthStatus } = useAuthStore();
  const { setEffectivePname } = useDataStore();
  const [userEmail, setUserEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        const idToken = await getIdToken();
        if (idToken) {
          const decodedIdToken = jwtDecode(idToken);
          const email = decodedIdToken.email.toLowerCase();
          setUserEmail(email);
        } else {
          console.error("ID token not available");
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, getIdToken, checkAuthStatus]);

  const { data: userData } = useGetUserQuery(userEmail);

  useEffect(() => {
    if (userData && !currentUser) {
      setCurrentUser(userData);
    }
  }, [userData, currentUser, setCurrentUser]);

  const {
    data: projectBasics = [],
    isLoading: isLoadingBasics,
    isError: isErrorBasics,
    error: errorBasics,
  } = useGetProjectsQuery();

  // Filter projects based on search term
  const filteredProjects = [...projectBasics].reverse().filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProjectClick = (event, project) => {
    event.preventDefault();
    setEffectivePname(project.name);
    navigate("/project/dashboard");
  };

  const handleCreateProjectClick = () => {
    navigate("/create-project");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to truncate description
  const truncateDescription = (description, maxLength = 80) => {
    if (!description) return 'No description provided';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const isLoadingProject = false;
  const isErrorProject = false;

  if (isLoadingBasics || isLoadingProject) {
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

  if (isErrorBasics || isErrorProject) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <p style={{ color: "red" }}>
                {isErrorBasics ? errorBasics.message : "Failed to load projects"}
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  if (!projectBasics || projectBasics.length === 0) {
    return (
      <>
        <NavbarSub/>
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
          <div className="empty-state-container">
            <div className="empty-state-card">
              <div className="empty-state-icon">
                <i className="bi bi-folder-plus"></i>
              </div>
              <h3 className="empty-state-title">No Projects Found</h3>
              <p className="empty-state-description">
                You don't have any projects yet. Get started with your first project!
              </p>
              <div className="empty-state-actions">
                <button
                  className="create-button"
                  onClick={handleCreateProjectClick}
                >
                  <Plus size={16} className="create-button-icon" />
                  Create Project via UI
                </button>
                <a
                  href="https://nrel-pipes.github.io/pipes-core/reference/workflows/initialize-a-project/"
                  target="_blank"
                  rel="noreferrer"
                  className="learn-more-button"
                >
                  <Plus size={16} className="create-button-icon" />
                  Create Project via CLI
                </a>
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarSub navData={{pList: true}} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="My Projects" cornerMark={filteredProjects.length} headerButton={<ProjectCreationButton />} />
        </Row>

        {/* Search bar */}
        <Row className="mb-4 mt-2 align-items-center">
          <Col md={6} lg={4} className="ms-0">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="Search projects by name, title, or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search projects"
                style={{ paddingRight: '40px' }}
              />
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6c757d'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </div>
            </div>
          </Col>
        </Row>

        {/* No projects found message when filtering returns no results */}
        {filteredProjects.length === 0 && searchTerm && (
          <div className="text-center my-5">
            <p className="text-muted">No projects found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Projects Table */}
        {filteredProjects.length > 0 && (
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
                            width: '15%'
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
                            Title
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
                            Owner
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
                        {filteredProjects.map((project, index) => (
                          <tr key={project.name || index} style={{
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
                              {project.name}
                            </td>
                            <td style={{
                              padding: '1rem 1.5rem',
                              border: 'none',
                              color: 'var(--bs-gray-600)',
                              textAlign: 'left'
                            }}>
                              {project.title || 'No title'}
                            </td>
                            <td style={{
                              padding: '1rem 1.5rem',
                              border: 'none',
                              color: 'var(--bs-gray-600)',
                              textAlign: 'left'
                            }} title={project.description || 'No description provided'}>
                              {truncateDescription(project.description)}
                            </td>
                            <td style={{
                              padding: '1rem 1.5rem',
                              border: 'none',
                              color: 'var(--bs-gray-600)',
                              textAlign: 'left'
                            }}>
                              {(() => {
                                if (currentUser?.first_name && currentUser?.last_name) {
                                  return `${currentUser.first_name} ${currentUser.last_name}`;
                                } else if (currentUser?.first_name) {
                                  return currentUser.first_name;
                                } else if (currentUser?.last_name) {
                                  return currentUser.last_name;
                                } else if (currentUser?.name) {
                                  return currentUser.name;
                                } else if (currentUser?.email) {
                                  return currentUser.email;
                                } else {
                                  return 'Unknown';
                                }
                              })()}
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
                                  handleProjectClick(e, project);
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
                                Go to Dashboard
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
        )}
      </Container>
    </>
  );
};

export default ListMyProjectsPage;
