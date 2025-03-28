import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./PageStyles.css";

import useAuthStore from "./stores/AuthStore";
import { getProject, getProjectRuns } from "./api/ProjectAPI"; // Import getProject

import ProjectOverviewAssumptions from "./ProjectOverviewAssumptions";
import ProjectOverviewRequirements from "./ProjectOverviewRequirements";
import ProjectOverviewScenarios from "./ProjectOverviewScenarios";
import ProjectOverviewSchedule from "./ProjectOverviewSchedule";
import ProjectOverviewProjectRuns from "./ProjectOverviewProjectRuns";
import ProjectOverviewTeam from "../components/ProjectOverviewTeam";

const ProjectOverview = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { projectName } = useParams();

  const [currentProject, setCurrentProject] = useState(null);
  const [projectRuns, setProjectRuns] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [team] = useState([
    /*... your team data... */
  ]);

  useEffect(() => {
    console.log("in overview");
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      console.log("here");

      try {
        const projectData = await getProject({ projectName, accessToken });
        setCurrentProject(projectData.data);

        const projectIdentifier =
          projectData.data.name || projectData.data.id || projectName;

        const runsData = await getProjectRuns(projectIdentifier);
        setProjectRuns(runsData);
      } catch (err) {
        setError(err);
        console.error("Error in fetchData:", err);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    console.log("HERE, ", projectName);
    if (!projectName) {
      navigate("/projects");
      return;
    }

    fetchData();
  }, [validateToken, isLoggedIn, navigate, accessToken, projectName]);

  if (isLoading) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <FontAwesomeIcon icon={faSpinner} spin size="xl" />
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{ color: "red" }}>
              {error?.message || "Error loading data."}
            </p>{" "}
          </Col>
        </Row>
      </Container>
    );
  }

  if (!currentProject) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p>Project not found.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mainContent" fluid>
      <Row className="text-start">
        <Col>
          <h2 className="display-5 mt-4 mb-4">
            {currentProject.name} {currentProject.title}
          </h2>
          <p className="mt-3">
            <b>
              Project Owner: {currentProject.owner.first_name}{" "}
              {currentProject.owner.last_name}
            </b>
          </p>

          <p className="mt-4">{currentProject.description}</p>
          <hr></hr>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Row className="text-start mt-4">
            <h3 className="mb-4 smallCaps">Assumptions</h3>
            <Col>
              <ProjectOverviewAssumptions
                assumptions={currentProject.assumptions}
              />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Requirements</h3>
            <Col>
              <ProjectOverviewRequirements
                requirements={currentProject.requirements}
              />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Scenarios</h3>
            <Col>
              <ProjectOverviewScenarios scenarios={currentProject.scenarios} />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Schedule</h3>
            <Col>
              <ProjectOverviewSchedule
                scheduled_start={currentProject.scheduled_start}
                scheduled_end={currentProject.scheduled_end}
              />
            </Col>
          </Row>
          {/* Hard code for now, since we are switching from zustand to react-query */}
          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Team</h3>
            <Col>
              <ProjectOverviewTeam team={team} />
            </Col>
          </Row>
        </Col>

        <Col md={4} className="border-start">
          <Row className="mt-4">
            <Col>
              <ProjectOverviewProjectRuns projectRuns={projectRuns} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectOverview;
