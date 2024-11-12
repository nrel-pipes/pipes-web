import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./PageStyles.css";

import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";

import ProjectRunGraphView from "./ProjectRunGraphView";
import ProjectRunDataView from "./ProjectRunDataView";

const ProjectRun = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { selectedProjectName, currentProject, currentProjectRun } =
    useDataStore();

  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (
      currentProject === null ||
      currentProject.name !== selectedProjectName
    ) {
      navigate("/projects");
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

  return (
    <Container className="mainContent" fluid>
      <Row id="projectrun-flowview">
        <Col md={8}>
          <ProjectRunGraphView
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </Col>
        <Col sm={4} className="border-start text-start ml-4">
          <h2 className="display-6 mt-4">
            [{selectedProjectName}] Project Run: {currentProjectRun.name}
          </h2>
          <br />
          <ProjectRunDataView selected={selectedModel} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectRun;
