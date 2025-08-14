import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from './AxiosInstance';

// Shared function to get a single team
const getTeam = async (projectName, teamName) => {
  const params = {
    project: projectName,
    team: teamName
  };
  const response = await AxiosInstance.get("/api/teams/detail", { params });
  return response.data;
};

// Query to get a list of all teams
export const useListTeamsQuery = (projectName, options = {}) => {
  return useQuery({
    queryKey: ["teams", projectName],
    queryFn: async () => {
      const params = projectName ? { project: projectName } : {};
      const response = await AxiosInstance.get("/api/teams", { params });
      return response.data;
    },
    enabled: !!projectName && (options.enabled !== false),
    ...options,
  });
};

// Query to get a single team by name
export const useGetTeamQuery = (projectName, teamName, options = {}) => {
  return useQuery({
    queryKey: ["teams", projectName, teamName],
    queryFn: async () => getTeam(projectName, teamName),
    enabled: !!projectName && !!teamName && (options.enabled !== false),
    ...options,
  });
};

// Mutation to create a new team
export const useCreateTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectName, teamData }) => {
      const response = await AxiosInstance.post(`/api/teams?project=${encodeURIComponent(projectName)}`, teamData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      const { projectName } = variables;
      queryClient.invalidateQueries({ queryKey: ["teams", projectName] });
    },
  });
};

// Update team API function
const updateTeam = async ({ projectName, teamName, teamData }) => {
  try {
    const params = {
      project: projectName,
      team: teamName
    };

    const response = await AxiosInstance.patch('/api/teams', teamData, { params });
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

export const useUpdateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeam,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.projectName]
      });

      // Also invalidate specific team query
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.projectName, variables.teamName]
      });

      // Optionally prefetch the updated data
      queryClient.prefetchQuery({
        queryKey: ["teams", variables.projectName, variables.teamName],
        queryFn: () => getTeam(variables.projectName, variables.teamName)
      });
    },
    onError: (error) => {
      console.error("Failed to update team:", error);
    }
  });
};

// Mutation to delete a team
export const useDeleteTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectName, teamName }) => {
      const params = {
        project: projectName,
        team: teamName
      };
      const response = await AxiosInstance.delete("/api/teams", { params });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Remove the specific team query from cache first
      queryClient.removeQueries({
        queryKey: ["teams", variables.projectName, variables.teamName]
      });

      // Invalidate only the teams list query, not individual team queries
      queryClient.invalidateQueries({
        queryKey: ["teams", variables.projectName],
        exact: true // Only invalidate exact matches
      });

      // Don't refetch the deleted team
      queryClient.setQueryData(
        ["teams", variables.projectName, variables.teamName],
        undefined
      );
    },
    onError: (error) => {
      console.error("Failed to delete team:", error);
    }
  });
};
