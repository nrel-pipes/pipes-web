import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const ProjectOverviewProjectRuns = ({projectRuns}) => {

  if (!projectRuns || projectRuns === null || projectRuns.length === 0) {
    return (
      <Row className="mt-5">
        <Col>
          <p>There are no available project runs on this project.</p>
        </Col>
      </Row>
    )
  }

  return (
    <>
      {projectRuns.map((projectRun, index) => (
        <Card className="mt-4" key={"card-"+index}>
          <Card.Body className="bg-light text-start">
            <Card.Title className="mt-3 mb-3">
              <a href="/projectrun" target="_blank">
                <FontAwesomeIcon icon={faCircleArrowRight} size="xl" />
                &nbsp; Project Run: {projectRun.name}
              </a>
            </Card.Title>
            <div key={"run-"+index}>
              <p>{projectRun.description}</p>

              <h6 className="smallCaps mt-4">Assumptions</h6>
              <p>{projectRun.assumptions}</p>

              <h6 className="smallCaps mt-4">Requirements</h6>
              <ul>
              {Object.entries(projectRun.requirements).map(([key, value], index) => (
                <li key={"requirement-"+index}>
                <span>{key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}</span>: &nbsp;
                <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                </li>
              ))}
              </ul>

              <h6 className="smallCaps mt-4">Scenarios</h6>
              <ul>
              {projectRun.scenarios.map((value, index) => (
                <li key={"scenario-" + index}>
                <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                </li>
              ))}
              </ul>

              <h6 className="smallCaps mt-4">Schedule</h6>
              <ul>
                <li key="schedule-start">Start: {projectRun.scheduled_start}</li>
                <li key="schedule-end">End: {projectRun.scheduled_end}</li>
              </ul>

            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default ProjectOverviewProjectRuns;
