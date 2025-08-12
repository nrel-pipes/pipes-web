import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';

export const getModels = async (projectName, projectRunName) => {
  try {
    const params = {
      project: projectName
    };

    if (projectRunName) {
      params.projectrun = projectRunName;
    }

    const response = await AxiosInstance.get('/api/models', { params });

    return response.data || [];
  } catch (error) {
    console.error("Error getting models:", error);
    throw error;
  }
};

export const useGetModelsQuery = (projectName, projectRunName = null, options = {}) => {
  return useQuery({
    queryKey: ["models", projectName, projectRunName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getModels(projectName, projectRunName);
    },
    enabled: !!projectName,
    retry: (failureCount, error) => {
      // Don't retry 4xx errors
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        return false;
      }
      return failureCount < 2; // Maximum of 2 retries for other errors
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
      console.error("Error in models query:", error);
    },
    ...options
  });
};

// Create model API function
const createModel = async ({ projectName, projectRunName, data }) => {
  try {
    const params = {
      project: projectName,
      projectrun: projectRunName
    };

    const response = await AxiosInstance.post('/api/models', data, { params });
    return response.data;
  } catch (error) {
    // Enhanced error logging with details
    if (error.response) {
      console.error("Server responded with error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export const useCreateModelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModel,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["models", variables.projectName, variables.projectRunName]
      });

      // Also invalidate queries without projectRunName to refresh general model lists
      queryClient.invalidateQueries({
        queryKey: ["models", variables.projectName]
      });

      // Optionally prefetch the updated data
      queryClient.prefetchQuery({
        queryKey: ["models", variables.projectName, variables.projectRunName],
        queryFn: () => getModels(variables.projectName, variables.projectRunName)
      });
    },
    onError: (error) => {
      console.error("Failed to create model:", error);
    }
  });
};

// Delete team API function
const deleteTeam = async ({ projectName, teamName }) => {
  try {
    const params = {
      project: projectName,
      team: teamName
    };

    const response = await AxiosInstance.delete('/api/teams', { params });
    return response.data;
  } catch (error) {
    // Enhanced error logging with details
    if (error.response) {
      console.error("Server responded with error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export const useDeleteTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.projectName]
      });

      // Also invalidate specific team query
      queryClient.invalidateQueries({
        queryKey: ["team", variables.projectName, variables.teamName]
      });

      // Remove the deleted team from cache
      queryClient.removeQueries({
        queryKey: ["team", variables.projectName, variables.teamName]
      });
    },
    onError: (error) => {
      console.error("Failed to delete team:", error);
    }
  });
};

export const getModel = async (projectName, modelName) => {
  try {
    const params = {
      project: projectName,
      model: modelName
    };

    const response = await AxiosInstance.get('/api/models/detail', { params });
    return response.data;
  } catch (error) {
    console.error("Error getting model:", error);
    throw error;
  }
};

export const useGetModelQuery = (projectName, modelName, options = {}) => {
  return useQuery({
    queryKey: ["model", projectName, modelName],
    queryFn: async () => {
      if (!projectName || !modelName) {
        throw new Error("Project name and model name are required");
      }
      return await getModel(projectName, modelName);
    },
    enabled: !!(projectName && modelName),
    retry: (failureCount, error) => {
      // Don't retry 4xx errors
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        return false;
      }
      return failureCount < 2; // Maximum of 2 retries for other errors
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
      console.error("Error in model query:", error);
    },
    ...options
  });
};

