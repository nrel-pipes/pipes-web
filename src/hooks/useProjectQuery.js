import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';
import useDataStore from '../stores/DataStore';
import AxiosInstance from './AxiosInstance';


// Get Project Basics
export const getProjectBasics = async () => {
  const response = await AxiosInstance.get("/api/projects/basics");
  return response.data;
};

export const useGetProjectsQuery = () => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["project-basics"],
    queryFn: () => getProjectBasics(),
    enabled: !!isLoggedIn,
  });
};


// Get Project Detail
export const getProject = async ({ projectName }) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    const response = await AxiosInstance.get(`/api/projects?project=${encodedProjectName}`);
    if (!response.data) {
      throw new Error("No data received from the server.");
    }
    return response.data;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
};

export const useGetProjectQuery = (projectName) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["effective-project", projectName],
    queryFn: () => getProject({ projectName}),
    enabled: !!isLoggedIn
  });
};


// Create New Project
export const postProject = async ({ data }) => {
  try {
    const response = await AxiosInstance.post("api/projects", data);
    return response.data;
  } catch (error) {
    console.error("Failed to post project via request client:", error);
    throw error;
  }
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { setEffectivePname } = useDataStore();

  return useMutation({
    mutationKey: ["create-project"],
    mutationFn: ({ data }) => postProject({ data }),
    onSuccess: (data) => {
      if (data && data.name) {
        setEffectivePname(data.name);
        queryClient.invalidateQueries(["project-basics"]);
        queryClient.invalidateQueries(["effective-project", data.name]);
        // TODO: may have other queries to invalidate as well.
        queryClient.prefetchQuery(["effective-project", data.name], () =>
          getProject({ projectName: data.name })
        );
      }
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
    },
  });
};


// Update existing project
export const putProject = async ({ projectName, data }) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    const response = await AxiosInstance.put(`/api/projects?project=${encodedProjectName}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update project via request client:", error);
    throw error;
  }
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { setEffectivePname } = useDataStore();

  return useMutation({
    mutationKey: ["update-project"],
    mutationFn: ({ projectName, data }) => putProject({ projectName, data }),
    onSuccess: (data, variables) => {
      if (data && data.name) {
        // Set as effective project (in case name changed)
        setEffectivePname(data.name);

        // Invalidate relevant queries
        queryClient.invalidateQueries(["project-basics"]);

        // Invalidate both the old and new project names if they're different
        queryClient.invalidateQueries(["effective-project", variables.projectName]);
        if (variables.projectName !== data.name) {
          queryClient.invalidateQueries(["effective-project", data.name]);
        }

        // Prefetch the updated project data
        queryClient.prefetchQuery(["effective-project", data.name], () =>
          getProject({ projectName: data.name })
        );
      }
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });
};
