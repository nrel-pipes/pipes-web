import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./PageStyles.css";

import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";

import ProjectOverviewAssumptions from "./ProjectOverviewAssumptions";
import ProjectOverviewRequirements from "./ProjectOverviewRequirements";
import ProjectOverviewScenarios from "./ProjectOverviewScenarios";
import ProjectOverviewSchedule from "./ProjectOverviewSchedule";
import ProjectOverviewProjectRuns from "./ProjectOverviewProjectRuns";
import ProjectOverviewTeam from "../components/ProjectOverviewTeam";

const ProjectOverview = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const {
    selectedProjectName,
    currentProject,
    getProject,
    isGettingProject,
    projectGetError,
    getProjectRuns,
    projectRuns,
    projectRunRetries,
    isGettingProjectRuns,
  } = useDataStore();

  const [team, setTeam] = useState([
    {
      name: "dsgrid",
      description: null,
      members: [
        {
          email: "sam.molnar@nrel.gov",
          first_name: "Sam",
          last_name: "Molnar",
          organization: "National Renewable Energy Laboratory (NREL)",
          is_active: true,
          is_superuser: false,
        },
        {
          email: "Meghan.Mooney@nrel.gov",
          first_name: "Meghan",
          last_name: "Mooney",
          organization: "National Renewable Energy Laboratory (NREL)",
          is_active: true,
          is_superuser: false,
        },
      ],
      context: {
        project: "6762e21cd8b9ddb9ebac2891",
      },
    },
    {
      name: "dgen",
      description: null,
      members: [
        {
          email: "Jianli.Gu@nrel.gov",
          first_name: "Jianli",
          last_name: "Gu",
          organization: "National Renewable Energy Laboratory (NREL)",
          is_active: true,
          is_superuser: false,
        },
        {
          email: "Jacob.Nunemaker@nrel.gov",
          first_name: "Jacob",
          last_name: "Nunemaker",
          organization: "National Renewable Energy Laboratory (NREL)",
          is_active: true,
          is_superuser: false,
        },
      ],
      context: {
        project: "6762e21cd8b9ddb9ebac2891",
      },
    },
    {
      name: "rpm",
      description: null,
      members: [
        {
          email: "Kenny.Gruchalla@nrel.gov",
          first_name: "Kenny",
          last_name: "Gruchalla",
          organization: "National Renewable Energy Laboratory (NREL)",
          is_active: true,
          is_superuser: false,
        },
        {
          email: "David.Rager@nrel.gov",
          first_name: "David",
          last_name: "Rager",
          organization: "National Renewable Energy Laboratory (NREL)",
          is_active: true,
          is_superuser: false,
        },
      ],
      context: {
        project: "6762e21cd8b9ddb9ebac2891",
      },
    },
  ]);
  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!selectedProjectName || selectedProjectName === null) {
      navigate("/projects");
      return;
    }

    if (!currentProject || currentProject === null) {
      getProject(selectedProjectName, accessToken);
    }
    if (projectRunRetries > 2) return;
    if (!projectRuns || projectRuns.length === 0) {
      getProjectRuns(selectedProjectName, accessToken);
    }
  }, [
    validateToken,
    isLoggedIn,
    navigate,
    accessToken,
    selectedProjectName,
    getProject,
    currentProject,
    projectRuns,
    getProjectRuns,
    projectRunRetries,
  ]);

  if (isGettingProject || isGettingProjectRuns) {
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

  if (projectGetError) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{ color: "red" }}>{projectGetError.message}</p>
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
            <p>
              Please go to <a href="/projects">projects</a> and select one of
              your project.
            </p>
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
