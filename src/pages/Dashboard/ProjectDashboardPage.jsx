import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "../PageStyles.css";
import "./ProjectDashboardPage.css";

import useAuthStore from "../../stores/AuthStore";

import NavbarSub from "../../layouts/NavbarSub";
import AssumptionsComponent from "./Components/AssumptionsComponent";
import ProjectRunsComponent from "./Components/ProjectRunsComponent";
import RequirementsComponent from "./Components/RequirementsComponent";
import ScenariosComponent from "./Components/ScenariosComponent";
import ScheduleComponent from "./Components/ScheduleComponent";

import { useGetProjectRunsQuery } from "../../hooks/useProjectRunQuery";

import ContentHeader from "../Components/ContentHeader";
import ProjectContentHeaderButton from "./Components/ProjectContentHeaderButton";

import { useGetProjectQuery } from "../../hooks/useProjectQuery";


const ProjectDashboardPage = () => {
  const navigate = useNavigate();
  const { checkAuthStatus, currentUser } = useAuthStore();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectName = searchParams.get("P");

  // Helper function to get formatted owner name
  const getOwnerDisplayName = (owner) => {
    if (!owner) return 'N/A';

    // If both first_name and last_name exist and are not empty
    const firstName = owner.first_name?.trim();
    const lastName = owner.last_name?.trim();

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    // If only one name exists
    if (firstName) return firstName;
    if (lastName) return lastName;

    // If no names exist, extract from email
    if (owner.email) {
      const emailPrefix = owner.email.split('@')[0];

      if (emailPrefix.includes('.')) {
        const nameParts = emailPrefix.split('.');
        const extractedFirstName = nameParts[0];
        const extractedLastName = nameParts[1];

        // Title case the names
        const titleFirst = extractedFirstName.charAt(0).toUpperCase() + extractedFirstName.slice(1).toLowerCase();
        const titleLast = extractedLastName.charAt(0).toUpperCase() + extractedLastName.slice(1).toLowerCase();

        return `${titleFirst} ${titleLast}`;
      } else {
        const titleName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).toLowerCase();
        return titleName;
      }
    }

    return 'N/A';
  };

  // Auth check effect - updated to match ProjectListPage pattern
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Validate authentication and check if user is logged in
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);

  // fetch project data
  const {
    data: project,
    isLoading,
    isError,
    error
  } = useGetProjectQuery(projectName);

  // fetch project runs data
  const {
    data: projectRuns,
    isLoading: isLoadingRuns,
    isError: isErrorRuns,
    error: errorRuns,
    refetch: refetchRuns
  } = useGetProjectRunsQuery(projectName)

  // Add effect to refetch when returning to the page
  useEffect(() => {
    if (project?.name && isErrorRuns) {
      refetchRuns();
    }
  }, [project, isErrorRuns, refetchRuns]);

  if (isLoading) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <FontAwesomeIcon icon={faSpinner} spin size="xl" />
          </Col>
        </Row>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{ color: "red" }}>
              {error?.message || "Error loading data."}
            </p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p>Project not found.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  // NOTE: Hard-coded. Check if delete should be disabled for pipes101 project
  // Allow deletion if user is a superuser, otherwise disable for pipes101
  const isContentHeaderButtonDisabled = project.name === 'pipes101' && currentUser?.is_superuser !== true;

  return (
    <>
      <NavbarSub navData={{ pList: true, pName: projectName }} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Project Dashboard" headerButton={<ProjectContentHeaderButton projectName={project.name} isDisabled={isContentHeaderButtonDisabled} />} />
        </Row>
        <Row className="dashboard-header mb-4">
          <Col lg={8}>
            <div className="mt-4 mb-2 text-start">
              <h1 className="project-title">{project.title}</h1>

              <div className="project-metadata mt-3">
                <div className="metadata-item">
                  <span className="metadata-label">Name:</span>
                  <span className="metadata-value">
                    <label className="project-name">{project.name}</label>
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Owner:</span>
                  <span className="metadata-value mb-2">
                    <label style={{ color: "green"}}>
                      {getOwnerDisplayName(project.owner)}
                    </label>
                  </span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Team{project.teams?.length !== 1 ? "s" : ""}:</span>
                  <span className="metadata-value">
                    {project.teams && project.teams.length > 0 ? (
                      project.teams.map((team, idx) => (
                        <Badge
                          key={idx}
                          bg="light"
                          text="primary"
                          className="team-badge me-2 mb-2"
                        >
                          {typeof team === 'string' ? team : (
                            team.name || team.id || JSON.stringify(team)
                          )}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted">None assigned</span>
                    )}
                  </span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Description:</span>
                  <span className="metadata-value">{project.description}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <Card className="dashboard-summary-card mt-4">
              <Card.Body>
                <Card.Title as="h5" className="summary-title">Summary</Card.Title>
                <ScheduleComponent
                  scheduled_start={project.scheduled_start.split("T")[0]}
                  scheduled_end={project.scheduled_end.split("T")[0]}
                />
                <hr />
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Teams</span>
                  <Badge bg="primary" pill>{project.teams?.length || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Requirements</span>
                  <Badge bg="success" pill>
                    {Object.keys(project.requirements || {}).length}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Assumptions</span>
                  <Badge bg="info" pill>{project.assumptions?.length || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Sensitivities</span>
                  <Badge bg="info" pill>{project.sensitivities?.length || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Scenarios</span>
                  <Badge bg="warning" text="dark" pill>{project.scenarios?.length || 0}</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span>Project Runs</span>
                  <Badge bg="secondary" pill>{projectRuns?.length || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Project Runs - Highlighted as important activities */}
          <Col lg={12} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Activities</h3>
            </div>
            <Card className="dashboard-card highlight-card">
              <Card.Header className="d-flex justify-content-between align-items-center highlight-header">
                <h4 className="smallCaps mb-0">Project Runs</h4>
                <Badge bg="primary" pill>{projectRuns?.length || 0}</Badge>
              </Card.Header>
              <Card.Body className="dashboard-card-body">
                <ProjectRunsComponent
                  projectRuns={projectRuns || []}
                  isLoading={isLoadingRuns}
                  isError={isErrorRuns}
                  error={errorRuns}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Project Attributes Group */}
          <Col lg={12}>
            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Attributes</h3>
            </div>
            <Row>
              {/* Requirements Section */}
              <Col md={12} lg={12} className="mb-4">
                <Card className="dashboard-card attribute-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="smallCaps mb-0">Requirements</h4>
                    <Badge bg="success">
                      {Object.keys(project.requirements || {}).length}
                    </Badge>
                  </Card.Header>
                  <Card.Body className="dashboard-card-body">
                    <RequirementsComponent
                      requirements={project.requirements || {}}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              {/* Assumptions Section */}
              <Col md={12} lg={6} className="mb-4">
                <Card className="dashboard-card attribute-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="smallCaps mb-0">Assumptions</h4>
                    <Badge bg="info">{project.assumptions?.length || 0}</Badge>
                  </Card.Header>
                  <Card.Body className="dashboard-card-body">
                    <AssumptionsComponent
                      assumptions={project.assumptions || []}
                    />
                  </Card.Body>
                </Card>
              </Col>
              {/* Sensitivity Section */}
              <Col md={12} lg={6} className="mb-4">
                <Card className="dashboard-card attribute-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="smallCaps mb-0">Sensitivity</h4>
                    <Badge bg="info">{project.sensitivities?.length || 0}</Badge>
                  </Card.Header>
                  <Card.Body className="dashboard-card-body">
                    <div className="sensitivity-content">
                      {project.sensitivities && project.sensitivities.length > 0 ? (
                        <table className="table table-sm table-bordered" style={{ background: "#fff", fontSize: "0.98em" }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: "left" }}>Name</th>
                              <th style={{ textAlign: "left" }}>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {project.sensitivities.map((item, index) => (
                              <tr key={index}>
                                <td style={{ textAlign: "left", fontWeight: 500 }}>{item.name}</td>
                                <td style={{ textAlign: "left" }}>{item.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <span className="text-muted">No sensitivity data available</span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

            </Row>
            <Row>
              {/* Scenarios Section */}
              <Col md={12} lg={12} className="mb-4">
                <Card className="dashboard-card attribute-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="smallCaps mb-0">Scenarios</h4>
                    <Badge bg="warning" text="dark">
                      {project.scenarios?.length || 0}
                    </Badge>
                  </Card.Header>
                  <Card.Body className="dashboard-card-body">
                    <ScenariosComponent scenarios={project.scenarios || []} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

      </Container>
    </>
  );
};

export default ProjectDashboardPage;
