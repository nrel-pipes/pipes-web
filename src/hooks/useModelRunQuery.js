import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';
import AxiosInstance from './AxiosInstance';


export const getModelRuns = async (projectName, projectRunName = null, modelName = null) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    let url = `/api/modelruns?project=${encodedProjectName}`;

    if (projectRunName) {
      const encodedProjectRunName = encodeURIComponent(projectRunName);
      url += `&projectrun=${encodedProjectRunName}`;
    }

    if (modelName) {
      const encodedModelName = encodeURIComponent(modelName);
      url += `&model=${encodedModelName}`;
    }

    // Make the API request
    const response = await AxiosInstance.get(url);
    return response.data || [];
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      console.error("Server responded with error fetching model runs:", {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error("No response received when fetching model runs:", error.request);
    } else {
      console.error("Error setting up model runs request:", error.message);
    }
    throw error;
  }
};


export const useGetModelRunsQuery = (projectName, projectRunName = null, modelName = null, options = {}) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["model-runs", projectName, projectRunName, modelName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getModelRuns(projectName, projectRunName, modelName);
    },
    enabled: isLoggedIn && !!projectName,
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
      console.error("Error in model runs query:", error);
    },
    ...options
  });
};
