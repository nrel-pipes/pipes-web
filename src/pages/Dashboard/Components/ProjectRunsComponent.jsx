import { faCalendarAlt, faCircleArrowRight, faLightbulb, faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import "../../Components/Cards.css";
import "./ProjectRunsComponent.css";

const ProjectRunsComponent = ({ projectRuns, isLoading, isError }) => {
  const navigate = useNavigate();

  const handleProjectRunClick = (projectRun) => {
    if (projectRun && projectRun.name) {
      navigate(`/projectrun/${encodeURIComponent(projectRun.name)}?P=${encodeURIComponent(projectRun.context.project)}`, {
        state: {
          projectRun: projectRun,
          timestamp: Date.now()
        },
        replace: true
      });
    } else {
      console.error("Invalid project run object:", projectRun);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading project runs...</div>;
  }

  if (isError) {
    return <div className="text-center text-danger">Error loading project runs</div>;
  }

  if (!projectRuns || projectRuns.length === 0) {
    return <div className="text-center text-muted">No project runs available</div>;
  }

  return (
    <div className="project-runs-container">
      <div className="table-responsive">
        <Table hover className="project-runs-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectRuns.map((projectRun, index) => (
              <tr key={`run-${projectRun.name}-${index}`} className="align-middle">
                <td className="run-name">{projectRun.name}</td>
                <td className="run-description text-truncate">{projectRun.description}</td>
                <td className="run-details">
                  <div className="d-flex gap-2 justify-content-center">
                    <Badge bg="light" text="dark" title="Scenarios">
                      <FontAwesomeIcon icon={faLightbulb} className="me-1" />
                      {projectRun.scenarios?.length || 0}
                    </Badge>
                    <Badge bg="light" text="dark" title="Requirements">
                      <FontAwesomeIcon icon={faListUl} className="me-1" />
                      {Object.keys(projectRun.requirements || {}).length}
                    </Badge>
                    <Badge bg="light" text="dark" title="Schedule">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                    </Badge>
                  </div>
                </td>
                <td className="run-actions">
                  <Button
                    variant="outline-primary"
                    className="action-button"
                    onClick={() => handleProjectRunClick(projectRun)}
                    title={`Go to ${projectRun.name}`}
                    data-run-name={projectRun.name}
                  >
                    <FontAwesomeIcon icon={faCircleArrowRight} className="me-2" />
                    View this Run
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectRunsComponent;
