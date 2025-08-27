import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "../PageStyles.css";
import "./GetProjectRunPage.css";

import { useGetProjectRunQuery } from "../../hooks/useProjectRunQuery";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";

import DataViewComponent from "./Components/DataViewComponent";
import GraphViewComponent from "./Components/GraphViewComponent";
import ProjectRunContentHeaderButton from "./Components/ProjectRunContentHeaderButton";

import NavbarSub from "../../layouts/NavbarSub";
import ContentHeader from "../Components/ContentHeader";

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const GetProjectRunPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = useAuthStore();
  const { effectivePname, effectivePRname } = useDataStore();

  const [selectedModel, setSelectedModel] = useState(null);
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);

  const toggleGraphExpansion = () => {
    setIsGraphExpanded(!isGraphExpanded);
  };

  const [projectRunFromState, setProjectRunFromState] = useState(
    location.state?.projectRun || null
  );

  const shouldFetchProjectRun = !projectRunFromState && !!effectivePname && !!effectivePRname;

  const { data: projectRunFetched, isLoading } = useGetProjectRunQuery(
    effectivePname,
    effectivePRname,
    {
      enabled: shouldFetchProjectRun
    }
  );

  // Use project run from state or from API
  const projectRun = projectRunFromState || projectRunFetched;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        if (!projectRun && !projectRunFromState) {
          navigate("/projects");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [
    navigate,
    checkAuthStatus,
    projectRun,
    projectRunFromState
  ]);

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

  if (!projectRun) {
    return null;
  }

  return (
    <>
      <NavbarSub navData = {{pList: true, pName: effectivePname, prName: projectRun.name}} />
      <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
        <Row className="w-100 mx-0">
          <ContentHeader title="Project Run" cornerMark={projectRun.name} headerButton={<ProjectRunContentHeaderButton projectName={effectivePname} projectRunName={effectivePRname} />} />
        </Row>
        <Row id="projectrun-flowview" className="pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
          <Col md={isGraphExpanded ? 12 : 8}>
            <GraphViewComponent
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </Col>
          {!isGraphExpanded && (
            <Col sm={4} className="border-start text-start ml-4 data-view-col">
              <DataViewComponent
                selected={selectedModel}
                projectRun={projectRun}
                showProjectRunData={!selectedModel}
              />
            </Col>
          )}
        </Row>
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
      </Container>
    </>
  );
};

export default GetProjectRunPage;
