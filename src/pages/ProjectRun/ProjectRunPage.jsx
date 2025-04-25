import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "../PageStyles.css";
import "./ProjectRunPage.css";

import { useGetProjectRunQuery } from "../../hooks/useProjectRunQuery";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";

import DataViewComponent from "./Components/DataViewComponent";
import GraphViewComponent from "./Components/GraphViewComponent";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProjectRunPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { effectivePname, effectivePRname } = useDataStore();

  const [selectedModel, setSelectedModel] = useState(null);
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);

  const toggleGraphExpansion = () => {
    setIsGraphExpanded(!isGraphExpanded);
  };

  // Store the project run from location.state in component state
  const [projectRunFromState, setProjectRunFromState] = useState(
    location.state?.projectRun || null
  );

  // Only query the API if we don't have the project run from state
  // and we have both project name and run name
  const shouldFetchProjectRun = !projectRunFromState && !!effectivePname && !!effectivePRname;

  // Use the query with proper enabled flag (boolean, not undefined)
  const { data: fetchedProjectRun, isLoading } = useGetProjectRunQuery(
    effectivePname,
    effectivePRname,
    {
      enabled: shouldFetchProjectRun
    }
  );

  // Use project run from state or from API
  const projectRun = projectRunFromState || fetchedProjectRun;

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // If we have no project run data and we're not loading, redirect to projects
    if (!projectRun && !isLoading && !shouldFetchProjectRun) {
      navigate("/projects");
    }
  }, [
    isLoggedIn,
    navigate,
    accessToken,
    validateToken,
    projectRun,
    isLoading,
    shouldFetchProjectRun
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <Container className="mainContent text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading project run data...</p>
      </Container>
    );
  }

  // Don't render if we don't have the project run yet
  if (!projectRun) {
    return null;
  }

  return (
    <>
    <NavbarSub navData = {{pAll: true, pName: effectivePname, prName: projectRun.name}} />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row className="w-100 mx-0">
        <ContentHeader title="Project Run" cornerMark={projectRun.name}/>
      </Row>
      <Row id="projectrun-flowview" className="pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
        <Col md={isGraphExpanded ? 12 : 8}>
          <GraphViewComponent
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </Col>

        <div
          className={`toggle-button-container2 ${isGraphExpanded ? 'expanded' : ''}`}
          onClick={toggleGraphExpansion}
          title={isGraphExpanded ? "Show data panel" : "Expand graph"}
        >
          <FontAwesomeIcon
            icon={isGraphExpanded ? faChevronLeft : faChevronRight}
            className="toggle-button"
          />
        </div>

        {!isGraphExpanded && (
          <Col sm={4} className="border-start text-start ml-4 data-view-col">
            <DataViewComponent selected={selectedModel} />
          </Col>
        )}
      </Row>
    </Container>
    </>
  );
};

export default ProjectRunPage;
