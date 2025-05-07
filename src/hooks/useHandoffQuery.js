import { useQuery } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';

export const getHandoffs = async ({ projectName, projectRunName = null }) => {
  try {
    let params = {};

    // Set up query parameters
    if (projectName) {
      params.project = projectName;

      if (projectRunName) {
        params.projectrun = projectRunName;
      }
    }

    // Make the API request
    const response = await AxiosInstance.get('/api/handoffs', { params });
    return response.data || [];
  } catch (error) {
    if (error.response) {
      console.error("Server responded with error fetching handoffs:", {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error("No response received when fetching handoffs:", error.request);
    } else {
      console.error("Error setting up handoffs request:", error.message);
    }
    throw error;
  }
};

export const useGetHandoffsQuery = (projectName, projectRunName = null, options = {}) => {

  return useQuery({
    queryKey: ["handoffs", projectName, projectRunName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getHandoffs({ projectName, projectRunName });
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
      console.error("Error in handoffs query:", error);
    },
    ...options
  });
};
