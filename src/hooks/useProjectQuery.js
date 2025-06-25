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
    throw error;
  }
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { setEffectivePname } = useDataStore();

  return useMutation({
    mutationFn: ({ data }) => postProject({ data }),
    onSuccess: (data) => {
      if (data && data.name) {
        setEffectivePname(data.name);
        queryClient.invalidateQueries({ queryKey: ["project-basics"] });
        queryClient.invalidateQueries({ queryKey: ["effective-project", data.name] });
        // TODO: may have other queries to invalidate as well.
        queryClient.prefetchQuery({
          queryKey: ["effective-project", data.name],
          queryFn: () => getProject({ projectName: data.name })
        });
      }
    },
    onError: (error) => {
      // console.error("Failed to create project:", error.response);
    },
  });
};

// Update existing project
export const updateProject = async ({ projectName, data }) => {
  try {
    const response = await AxiosInstance.put(`/api/projects?project=${encodeURIComponent(projectName)}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update project via request client:", error);
    throw error;
  }
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { setEffectivePname, clearEffectivePRname } = useDataStore();

  return useMutation({
    mutationFn: ({ projectName, data }) => updateProject({ projectName, data }),
    onSuccess: async (data, variables) => {
      if (data && data.name) {
        const oldProjectName = variables.projectName;
        const newProjectName = data.name;

        // Check if project name changed
        const projectNameChanged = oldProjectName !== newProjectName;

        if (projectNameChanged) {
          // If project name changed, clear the project run name since it's no longer valid
          clearEffectivePRname();

          // Remove old project cache entries
          queryClient.removeQueries({ queryKey: ["effective-project", oldProjectName] });
          queryClient.removeQueries({ queryKey: ["project-runs", oldProjectName] });
          queryClient.removeQueries({ queryKey: ["models", oldProjectName] });
          queryClient.removeQueries({ queryKey: ["model-runs", oldProjectName] });
          queryClient.removeQueries({ queryKey: ["handoffs", oldProjectName] });
          queryClient.removeQueries({ queryKey: ["datasets", oldProjectName] });
        }

        // Update the effective project name to the new name
        setEffectivePname(newProjectName);

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["project-basics"] });
        queryClient.invalidateQueries({ queryKey: ["effective-project", newProjectName] });

        // Prefetch the updated project data
        await queryClient.prefetchQuery({
          queryKey: ["effective-project", newProjectName],
          queryFn: () => getProject({ projectName: newProjectName })
        });
      }
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    }
  });
};

// Delete Project
export const deleteProject = async ({ projectName }) => {
  try {
    const params = {
      project: projectName
    };

    const response = await AxiosInstance.delete('/api/projects', { params });
    return response.data;
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw error;
  }
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  const { setEffectivePname } = useDataStore();

  return useMutation({
    mutationFn: ({ projectName }) => deleteProject({ projectName }),
    onSuccess: (data, variables) => {
      // Clear the effective project name if it was the deleted project
      setEffectivePname(null);

      // Only invalidate project lists, not the specific project query
      queryClient.invalidateQueries({ queryKey: ["project-basics"] });

      // Remove the specific project from cache since it's deleted
      queryClient.removeQueries({ queryKey: ["effective-project", variables.projectName] });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
    }
  });
};
