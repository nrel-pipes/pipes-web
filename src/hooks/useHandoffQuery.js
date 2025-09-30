import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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


// Create handoff API function
const createHandoff = async ({ projectName, projectRunName, data }) => {
  try {
    const params = {
      project: projectName,
      projectrun: projectRunName
    };

    const response = await AxiosInstance.post('/api/handoffs', data, { params });
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

export const useCreateHandoffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHandoff,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["handoffs", variables.projectName, variables.projectRunName]
      });

      // Also invalidate queries without projectRunName to refresh general handoff lists
      queryClient.invalidateQueries({
        queryKey: ["handoffs", variables.projectName]
      });

      // Optionally prefetch the updated data
      queryClient.prefetchQuery({
        queryKey: ["handoffs", variables.projectName, variables.projectRunName],
        queryFn: () => getHandoffs({ projectName: variables.projectName, projectRunName: variables.projectRunName })
      });
    },
    onError: (error) => {
      console.error("Failed to create handoff:", error);
    }
  });
};


