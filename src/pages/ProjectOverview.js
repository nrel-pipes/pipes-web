import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

// Helper function to get cached project from localStorage
const getCachedProject = (projectName) => {
  try {
    const cachedData = localStorage.getItem(`project_${projectName}`);
    if (cachedData) {
      const project = JSON.parse(cachedData);
      const cacheTime = localStorage.getItem(`project_${projectName}_time`);
      const isExpired = cacheTime && (Date.now() - parseInt(cacheTime)) > (30 * 60 * 1000);

      if (!isExpired) {
        console.log("Using cached project data");
        return project;
      }
    }
  } catch (e) {
    console.error("Error retrieving cached project:", e);
  }
  return null;
};

// Helper function to cache project in localStorage
const cacheProject = (projectName, data) => {
  try {
    localStorage.setItem(`project_${projectName}`, JSON.stringify(data));
    localStorage.setItem(`project_${projectName}_time`, Date.now().toString());
    console.log("Project cached successfully");
  } catch (e) {
    console.error("Error caching project:", e);
  }
};


const getCachedProjectRuns = (projectName) => {
  try {
    const cachedData = localStorage.getItem(`project_runs_${projectName}`);
    if (cachedData) {
      const projectRuns = JSON.parse(cachedData);
      // Check if the cache is still valid (e.g., not expired)
      const cacheTime = localStorage.getItem(`project_runs_${projectName}_time`);
      const isExpired = cacheTime && (Date.now() - parseInt(cacheTime)) > (15 * 60 * 1000); // 15 minutes

      if (!isExpired) {
        console.log("Using cached project runs data");
        return projectRuns;
      }
    }
  } catch (e) {
    console.error("Error retrieving cached project runs:", e);
  }
  return null;
};

// Helper function to cache project runs in localStorage
const cacheProjectRuns = (projectName, data) => {
  try {
    localStorage.setItem(`project_runs_${projectName}`, JSON.stringify(data));
    localStorage.setItem(`project_runs_${projectName}_time`, Date.now().toString());
    console.log("Project runs cached successfully");
  } catch (e) {
    console.error("Error caching project runs:", e);
  }
};


const ProjectOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { projectName } = useParams();
  const projectFromState = location.state?.project;

  // Initial empty project template
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
      console.log("User not logged in, navigating to login.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate, validateToken, accessToken]);

  // Check for cached project on first render
  useEffect(() => {
    const effectiveProjectName = projectFromState?.name || projectName;

    if (effectiveProjectName) {
      // Try to get project from cache
      const cachedProject = getCachedProject(effectiveProjectName);

      if (cachedProject) {
        // Pre-populate the query cache with the cached data
        queryClient.setQueryData(['project', effectiveProjectName], cachedProject);
      }
    }
  }, [queryClient, projectName, projectFromState]);

  // Determine which project name to use
  const effectiveProjectName = projectFromState?.name || projectName;

  // Project data query
// Modify the project query's onSuccess handler to trigger project runs refetch
const {
  data: project,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["project", effectiveProjectName],
  queryFn: () => {
    console.log(`Querying project: ${effectiveProjectName}`);
    return getProject({ projectName: effectiveProjectName, accessToken });
  },
  enabled: isLoggedIn && !!effectiveProjectName,
  retry: 3,
  staleTime: 30 * 60 * 1000,
  cacheTime: 60 * 60 * 1000,
  initialData: projectFromState || getCachedProject(effectiveProjectName) || emptyProjectTemplate,
  onSuccess: (data) => {
    console.log("Project fetch via useQuery successful! Title:", data?.title);
    // Cache the project when successfully fetched
    if (data && data.name) {
      cacheProject(data.name, data);

      // Trigger a refetch of project runs when project data is successfully fetched
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
    // Make sure we have a valid project name
    if (!project?.name) {
      console.log("No project name available, skipping project runs query");
      return [];
    }

    console.log(`Querying project runs for: ${project.name}`);

    // Try to get cached runs first
    const cachedRuns = getCachedProjectRuns(project.name);

    try {
      console.log("Getting project runs", project.name)
      // Always fetch fresh data from the API
      const freshData = await getProjectRuns({
        projectName: project.name,
        accessToken: accessToken
      });
      console.log(freshData);
      // Return the fresh data from the API
      return freshData;
    } catch (error) {
      console.error("Error fetching project runs, using cached data if available:", error);
      // Fall back to cached data on error
      return cachedRuns || [];
    }
  },
  initialData: () => {
    // Use the cached data as initial data
    if (project?.name) {
      const cachedRuns = getCachedProjectRuns(project.name);
      if (cachedRuns) {
        console.log("Using cached project runs as initial data");
        return cachedRuns;
      }
    }
    return [];
  },
  enabled: isLoggedIn &&
           !!project?.name &&
           project.name !== "" &&
           project !== emptyProjectTemplate,
  retry: 1,
  staleTime: 15 * 60 * 1000, // 15 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
  onSuccess: (data) => {
    console.log("Project runs fetch successful!", data);
    // Cache the project runs when successfully fetched
    if (data && project?.name) {
      cacheProjectRuns(project.name, data);
    }
  },
  onError: (error) => {
    console.error("Error fetching project runs:", error);
  }
});

// Add an effect to handle refetching project runs when project changes
useEffect(() => {
  if (
    project?.name &&
    project !== emptyProjectTemplate &&
    !isLoading // Only when project loading is complete
  ) {
    // Trigger a refetch of project runs when project data changes
    refetchProjectRuns();
  }
}, [project, refetchProjectRuns, isLoading]);



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
              <ProjectOverviewProjectRuns projectRuns={projectRuns || []} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectOverview;