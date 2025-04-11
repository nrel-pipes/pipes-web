import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./PageStyles.css";

import { getProject, getProjectRuns } from "./api/ProjectAPI";
import useAuthStore from "./stores/AuthStore";

import ProjectOverviewTeam from "../components/ProjectOverviewTeam";
import ProjectOverviewAssumptions from "./ProjectOverviewAssumptions";
import ProjectOverviewProjectRuns from "./ProjectOverviewProjectRuns";
import ProjectOverviewRequirements from "./ProjectOverviewRequirements";
import ProjectOverviewScenarios from "./ProjectOverviewScenarios";
import ProjectOverviewSchedule from "./ProjectOverviewSchedule";

const ProjectOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { projectName: urlProjectName } = useParams();

  const projectFromState = location.state?.project;

  const effectiveProjectName = projectFromState?.name || urlProjectName;

  const emptyProjectTemplate = {
    name: "",
    title: "",
    description: "",
    assumptions: [],
    milestones: [],
    owner: {
      email: "",
      first_name: "",
      last_name: ""
    },
    requirements: {},
    scenarios: [],
    scheduled_end: null,
    scheduled_start: null,
    sensitivities: [],
    teams: []
  };

  // Auth check effect
  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, validateToken, accessToken]);

  useEffect(() => {
    if (effectiveProjectName && projectFromState) {
      queryClient.setQueryData(['project', effectiveProjectName], projectFromState);
    }
  }, [queryClient, effectiveProjectName, projectFromState]);

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", effectiveProjectName],
    queryFn: () => {
      return getProject({ projectName: effectiveProjectName, accessToken });
    },
    enabled: isLoggedIn && !!effectiveProjectName,
    retry: 3,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    initialData: projectFromState || emptyProjectTemplate,
    onSuccess: (data) => {

      if (data && data.name) {
        queryClient.invalidateQueries({
          queryKey: ["projectRuns", data.name],
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching project via useQuery:", error);
    }
  });

  const {
    data: projectRuns,
    isLoading: isLoadingRuns,
    isError: isErrorRuns,
    error: errorRuns,
    refetch: refetchProjectRuns
  } = useQuery({
    queryKey: ["projectRuns", project?.name],
    queryFn: async () => {
      if (!project?.name) {
        return [];
      }

      try {
        const freshData = await getProjectRuns({
          projectName: project.name,
          accessToken: accessToken
        });
        return freshData;
      } catch (error) {
        console.error("Error fetching project runs:", error);
        return [];
      }
    },
    enabled: isLoggedIn &&
            !!project?.name &&
            project.name !== "" &&
            project !== emptyProjectTemplate,
    retry: 3,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching project runs:", error);
    }
  });

  if (isLoading && !projectFromState) {
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

  if (isError) {
    return (
      <Container className="mainContent">
        <Row className="mt-5">
          <Col>
            <p style={{ color: "red" }}>
              {error?.message || "Error loading data."}
            </p>
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
              Project Owner: {project.owner?.first_name || ""}{" "}
              {project.owner?.last_name || ""}
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
                assumptions={project.assumptions || []}
              />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Requirements</h3>
            <Col>
              <ProjectOverviewRequirements
                requirements={project.requirements || {}}
              />
            </Col>
          </Row>

          <Row className="text-start mt-5">
            <h3 className="mb-4 smallCaps">Scenarios</h3>
            <Col>
              <ProjectOverviewScenarios scenarios={project.scenarios || []} />
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
              <ProjectOverviewTeam team={project.teams || []} />
            </Col>
          </Row>
        </Col>

        <Col md={4} className="border-start">
          <Row className="mt-4">
            <Col>
              <ProjectOverviewProjectRuns
                projectRuns={projectRuns || []}
                isLoading={isLoadingRuns}
                isError={isErrorRuns}
                error={errorRuns}
                // project={project}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectOverview;
