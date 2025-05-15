import { useQuery } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';

export const getDatasets = async ({ projectName, projectRunName = null, modelName = null, modelRunName = null }) => {
  try {
    if (!projectName) {
      throw new Error('Project name is required');
    }

    // Set up query parameters
    const params = {};
    params.project = projectName;
    if (projectRunName) params.projectrun = projectRunName;
    if (modelName) params.model = modelName;
    if (modelRunName) params.modelrun = modelRunName;

    // Make the API request
    const response = await AxiosInstance.get("/api/datasets", { params });
    return response.data || [];
  } catch (error) {
    if (error.response) {
      console.error("Server responded with error fetching datasets:", {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error("No response received when fetching datasets:", error.request);
    } else {
      console.error("Error setting up datasets request:", error.message);
    }
    throw error;
  }
};

export const useGetDatasetsQuery = (
  projectName,
  projectRunName,
  modelName,
  modelRunName,
  options = {}
) => {
  return useQuery({
    queryKey: ['datasets', projectName, projectRunName, modelName, modelRunName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getDatasets({ projectName, projectRunName, modelName, modelRunName });
    },
    enabled: !!projectName && (options.enabled !== false),
    retry: (failureCount, error) => {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
      console.error("Error in datasets query:", error);
    },
    ...options
  });
};
