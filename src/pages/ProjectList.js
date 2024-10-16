import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Alert from 'react-bootstrap/Alert';

import "./PageStyles.css";
import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";
import PopupForm from "../components/PopupForm";

const ProjectList = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const {
    projectBasics,
    getProjectBasics,
    isGettingProjectBasics,
    projectBasicsGetError,
    getProject,
    createProject,
    projectCreationError,
  } = useDataStore();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: 'hello2',
    title: 'hello',
    description: 'This is a description',
    assumptions: ['This is an assumption'],
    requirements: { "homeostasis": 'Must be homeostatic' },
    scenarios: [
      {
        name: 'Scenario 1',
        description: ['blah'],
        other: {},
      },
    ],
    sensitivities: [
      {
        name: 'Sensitivity 1',
        description: ['Not sensitive'],
      },
    ],
    milestones: [
      {
        name: 'Milestone 1',
        description: ['Milestone description'],
        milestone_date: '2024-08-16T16:19:20',
      },
    ],
    scheduled_start: '2020-10-16T16:19:20',
    scheduled_end: '2024-08-16T16:19:20',
    owner: {
      email: 'Jordan.Eisenman@nrel.gov',
      first_name: 'Jordan',
      last_name: 'Eisenman',
      organization: 'NREL',
    },
  });

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      getProjectBasics(accessToken);
    }
  }, [isLoggedIn, navigate, getProjectBasics, accessToken, validateToken]);

  const handleProjectClick = (event, project) => {
    event.preventDefault();
    getProject(project.name, accessToken);
    navigate(`/overview`);
  };

  const handleCreateProjectClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      title: '',
      description: '',
      assumptions: [''],
      requirements: { '': '' },
      scenarios: [
        {
          name: '',
          description: [''],
          other: {},
        },
      ],
      sensitivities: [
        {
          name: '',
          description: [''],
        },
      ],
      milestones: [
        {
          name: '',
          description: [''],
          milestone_date: '',
        },
      ],
      scheduled_start: '',
      scheduled_end: '',
      owner: {
        email: '',
        first_name: '',
        last_name: '',
        organization: '',
      },
    });
  };

  const handleFormSubmit = async (submittedFormData) => {
    console.log('Received form data:', submittedFormData);
    setIsLoading(true);
    setError(null);
    try {
      const formattedData = {
        ...submittedFormData,
        scheduled_start: submittedFormData.scheduled_start ? new Date(submittedFormData.scheduled_start).toISOString() : null,
        scheduled_end: submittedFormData.scheduled_end ? new Date(submittedFormData.scheduled_end).toISOString() : null,
      };
      await createProject(formattedData, accessToken);
      handleCloseModal();
      await getProjectBasics(accessToken);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
      setIsLoading(false);
    }
  };

  if (isGettingProjectBasics) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p className="mt-3">Loading projects...</p>
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
            <Alert variant="danger">
              Error loading projects: {projectBasicsGetError.message}
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mainContent">
      <Row>
        <h2 className="mt-4 mb-4">Your Available Projects</h2>
      </Row>

      {(projectCreationError || error) && (
        <Row>
          <Col>
            <Alert variant="danger">
              {projectCreationError ? projectCreationError.message : error}
            </Alert>
          </Col>
        </Row>
      )}

      {isLoading && (
        <Row>
          <Col className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p className="mt-3">Creating project...</p>
          </Col>
        </Row>
      )}

      <Row>
        {projectBasics && projectBasics.map((project) => (
          <Col sm={6} key={project.name}>
            <Card style={{ margin: "20px" }}>
              <Card.Body className="bg-light text-start">
                <Card.Title className="mt-3 mb-3">{project.name}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
                <Button
                  variant="outline-success"
                  onClick={(e) => handleProjectClick(e, project)}
                >
                  Go to Project &gt;&gt;
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Col sm={6}>
          <Card style={{ margin: "20px" }}>
            <Card.Body className="bg-light text-start">
              <Card.Title className="mt-3 mb-3">Create Project</Card.Title>
              <Button variant="primary" onClick={handleCreateProjectClick}>
                Create Project &gt;&gt;
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <PopupForm
        showModal={showModal}
        handleClose={handleCloseModal}
        handleFormSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
      />

    </Container>
  );
};

export default ProjectList;