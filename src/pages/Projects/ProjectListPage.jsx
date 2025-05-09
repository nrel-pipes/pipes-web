import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  // Reverse the order of projects to show latest first
  // TODO: Update API to return the creation time.
  const reversedProjects = [...projectBasics].reverse();

  // Pagination logic
  const totalPages = Math.ceil(reversedProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = reversedProjects.slice(indexOfFirstProject, indexOfLastProject);

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

  const handleCreateProjectClick = () => {
    navigate("/create-project");
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
              {/* <button variant="primary"
                className="create-button"
                onClick={handleCreateProjectClick}>
                  <Plus size={16} className="create-button-icon" />
                  Create Project on Web
              </button> */}
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
    <NavbarSub navData={{pAll: true}} />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row className="w-100 mx-0">
        {/* TODO: Could be enabled when we have a project creation page */}
        <ContentHeader title="Your Projects" showCreateProjectButton={false} cornerMark={projectBasics.length} />
      </Row>
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
