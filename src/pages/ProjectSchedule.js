import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faSquareCaretLeft, faTableList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Row from "react-bootstrap/Row";

import "gantt-task-react/dist/index.css";
import "./PageStyles.css"

import useAuthStore from "./stores/AuthStore";
import useProjectStore from "./stores/ProjectStore";
import useModelStore from "./stores/ModelStore";

import ProjectScheduleGantt from "./ProjectScheduleGantt";


const ProjectSchedule = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken } = useAuthStore();
  const { currentProject} = useProjectStore();
  const { models, getModels} = useModelStore();

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
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (currentProject === null) {
      navigate('/projects')
    }

    if (!models || models === null || models.length === 0) {
      getModels(currentProject.name, null, accessToken);
    }
  }, [
    isLoggedIn,
    navigate,
    currentProject,
    getModels
  ]);

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
    <Container className="mainContent" fluid>
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
          <ProjectScheduleGantt
            viewMode={viewMode}
            showSidebar={showSidebar}
            divId={"schedule-fluid"}
          />
        </Row>
    </Container>
  );
};


export default ProjectSchedule;
