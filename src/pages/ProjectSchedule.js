import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faSpinner, faSquareCaretLeft, faTableList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Row from "react-bootstrap/Row";

import "gantt-task-react/dist/index.css";
import "./PageStyles.css"

import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";

import ProjectScheduleTimeline from "./ProjectScheduleTimeline";
import ProjectScheduleEvents from "./ProjectScheduleEvents";


const ProjectSchedule = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { selectedProjectName, currentProject, models, getModels, isGettingModels} = useDataStore();

  // page state
  const [viewMode, setViewMode] = useState("Week");
  const [showSidebar, setShowSidebar] = useState(true);

  const handleViewModeSelect = (event) => {
    setViewMode(event);
  };

  const handleSidebarShow = () => {
    setShowSidebar(!showSidebar);
  };

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

    if (!models || models === null || models.length === 0) {
      getModels(currentProject.name, null, accessToken);
    }
  }, [
    isLoggedIn,
    navigate,
    accessToken,
    validateToken,
    selectedProjectName,
    currentProject,
    models,
    getModels
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

  if (isGettingModels) {
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

  return (
    <Container className="mainContent" fluid>
      <Row className="text-start mt-5">
        <Col>
          <h2 className='display-6 text-center'>Timeline</h2>
        </Col>
      </Row>

      <Row style={{ padding: 5 }}>
        <div className="schedule">
          <FontAwesomeIcon
            icon={showSidebar ? faSquareCaretLeft : faTableList}
            onClick={handleSidebarShow}
            style={{ 'cursor': 'pointer', fontSize: '35px' }}
          />
          &nbsp;
          <DropdownButton
            variant="outline-dark"
            title={viewMode}
            id="dropdown-menu-align-right"
            onSelect={handleViewModeSelect}
          >
            <Dropdown.Item active={viewMode === "Day"} eventKey="Day">
              Day
            </Dropdown.Item>
            <Dropdown.Item active={viewMode === "Week"} eventKey="Week">
              Week
            </Dropdown.Item>
            <Dropdown.Item active={viewMode === "Month"} eventKey="Month">
              Month
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </Row>
      <Row style={{ padding: 5 }}>
        <ProjectScheduleTimeline
          viewMode={viewMode}
          showSidebar={showSidebar}
          divId={"schedule-fluid"}
        />
      </Row>

      {/*
      <Row className="text-start mt-5">
        <Col>
          <h2 className='display-6 text-center'>Events</h2>
        </Col>
      </Row> */}
      <Row style={{ padding: 5 }}>
        <ProjectScheduleEvents />
      </Row>

    </Container>
  );
};


export default ProjectSchedule;
