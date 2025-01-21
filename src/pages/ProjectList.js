import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plus } from "lucide-react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { getProjectBasics } from "./api/ProjectAPI";
import "./PageStyles.css";
import "./ProjectList.css";
import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";
import PageTitle from "../components/pageTitle";
import UpcomingMilestones from "../components/upcomingMilestones";


const ProjectList = () => {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  // React Query: Fetch project basics
  const {
    data: projectBasics = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["projectBasics"],
    queryFn: getProjectBasics,
    enabled: isLoggedIn,
    retry: 3
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    return;
  }, [isLoggedIn, navigate]);

  // handlers
  const handleProjectClick = (event) => {
    event.preventDefault();
    navigate(`/overview`);
  };
  const handleCreateProjectClick = (event) => {
    event.preventDefault();
    navigate(`/create-project`);
  };

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
            <p style={{ color: "red" }}>{error.message}</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!projectBasics || projectBasics.length === 0) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{ fontSize: "16px" }}>
              You currently do not have your own projects! Learn more about how
              to&nbsp;
              <a
                href="https://nrel-pipes.github.io/pipes-core/command_line.html#project"
                target="_blank"
                rel="noreferrer"
              >
                create project
              </a>{" "}
              in PIPES.
            </p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mainContent">
      <Row>
        <PageTitle title="Upcoming Milestones" />
      </Row>
      <Row>
        <UpcomingMilestones projectBasics={projectBasics} />
      </Row>
      <Row>
        <PageTitle title="Your Projects" />
      </Row>
      <div className="d-flex flex-column align-items-center">
        {projectBasics.map((project) => (
          <Row className="mb-4 w-100" key={project.name}>
            <Col sm={12} className="d-flex justify-content-center">
              <div
                className="card"
                style={{ maxWidth: "1000px", width: "100%" }}
              >
                <h5
                  className="card-header"
                  style={{
                    backgroundColor: "rgb(71, 148, 218)",
                    fontSize: "1.5rem",
                    padding: "15px",
                    color: "white",
                  }}
                >
                  {project.name}
                </h5>
                <div className="card-body text-left">{project.description}</div>

                <div style={{ padding: "0 0 15px 15px" }}>
                  <Button
                    variant="outline-primary"
                    onClick={(e) => handleProjectClick(e, project)}
                  >
                    Go to Project &gt;&gt;
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        ))}

        <Row className="mb-4 w-100" key="create-project">
          <Col sm={12} className="d-flex justify-content-center">
            <Card
              style={{
                maxWidth: "1000px",
                width: "100%",
                margin: "20px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              className="create-project-card"
              onClick={(e) => handleCreateProjectClick(e)}
            >
              <Card.Body className="bg-light text-start d-flex flex-column align-items-center">
                <Card.Title className="mt-3 mb-3 text-center">
                  Create Project
                </Card.Title>
                <Plus size={48} className="mb-4 plus-icon" />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>{" "}
    </Container>
  );
}


const ProjectList2 = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();

  const {
    projectBasics,
    getProjectBasics,
    isGettingProjectBasics,
    projectBasicsGetError,
    getProject,
  } = useDataStore();
  const handleProjectClick = (event, project) => {
    event.preventDefault();

    getProject(project.name, accessToken);
    navigate(`/overview`);
  };
  const handleCreateProjectClick = (event) => {
    event.preventDefault();
    navigate(`/create-project`);
  };

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
    getProjectBasics(accessToken);
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  if (isGettingProjectBasics) {
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

  if (projectBasicsGetError) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{ color: "red" }}>{projectBasicsGetError.message}</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!projectBasics || projectBasics.length === 0) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{ fontSize: "16px" }}>
              You currently do not have your own projects! Learn more about how
              to&nbsp;
              <a
                href="https://nrel-pipes.github.io/pipes-core/command_line.html#project"
                target="_blank"
                rel="noreferrer"
              >
                create project
              </a>{" "}
              in PIPES.
            </p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mainContent">
      <Row>
        <PageTitle title="Upcoming Milestones" />
      </Row>
      <Row>
        <UpcomingMilestones projectBasics={projectBasics} />
      </Row>
      <Row>
        <PageTitle title="Your Projects" />
      </Row>
      <div className="d-flex flex-column align-items-center">
        {projectBasics.map((project) => (
          <Row className="mb-4 w-100" key={project.name}>
            <Col sm={12} className="d-flex justify-content-center">
              <div
                className="card"
                style={{ maxWidth: "1000px", width: "100%" }}
              >
                <h5
                  className="card-header"
                  style={{
                    backgroundColor: "rgb(71, 148, 218)",
                    fontSize: "1.5rem",
                    padding: "15px",
                    color: "white",
                  }}
                >
                  {project.name}
                </h5>
                <div className="card-body text-left">{project.description}</div>

                <div style={{ padding: "0 0 15px 15px" }}>
                  <Button
                    variant="outline-primary"
                    onClick={(e) => handleProjectClick(e, project)}
                  >
                    Go to Project &gt;&gt;
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        ))}

        <Row className="mb-4 w-100" key="create-project">
          <Col sm={12} className="d-flex justify-content-center">
            <Card
              style={{
                maxWidth: "1000px",
                width: "100%",
                margin: "20px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              className="create-project-card"
              onClick={(e) => handleCreateProjectClick(e)}
            >
              <Card.Body className="bg-light text-start d-flex flex-column align-items-center">
                <Card.Title className="mt-3 mb-3 text-center">
                  Create Project
                </Card.Title>
                <Plus size={48} className="mb-4 plus-icon" />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>{" "}
    </Container>
  );
};

export default ProjectList;
