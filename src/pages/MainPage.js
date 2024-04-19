import React from "react";
import { Container, Row, Tab, Tabs, Badge} from "react-bootstrap";

import { useScheduleStore } from "../components/store/ScheduleStore";
import OverviewPage from "./OverviewPage";
import PipelinePage from "./PipelinePage";
import SchedulePage from "./SchedulePage";
import SetContextPage from "./SetContextPage";
import Sidebar from "./Sidebar";


export default function MainPage() {
  const numWarnings = useScheduleStore((state) => state.numWarnings);
  const setNumWarnings = useScheduleStore((state) => state.setNumWarnings);

  function handleTabChange(tabName) {
    if (tabName === "schedule") {
      setNumWarnings(0);
    }
  }

  return (
    <Container fluid>
      <Row>
        <Sidebar />
        <Tabs
          defaultActiveKey="setproject"
          id="c2c"
          className="main-content"
          onSelect={handleTabChange}
        >
          <Tab eventKey="setproject" title="Set Context">
            <SetContextPage />
          </Tab>
          <Tab eventKey="overview" title="Overview">
            <OverviewPage />
          </Tab>
          <Tab
            eventKey="schedule"
            title={
              <React.Fragment>
                Schedule
                <WarningBadge numberOfWarnings={numWarnings} />
              </React.Fragment>
            }
          >
            <SchedulePage />
          </Tab>
          <Tab eventKey="pipeline" title="Pipeline">
            <PipelinePage />
          </Tab>
        </Tabs>
      </Row>
    </Container>
  );
}

function WarningBadge({ numberOfWarnings }) {
  if (numberOfWarnings > 0) {
    return <Badge bg="danger">{numberOfWarnings}</Badge>;
  } else {
    return <></>;
  }
}
