import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Plus, RefreshCw } from "lucide-react";
import Button from "react-bootstrap/Button";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "./stores/AuthStore";
import { getProject, getProjectRuns } from "./api/ProjectAPI";
import { useEffect } from "react";

import useDataStore from "./stores/DataStore";
import "../components/Cards.css";

const ProjectOverviewProjectRuns = ({ projectRuns }) => {
  const { setCurrentProjectRunName, setCurrentProjectRun } = useDataStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();

  // Auth check effect
  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      console.log("User not logged in, navigating to login.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate, validateToken, accessToken]);

  // Get the project name from location if needed
  const location = useLocation();
  const projectFromState = location.state?.project;
  const effectiveProjectName = projectFromState?.name;

  // Access the existing query data instead of creating a duplicate query
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", effectiveProjectName],
    enabled: isLoggedIn && !!effectiveProjectName,
  });

  const handleClick = (projectRun) => {
    setCurrentProjectRunName(projectRun.name);
    setCurrentProjectRun(projectRun);
    navigate("/projectrun"); // Add navigation after setting store values
  };

  const handleUpdateProjectClick = () => {
    navigate("/update-project");
  };

  const handleCreateProjectRunClick = () => {
    // Verify we have a valid project
    if (!project || !project.name) {
      console.error("Cannot create project run: No valid project data");
      return;
    }

    // Navigate to create project run screen, passing the project name
    navigate("/create-projectrun", {
      state: {
        projectName: project.name
      }
    });
  };


  return (
    <div className="d-flex flex-column align-items-center">
      <Row className="mb-4 w-100" key="update-project-run">
        <Col sm={12} className="d-flex justify-content-center">
          <Card
            className="create-project-card"
            onClick={handleUpdateProjectClick}
          >
            <Card.Body className="bg-light text-center d-flex flex-column align-items-center">
              <Card.Title className="mt-3 mb-3">
                Update Current Project
              </Card.Title>
              <RefreshCw size={48} className="mb-4 plus-icon" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h3 className="mb-4 smallCaps">Available Project Runs</h3>

      {projectRuns?.map((projectRun, index) => (
        <Row className="mb-4 w-100" key={`run-${index}`}>
          <Col sm={12} className="d-flex justify-content-center">
            <div className="card">
              <h5 className="card-header">Project Run: {projectRun.name}</h5>
              <div className="card-body">
                <p>{projectRun.description}</p>

                <h6 className="smallCaps mt-4">Assumptions</h6>
                <p>{projectRun.assumptions}</p>

                <h6 className="smallCaps mt-4">Requirements</h6>
                <ul>
                  {Object.entries(projectRun.requirements).map(
                    ([key, value], idx) => (
                      <li key={`requirement-${idx}`}>
                        <span>
                          {key
                            .replace("_", " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </span>
                        : &nbsp;
                        <span>
                          {Array.isArray(value) ? value.join(", ") : value}
                        </span>
                      </li>
                    ),
                  )}
                </ul>

                <h6 className="smallCaps mt-4">Scenarios</h6>
                <ul>
                  {projectRun.scenarios.map((value, idx) => (
                    <li key={`scenario-${idx}`}>
                      <span>
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    </li>
                  ))}
                </ul>

                <h6 className="smallCaps mt-4">Schedule</h6>
                <ul>
                  <li>Start: {projectRun.scheduled_start}</li>
                  <li>End: {projectRun.scheduled_end}</li>
                </ul>
              </div>

              <div className="card-footer">
                <Button
                  variant="outline-primary"
                  onClick={() => handleClick(projectRun)} // Modified to pass the entire projectRun object
                >
                  <FontAwesomeIcon icon={faCircleArrowRight} /> Go to Project
                  Run &gt;&gt;
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      ))}

      <Row className="mb-4 w-100" key="create-project-run">
        <Col sm={12} className="d-flex justify-content-center">
          <Card
            className="create-project-card"
            onClick={handleCreateProjectRunClick}
          >
            <Card.Body className="bg-light text-center d-flex flex-column align-items-center">
              <Card.Title className="mt-3 mb-3">Create Project Run</Card.Title>
              <Plus size={48} className="mb-4 plus-icon" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectOverviewProjectRuns;
