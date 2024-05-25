import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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


const AllProjects = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken } = useAuthStore();
  const { projects, error, isLoading, getAllProjects, getProject } = useProjectStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
    if (projects.length === 0) {
      getAllProjects(accessToken);
    }
  }, [isLoggedIn, navigate, projects, getAllProjects, accessToken]);

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

  if (error) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{color: "red"}}>{error.message}</p>
          </Col>
        </Row>
      </Container>
    )
  }

  if ( !projects || projects.length === 0 ) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p>You currently do not have projects on PIPES!</p>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="mainContent">
      <Row>
        <h2 className="mt-4 mb-4">Your Available Projects</h2>
      </Row>
      <Row>
        {projects.map((project) => (
          <Col sm={6} key={project.name} >
            <Card style={{ margin: "20px" }}>
              <Card.Body className="bg-light text-start">
                <Card.Title className="mt-3 mb-3">{project.name}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
                <Button
                  variant="outline-success"
                  onClick={(e) => {
                    e.preventDefault();
                    getProject(project.name);
                    // document.getElementById("c2c-tab-overview").click();
                  }}
                >
                  Go to Project &gt;&gt;
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};


export default AllProjects;
