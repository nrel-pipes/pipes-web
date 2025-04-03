import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./PageStyles.css";

import useAuthStore from "./stores/AuthStore";
import { getProject, getProjectRuns } from "./api/ProjectAPI";

import ProjectOverviewAssumptions from "./ProjectOverviewAssumptions";
import ProjectOverviewRequirements from "./ProjectOverviewRequirements";
import ProjectOverviewScenarios from "./ProjectOverviewScenarios";
import ProjectOverviewSchedule from "./ProjectOverviewSchedule";
import ProjectOverviewProjectRuns from "./ProjectOverviewProjectRuns";
import ProjectOverviewTeam from "../components/ProjectOverviewTeam";

const ProjectOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { projectName } = useParams();

  const projectFromState = location.state?.project;

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      console.log("User not logged in, navigating to login.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate, validateToken, accessToken]);


  const {
    data: fetchedProject,
    isLoading: isLoadingProject,
    isError: isErrorProject,
    error: errorProject,
  } = useQuery({
    queryKey: ["project", projectName],
    queryFn: () => {
      console.log(`Querying project: ${projectName}`);
      return getProject({ projectName, accessToken });
    },
    enabled: isLoggedIn && !!projectName && !projectFromState,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    initialData: projectFromState,
    onSuccess: (data) => {
      console.log("Project fetch via useQuery successful! Title:", data?.title);
    },
    onError: (error) => {
      console.error("Error fetching project via useQuery:", error);
    }
  });

  const project = projectFromState || fetchedProject;


  const {
    data: projectRuns,
    isLoading: isLoadingRuns,
    isError: isErrorRuns,
    error: errorRuns,
  } = useQuery({
    queryKey: ["projectRuns", project?.name],
    queryFn: () => {
      return getProjectRuns({
        projectName: fetchedProject.name,
        accessToken: accessToken
      });
    },

    enabled: isLoggedIn && !!project?.name && !!project,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      console.log("Project runs fetch successful!", data);
    },
    onError: (error) => {
      console.error("Error fetching project runs:", error);
    }
  });

  const isLoading = (!projectFromState && isLoadingProject) || (!!project && isLoadingRuns);
  const isError = (!projectFromState && isErrorProject) || isErrorRuns;
  const error = (!projectFromState ? errorProject : null) || errorRuns;

  if (!isLoggedIn || !project) {
    console.log(project);
    return null;
  }  if (isLoading) {
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

  if (!project) {
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
            {project.name} {project.title}
          </h2>
          <p className="mt-3">
            <b>
              Project Owner: {project.owner.first_name}{" "}
              {project.owner.last_name}
            </b>
          </p>

          <p className="mt-4">{project.description}</p>
          <hr></hr>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Row className="text-start mt-4">
            <h3 className="mb-4 smallCaps">Assumptions</h3>
            <Col>
              <ProjectOverviewAssumptions
                assumptions={project.assumptions}
              />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Requirements</h3>
            <Col>
              <ProjectOverviewRequirements
                requirements={project.requirements}
              />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Scenarios</h3>
            <Col>
              <ProjectOverviewScenarios scenarios={project.scenarios} />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Schedule</h3>
            <Col>
              <ProjectOverviewSchedule
                scheduled_start={project.scheduled_start}
                scheduled_end={project.scheduled_end}
              />
            </Col>
          </Row>
          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Team</h3>
            <Col>
              <ProjectOverviewTeam team={project.teams} />
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