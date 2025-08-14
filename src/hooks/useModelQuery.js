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

// Delete model API function
const deleteModel = async ({ projectName, projectRunName, modelName }) => {
  try {
    const params = {
      project: projectName,
      projectrun: projectRunName,
      model: modelName
    };

    const response = await AxiosInstance.delete('/api/models', { params });
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

export const useDeleteModelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModel,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["models", variables.projectName, variables.projectRunName]
      });

      // Also invalidate queries without projectRunName to refresh general model lists
      queryClient.invalidateQueries({
        queryKey: ["models", variables.projectName]
      });

      // Also invalidate specific model query
      queryClient.invalidateQueries({
        queryKey: ["model", variables.projectName, variables.modelName]
      });

      // Remove the deleted model from cache
      queryClient.removeQueries({
        queryKey: ["model", variables.projectName, variables.modelName]
      });
    },
    onError: (error) => {
      console.error("Failed to delete model:", error);
    }
  });
};

export const getModel = async (projectName, projectRunName, modelName) => {
  try {
    const params = {
      project: projectName,
      projectrun: projectRunName,
      model: modelName
    };

    const response = await AxiosInstance.get('/api/models/detail', { params });
    return response.data;
  } catch (error) {
    console.error("Error getting model:", error);
    throw error;
  }
};

export const useGetModelQuery = (projectName, projectRunName, modelName, options = {}) => {
  return useQuery({
    queryKey: ["model", projectName, projectRunName, modelName],
    queryFn: async () => {
      if (!projectName || !projectRunName || !modelName) {
        throw new Error("Project name, project run name, and model name are required");
      }
      return await getModel(projectName, projectRunName, modelName);
    },
    enabled: !!(projectName && projectRunName && modelName),
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

// Update model API function
const updateModel = async ({ projectName, projectRunName, modelName, data }) => {
  try {
    const params = {
      project: projectName,
      projectrun: projectRunName,
      model: modelName
    };

    const response = await AxiosInstance.patch('/api/models', data, { params });
    return response.data;
  } catch (error) {
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

export const useUpdateModelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateModel,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["models", variables.projectName, variables.projectRunName]
      });

      queryClient.invalidateQueries({
        queryKey: ["models", variables.projectName]
      });

      queryClient.invalidateQueries({
        queryKey: ["model", variables.projectName, variables.projectRunName, variables.modelName]
      });

      queryClient.removeQueries({
        queryKey: ["model", variables.projectName, variables.projectRunName, variables.modelName]
      });
    },
    onError: (error) => {
      console.error("Failed to update model:", error);
    }
  });
};

