import { faCalendarAlt, faCircleArrowRight, faLightbulb, faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/AuthStore";
import useDataStore from "../../../stores/DataStore";
import "../../Components/Cards.css";
import "./ProjectRunsComponent.css";

const ProjectRunsComponent = ({ projectRuns, isLoading: isLoadingProjectRuns, isError }) => {
  const { setEffectivePRname } = useDataStore();
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();

  // Auth check effect
  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, validateToken, accessToken]);

  const handleProjectRunClick = (projectRun) => {
    // Force a re-render by using a timeout to ensure state is updated before navigation
    if (projectRun && projectRun.name) {
      setEffectivePRname(projectRun.name);
      setTimeout(() => {
        navigate("/projectrun", {
          state: {
            projectRun: projectRun,
            timestamp: Date.now() // Add timestamp to force unique state object
          },
          replace: true // Replace the history entry to avoid back button issues
        });
      }, 50);
    } else {
      console.error("Invalid project run object:", projectRun);
    }
  };

  if (isLoadingProjectRuns) {
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
                    data-run-name={projectRun.name} // Add data attribute for debugging
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
