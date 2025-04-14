import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { useProjectBasicsQuery } from "../../hooks/useProjectQuery";
import useProjectStore from "../../stores/ProjectStore";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";

import "../Components/Cards.css";
import "../PageStyles.css";
import "./ProjectBasicsPage.css";


const ProjectBasicsPage = () => {
  const { setEffectiveProject } = useProjectStore();

  const navigate = useNavigate();

  const {
    data: projectBasics = [],
    isLoading: isLoadingBasics,
    isError: isErrorBasics,
    error: errorBasics,
  } = useProjectBasicsQuery();

  const handleProjectClick = (event, project) => {
    event.preventDefault();
    // Set the project in the store
    setEffectiveProject(project.name);
    // Navigate to the project dashboard
    navigate("/project");
  };

  const handleCreateProjectClick = () => {
    navigate("/create-project");
  };

  const isLoadingProject = false;
  const isErrorProject = false;
  const errorProject = null;

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
    <NavbarSub navData={{pAll: true}} />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row className="w-100 mx-0">
        <ContentHeader title="Your Projects" showCreateProjectButton={true} cornerMark={projectBasics.length} />
      </Row>
      <div className="project-list-container">
        {projectBasics.map((project) => (
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
    </Container>
    </>
  );
};

export default ProjectBasicsPage;
