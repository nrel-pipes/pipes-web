import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import "./PageStyles.css"

import useAuthStore from "./stores/AuthStore";
import useProjectStore from "./stores/ProjectStore";


const ProjectDetail = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, accessToken } = useAuthStore();
  const { currentProject, gpError, isLoading, getProject } = useProjectStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (currentProject === null || currentProject.name !== projectName) {
      getProject(projectName, accessToken);
    }
  }, [isLoggedIn, navigate, projectName, currentProject, getProject, accessToken]);

  if (isLoading) {
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

  if (gpError) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{color: "red"}}>{gpError.message}</p>
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
      <Row>
        <h2 className="mt-4 mb-4 text-start">{currentProject.name}</h2>
      </Row>
      <Row>
        {currentProject.assumptions}
      </Row>
    </Container>
  );
};


export default ProjectDetail;
