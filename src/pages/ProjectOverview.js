import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import "./PageStyles.css"

import useAuthStore from "./stores/AuthStore";
import useProjectStore from "./stores/ProjectStore";
import useProjectRunStore from "./stores/ProjectRunStore";

import ProjectOverviewAssumptions from "./ProjectOverviewAssumptions";
import ProjectOverviewRequirements from "./ProjectOverviewRequirements";
import ProjectOverviewScenarios from "./ProjectOverviewScenarios";
import ProjectOverviewSchedule from "./ProjectOverviewSchedule";
import ProjectOverviewProjectRuns from "./ProjectOverviewProjectRuns";


const ProjectOverview = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken } = useAuthStore();
  const { getProject, isGettingProject, projectGetError, currentProject} = useProjectStore();
  const { getProjectRuns, projectRuns, isGettingProjectRuns} = useProjectRunStore();

  const projectName = currentProject.name;

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
    <Container className="mainContent" fluid>
      <Row className="text-start mt-4 mb-4">
        <Col>
          <h2 className='display-3 mt-4 mb-4'>[{currentProject.name}] {currentProject.title}</h2>
          <p className='mt-3'><b>Project Owner: {currentProject.owner.first_name} {currentProject.owner.last_name}</b></p>

          <p className="mt-4">{currentProject.description}</p>
          <hr></hr>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Row className="text-start mt-4">
            <h3 className="mb-4">Assumptions</h3>
            <Col>
              <ProjectOverviewAssumptions assumptions={currentProject.assumptions} />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4">Requirements</h3>
            <Col>
              <ProjectOverviewRequirements requirements={currentProject.requirements} />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4">Scenarios</h3>
            <Col>
              <ProjectOverviewScenarios scenarios={currentProject.scenarios} />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4">Schedule</h3>
            <Col>
              <ProjectOverviewSchedule scheduled_start={currentProject.scheduled_start} scheduled_end={currentProject.scheduled_end} />
            </Col>
          </Row>
        </Col>

        <Col md={4} className="border-start">
          <Row className="text-start mt-4">
            <h3 className="mb-4">Available Project Runs</h3>
            <Col>
              <ProjectOverviewProjectRuns projectRuns={projectRuns} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};


export default ProjectOverview;
