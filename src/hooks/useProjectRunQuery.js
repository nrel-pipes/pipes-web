import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useDataStore from '../stores/DataStore';
import AxiosInstance from './AxiosInstance';

// All Project Runs
const getProjectRuns = async ({ projectName }) => {
  try {
    // Use params object instead of URL parameters
    const params = {
      project: projectName
    };

    const response = await AxiosInstance.get('/api/projectruns', { params });

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

  return useQuery({
    queryKey: ["project-runs", projectName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getProjectRuns({ projectName });
    },
    enabled: !!projectName, // Only require a valid projectName
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
const getProjectRun = async ({ projectName, projectRunName }) => {
  try {
    // Use params object instead of URL parameters
    const params = {
      project: projectName,
      projectrun: projectRunName
    };

    const response = await AxiosInstance.get('/api/projectruns', { params });

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

  return useQuery({
    queryKey: ["project-run", projectName, projectRunName],
    queryFn: async () => {
      if (!projectName || !projectRunName) {
        return [];
      }
      return await getProjectRun({ projectName, projectRunName });
    },
    enabled: !!projectName && !!projectRunName,
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
    mutationFn: createProjectRun,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(["project-runs", variables.projectName]);

      // Optionally prefetch the updated data - fix the query key to be an array
      queryClient.prefetchQuery({
        queryKey: ["project-runs", variables.projectName],
        queryFn: () => getProjectRuns({ projectName: variables.projectName })
      });
    },
    onError: (error) => {
      console.error("Failed to create project run:", error);
    }
  });
};

// Update project run API function
const updateProjectRun = async ({ projectName, projectRunName, data }) => {
  try {
    const params = {
      project: projectName,
      projectrun: projectRunName
    };

    const response = await AxiosInstance.put('/api/projectruns', data, { params });
    return response.data;
  } catch (error) {
    // Enhanced error logging with details
    if (error.response) {
      console.error("Server responded with error during project run update:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("No response received for project run update:", error.request);
    } else {
      console.error("Error setting up project run update request:", error.message);
    }
    throw error;
  }
};

export const useUpdateProjectRunMutation = () => {
  const queryClient = useQueryClient();
  const { setEffectivePRname } = useDataStore();

  return useMutation({
    mutationFn: updateProjectRun,
    onSuccess: (data, variables) => {
      // Update the effective project run name if the name changed
      if (data.name && data.name !== variables.projectRunName) {
        setEffectivePRname(data.name);
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["project-runs", variables.projectName]
      });

      // Invalidate specific project run queries
      queryClient.invalidateQueries({
        queryKey: ["project-run", variables.projectName, variables.projectRunName]
      });

      // If name changed, also invalidate the query for the new name
      if (data.name && data.name !== variables.projectRunName) {
        queryClient.invalidateQueries({
          queryKey: ["project-run", variables.projectName, data.name]
        });
      }

      // Prefetch updated data
      queryClient.prefetchQuery({
        queryKey: ["project-runs", variables.projectName],
        queryFn: () => getProjectRuns({ projectName: variables.projectName })
      });
    },
    onError: (error) => {
      console.error("Failed to update project run:", error);
    }
  });
};

// Delete project run API function
const deleteProjectRun = async ({ projectName, projectRunName }) => {
  try {
    const params = {
      project: projectName,
      projectrun: projectRunName
    };

    const response = await AxiosInstance.delete('/api/projectruns', { params });
    return response.data;
  } catch (error) {
    // Enhanced error logging with details
    if (error.response) {
      console.error("Server responded with error during project run deletion:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error("No response received for project run deletion:", error.request);
    } else {
      console.error("Error setting up project run deletion request:", error.message);
    }
    throw error;
  }
};

export const useDeleteProjectRunMutation = () => {
  const queryClient = useQueryClient();
  const { effectivePRname, setEffectivePRname } = useDataStore();

  return useMutation({
    mutationFn: deleteProjectRun,
    onSuccess: (data, variables) => {
      // Clear effectivePRname in DataStore if the deleted project run is currently selected
      if (effectivePRname === variables.projectRunName) {
        setEffectivePRname(null);
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries(["project-runs", variables.projectName]);

      // Also invalidate the specific project run query if it exists
      queryClient.invalidateQueries(["project-run", variables.projectName, variables.projectRunName]);

      // Optionally refetch the updated project runs list
      queryClient.prefetchQuery({
        queryKey: ["project-runs", variables.projectName],
        queryFn: () => getProjectRuns({ projectName: variables.projectName })
      });
    },
    onError: (error) => {
      console.error("Failed to delete project run:", error);
    }
  });
};
