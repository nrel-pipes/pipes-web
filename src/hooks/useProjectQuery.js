import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useDataStore from '../stores/DataStore';
import AxiosInstance from './AxiosInstance';

// Get Project Basics
export const getProjectBasics = async () => {
  const response = await AxiosInstance.get("/api/projects/basics");
  return response.data;
};

export const useGetProjectsQuery = () => {
  return useQuery({
    queryKey: ["project-basics"],
    queryFn: () => getProjectBasics(),
  });
};

// Get Project Detail
export const getProject = async ({ projectName }) => {
  try {
    const params = {
      project: projectName // Axios will properly encode this
    };

    const response = await AxiosInstance.get('/api/projects', { params });

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
  return useQuery({
    queryKey: ["effective-project", projectName],
    queryFn: () => getProject({ projectName }),
    enabled: !!projectName,
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
export const updateProject = async ({ projectName, data }) => {
  try {
    const params = {
      project: projectName // Axios will properly encode this
    };

    const response = await AxiosInstance.put('/api/projects', data, { params });
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
    mutationFn: ({ projectName, data }) => updateProject({ projectName, data }),
    onSuccess: (data, variables) => {
      if (data && data.name) {

        setEffectivePname(data.name);

        // Invalidate relevant queries
        queryClient.invalidateQueries(["project-basics"]);

        queryClient.invalidateQueries(["effective-project", variables.projectName]);
        if (variables.projectName !== data.name) {
          queryClient.invalidateQueries(["effective-project", data.name]);
        }

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
