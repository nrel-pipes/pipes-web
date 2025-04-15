import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';
import AxiosInstance from './AxiosInstance';

// All Project Runs
const getProjectRuns = async ({ projectName }) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    const response = await AxiosInstance.get(`/api/projectruns?project=${encodedProjectName}`);

    return response.data || [];
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

export const useGetProjectRunsQuery = (projectName, options = {}) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["project-runs", projectName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getProjectRuns({ projectName });
    },
    enabled: isLoggedIn && !!projectName,
    retry: (failureCount, error) => {
      if (error.response && error.response.status >= 400) {
        return false;
      }
      return failureCount < 2; // Maximum of 2 retries
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
      }
      console.error("Error in project runs query:", error);
    },
    ...options
  });
};


// Project Run by Name
const getProjectRun = async ({ projectName, projectrunName: projectRunName }) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    const encodedProjectRunName = encodeURIComponent(projectRunName);
    const response = await AxiosInstance.get(`/api/projectruns?project=${encodedProjectName}&projectrun=${encodedProjectRunName}`);
    return response.data || [];
  } catch (error) {
    if (error.response) {
      console.error("Server responded with error for project run query by name:", {
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

export const useGetProjectRunQuery = (projectName, projectRunName, options={}) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["project-run", projectName, projectRunName],
    queryFn: async ({ projectName, projectrunName }) => {
      if (!projectName || !projectrunName) {
        return [];
      }
      return await getProjectRun({ projectName, projectrunName });
    },
    enabled: isLoggedIn,
    retry: (failureCount, error) => {
      if (error.response && error.response.status >= 400) {
        return false;
      }
      return failureCount < 2; // Maximum of 2 retries
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onError: (error) => {
      console.error("Error in project run query:", error);
    },
    ...options
  });
}



// Create project run API function
const createProjectRun = async ({ projectName, data }) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    const response = await AxiosInstance.post(`/api/projectruns?project=${encodedProjectName}`, data);
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


export const useCreateProjectRunMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-project-run"],
    mutationFn: createProjectRun,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(["project-runs", variables.projectName]);

      // Optionally prefetch the updated data
      queryClient.prefetchQuery(["project-runs", variables.projectName], () =>
        getProjectRuns({ projectName: variables.projectName })
      );
    },
    onError: (error) => {
      console.error("Failed to create project run:", error);
    }
  });
};
