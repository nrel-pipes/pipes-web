import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import "./PageStyles.css"

import useAuthStore from "./stores/AuthStore";
import useProjectStore from "./stores/ProjectStore";
import useProjectRunStore from "./stores/ProjectRunStore";
import ProjectAssumptions from "./components/ProjectAssumptions";

const ProjectDetail = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, accessToken } = useAuthStore();
  const { getProject, isGettingProject, projectGetError, currentProject} = useProjectStore();
  const { getProjectRuns, projectRuns, isGettingProjectRuns} = useProjectRunStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (currentProject === null || currentProject.name !== projectName) {
      getProject(projectName, accessToken);
      getProjectRuns(projectName, accessToken);
    }

  }, [
    isLoggedIn,
    navigate,
    accessToken,
    getProject,
    projectName,
    currentProject,
    projectRuns,
    getProjectRuns,
  ]);

  if (isGettingProject || isGettingProjectRuns) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <FontAwesomeIcon icon={faSpinner} spin size="xl" />
          </Col>
        </Row>
      </Container>
    )
  }

  if (projectGetError) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{color: "red"}}>{projectGetError.message}</p>
          </Col>
        </Row>
      </Container>
    )
  }

  if ( !currentProject ) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p>Please go to <a href="/projects">projects</a> and select one of your project.</p>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="mainContent">
      <Row className="text-start mt-4 mb-4">
        <h2 className='display-3 mt-4 mb-4'>[{currentProject.name}] {currentProject.title}</h2>
        <p className='mt-3'><b>Project Owner: {currentProject.owner.first_name} {currentProject.owner.last_name}</b></p>
      </Row>

      <hr></hr>

      <Row className="text-start mt-4">
        <h3 className="mb-4">Assumptions</h3>
        <ProjectAssumptions assumptions={currentProject.assumptions} />
      </Row>
    </Container>
  );
};


export default ProjectDetail;
