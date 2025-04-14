import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "../PageStyles.css";

import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import useProjectStore from "../../stores/ProjectStore";

import DataViewComponent from "./Components/DataViewComponent";
import GraphViewComponent from "./Components/GraphViewComponent";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";


const ProjectRunPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { selectedProjectName, currentProject, currentProjectRun } = useDataStore();
  const { effectiveProject } = useProjectStore();

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
    <>
    <NavbarSub navData = {{pAll: true, pName: effectiveProject, prName: currentProjectRun.name}} />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row className="w-100 mx-0">
        <ContentHeader title="Project Run" cornerMark={currentProjectRun.name}/>
      </Row>
      <Row id="projectrun-flowview" className="pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
        <Col md={8}>
          <GraphViewComponent
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </Col>
        <Col sm={4} className="border-start text-start ml-4">
          <DataViewComponent selected={selectedModel} />
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default ProjectRunPage;
