import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Row from "react-bootstrap/Row";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretLeft,
  faRectangleList,
} from "@fortawesome/free-regular-svg-icons";

import Container from "react-bootstrap/Container";

// Internal imports
import PipelineTimeline from "../components/Timeline";
import EventStream from "../components/EventStream";

export default function SchedulePage() {
  const [period, setPeriod] = useState("Week");
  const [sidebar, setSidebar] = useState(true);

  const handlePeriodSelect = (event) => {
    console.log(event);
    setPeriod(event);
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <div>
      <Container className="vh-100 main-content" fluid>
        <Row style={{ padding: 5 }}>
          <div className="schedule">
            <FontAwesomeIcon
              icon={sidebar ? faSquareCaretLeft : faRectangleList}
              size="2x"
              onClick={handleSidebar}
            />
            <DropdownButton
              variant="dark"
              title={period}
              id="dropdown-menu-align-right"
              onSelect={handlePeriodSelect}
            >
              <Dropdown.Item active={period === "Day"} eventKey="Day">
                Day
              </Dropdown.Item>
              <Dropdown.Item active={period === "Week"} eventKey="Week">
                Week
              </Dropdown.Item>
              <Dropdown.Item active={period === "Month"} eventKey="Month">
                Month
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </Row>
        <Row style={{ padding: 10 }}>
          <PipelineTimeline
            divId={"schedule-full"}
            viewMode={period}
            showSidebar={sidebar}
          />
        </Row>
        <Row style={{ padding: 10 }}>
          <EventStream />
        </Row>
      </Container>
    </div>
  );
}
