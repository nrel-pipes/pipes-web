import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Row from "react-bootstrap/Row";

import "./PageStyles.css"

import useAuthStore from "./stores/AuthStore";
import useProjectStore from "./stores/ProjectStore";


const ProjectRunDetail = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { selectedProjectName, currentProject} = useProjectStore();

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (currentProject === null || currentProject.name !== selectedProjectName) {
      navigate('/projects')
      return;
    }

  }, [
    isLoggedIn,
    navigate,
    accessToken,
    validateToken,
    selectedProjectName,
    currentProject,
  ]);

  if ( !currentProject || currentProject === null) {
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
      <Row className="text-start mt-5">
        <Col>
          <h2 className='display-6 text-center'>xxx</h2>
        </Col>
      </Row>

      <Row style={{ padding: 5 }}>
        <div className="projectrun">
          Hello project run
        </div>
      </Row>

    </Container>
  );

}


export default ProjectRunDetail;
