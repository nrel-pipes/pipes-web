import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";

import { useGetProjectsQuery } from "../../hooks/useProjectQuery";
import { useGetUserQuery } from '../../hooks/useUserQuery';
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";

import "../Components/Cards.css";
import "../PageStyles.css";
import "./ProjectListPage.css";


const ProjectBasicsPage = () => {
  const { currentUser, setCurrentUser, getIdToken, checkAuthStatus } = useAuthStore();
  const { setEffectivePname } = useDataStore();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(3);
  const [userEmail, setUserEmail] = useState(null);
  // Add state for search term
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Validate authentication and check if user is logged in
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        // Get the ID token and extract email
        const idToken = await getIdToken();
        if (idToken) {
          const decodedIdToken = jwtDecode(idToken);
          const email = decodedIdToken.email.toLowerCase();
          setUserEmail(email);
        } else {
          // Handle missing token case
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

  // Filter projects based on search term before pagination
  const filteredProjects = [...projectBasics].reverse().filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic using filtered projects
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleProjectClick = (event, project) => {
    event.preventDefault();
    // Set the project in the store
    setEffectivePname(project.name);
    // Navigate to the project dashboard
    navigate("/project/dashboard");
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const isLoadingProject = false;
  const isErrorProject = false;
  const errorProject = null;

  // Custom styles for larger pagination buttons
  const paginationItemStyle = {
    fontSize: '1.1rem',
    minWidth: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const activePageStyle = {
    ...paginationItemStyle,
    backgroundColor: '#0079c2',
    borderColor: '#0079c2'
  };

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
              {isErrorBasics ? errorBasics.message : errorProject?.message}
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
              <button variant="primary"
                className="create-button"
                onClick={handleCreateProjectClick}>
                  <Plus size={16} className="create-button-icon" />
                  Create Project on Web
              </button>
              <a
                href="https://nrel-pipes.github.io/pipes-core/reference/workflows/initialize-a-project/"
                target="_blank"
                rel="noreferrer"
                className="learn-more-button"
              >
                Create project via CLI
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
        <ContentHeader title="Your Projects" cornerMark={filteredProjects.length} />
      </Row>

      {/* Search bar and Create Project button */}
      <Row className="mb-4 mt-2 align-items-center">
        <Col md={6} lg={4} className="ms-0">
          <div className="search-container">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Search projects by name or title..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search projects"
            />
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </div>
          </div>
        </Col>
        <Col className="d-flex justify-content-end">
          <button
            className="btn btn-primary px-4 py-2"
            onClick={handleCreateProjectClick}
            style={{
              backgroundColor: '#0079c2',
              borderColor: '#0079c2',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            <Plus size={18} className="me-2" />
            Create Project
          </button>
        </Col>
      </Row>

      {/* No projects found message when filtering returns no results */}
      {filteredProjects.length === 0 && searchTerm && (
        <div className="text-center my-5">
          <p className="text-muted">No projects found matching "{searchTerm}"</p>
        </div>
      )}

      <div className="project-list-container">
        {currentProjects.map((project) => (
          <div key={project.name} className="project-column">
            <div className="project-content">
              <div className="project-field title-field">
                <span className="field-value project-title">{project.title}</span>
              </div>
              <div className="project-field name-field">
                <span className="field-label">Name:</span>
                <span className="field-value project-name">{project.name}</span>
              </div>
              <div className="project-field">
                <p className="project-description"><span className="field-label">Description:</span>{project.description}</p>
              </div>
              <div className="project-footer">
                <button
                  className="dashboard-button"
                  onClick={(e) => handleProjectClick(e, project)}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center mt-4 mb-5">
          <Pagination size="lg">
            <Pagination.Prev
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={paginationItemStyle}
            >
              <ChevronLeft size={20} />
            </Pagination.Prev>

            {/* First page */}
            {currentPage > 2 && (
              <Pagination.Item
                onClick={() => handlePageChange(1)}
                style={paginationItemStyle}
              >1</Pagination.Item>
            )}

            {/* Ellipsis if needed */}
            {currentPage > 3 && <Pagination.Ellipsis disabled style={paginationItemStyle} />}

            {/* Page before current */}
            {currentPage > 1 && (
              <Pagination.Item
                onClick={() => handlePageChange(currentPage - 1)}
                style={paginationItemStyle}
              >
                {currentPage - 1}
              </Pagination.Item>
            )}

            {/* Current page */}
            <Pagination.Item
              active
              style={activePageStyle}
            >
              {currentPage}
            </Pagination.Item>

            {/* Page after current */}
            {currentPage < totalPages && (
              <Pagination.Item
                onClick={() => handlePageChange(currentPage + 1)}
                style={paginationItemStyle}
              >
                {currentPage + 1}
              </Pagination.Item>
            )}

            {/* Ellipsis if needed */}
            {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled style={paginationItemStyle} />}

            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <Pagination.Item
                onClick={() => handlePageChange(totalPages)}
                style={paginationItemStyle}
              >
                {totalPages}
              </Pagination.Item>
            )}

            <Pagination.Next
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={paginationItemStyle}
            >
              <ChevronRight size={20} />
            </Pagination.Next>
          </Pagination>
        </div>
      )}
    </Container>
    </>
  );
};

export default ProjectBasicsPage;
