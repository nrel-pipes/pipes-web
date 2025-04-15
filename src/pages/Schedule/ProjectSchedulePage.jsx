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
import "../PageStyles.css";

import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";

import { useGetModelsQuery } from "../../hooks/useModelQuery";
import { useGetProjectQuery } from "../../hooks/useProjectQuery";

import ContentHeader from "../Components/ContentHeader";
import EventsComponent from "./Components/EventsComponent";
import TimelineComponent from "./Components/TimelineComponent";

import NavbarSub from "../../layouts/NavbarSub";

const ProjectSchedulePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { effectivePname } = useDataStore();

  const {
    data: currentProject,
    isLoading: isLoadingProject
  } = useGetProjectQuery(effectivePname);

  const {
    data: models = [],
    isLoading: isLoadingModels
  } = useGetModelsQuery(effectivePname, null);

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

    if (!effectivePname) {
      navigate('/projects');
      return;
    }
  }, [
    isLoggedIn,
    navigate,
    accessToken,
    validateToken,
    effectivePname
  ]);

  if (isLoadingProject || !currentProject) {
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

  if (isLoadingModels) {
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
    <>
    <NavbarSub navData={{pAll: true, pName: effectivePname, pSchedule: true}} />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row className="w-100 mx-0">
        <ContentHeader title="Project Schedule" />
      </Row>
      <Row className="text-start mt-5">
        <Col>
          <h2 className='display-7 text-center'>Timeline</h2>
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
        <TimelineComponent
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
        <EventsComponent />
      </Row>

    </Container>
    </>
  );
};

export default ProjectSchedulePage;
