import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import "./PageStyles.css"

import useAuthStore from "./stores/AuthStore";
import useProjectStore from "./stores/ProjectStore";
import SectionTitle from "../components/SectionTitle";
import DirectoryCard from "../components/cards/DirectoryCard";
import Features from "../components/Features";


const ProjectList = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { projectBasics, getProjectBasics, isGettingProjectBasics, projectBasicsGetError, getProject } = useProjectStore();

  const handleProjectClick = (event, project) =>{
    event.preventDefault();

    getProject(project.name, accessToken);
    navigate(`/overview`);
  }

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
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
    )
  }

  if (projectBasicsGetError) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{color: "red"}}>{projectBasicsGetError.message}</p>
          </Col>
        </Row>
      </Container>
    )
  }

  if ( !projectBasics || projectBasics.length === 0 ) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{fontSize: '16px'}}>
              You currently do not have your own projects! Learn more about how to&nbsp;
              <a href='https://nrel-pipes.github.io/pipes-core/command_line.html#project' target='_blank' rel='noreferrer'>
               create project
              </a> in PIPES.
            </p>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container className="mainContent">
      <div className="w-full">
        <div className="max-w-7xl mx-auto py-16 px-4 md:px-8">
          <SectionTitle text="Your Projects" />
          <div className="flex flex-wrap justify-center gap-6">
            {projectBasics.map((project) => (
              <DirectoryCard
                key={project.name}
                title={project.name}
                description={project.description}
                onClick={(e) => handleProjectClick(e, project)}
              />
            ))}
          </div>
        </div>
      </div>
      <Features/>
    </Container>
  );
};

export default ProjectList;
