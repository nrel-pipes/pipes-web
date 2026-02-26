import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from './AxiosInstance';

// Shared function to get a single access group
const getAccessGroup = async (accessGroupName) => {
  const params = {
    accessgroup: accessGroupName
  };
  const response = await AxiosInstance.get("/api/accessgroups/detail", { params });
  return response.data;
};

// Query to get a list of all access groups
export const useListAccessGroupsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["accessgroups"],
    queryFn: async () => {
      const response = await AxiosInstance.get("/api/accessgroups");
      return response.data;
    },
    enabled: options.enabled !== false,
    ...options,
  });
};

// Query to get a single access group by name
export const useGetAccessGroupQuery = (accessGroupName, options = {}) => {
  return useQuery({
    queryKey: ["accessgroups", accessGroupName],
    queryFn: async () => getAccessGroup(accessGroupName),
    enabled: !!accessGroupName && (options.enabled !== false),
    ...options,
  });
};

// Mutation to create a new access group
export const useCreateAccessGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ accessGroupData }) => {
      const response = await AxiosInstance.post('/api/accessgroups', accessGroupData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessgroups"] });
    },
  });
};

// Update access group API function
const updateAccessGroup = async ({ accessGroupName, accessGroupData }) => {
  try {
    const params = {
      accessgroup: accessGroupName
    };

    const response = await AxiosInstance.patch('/api/accessgroups', accessGroupData, { params });
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

export const useUpdateAccessGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccessGroup,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["accessgroups"]
      });

      // Also invalidate specific access group query
      queryClient.invalidateQueries({
        queryKey: ["accessgroups", variables.accessGroupName]
      });

      // Optionally prefetch the updated data
      queryClient.prefetchQuery({
        queryKey: ["accessgroups", variables.accessGroupName],
        queryFn: () => getAccessGroup(variables.accessGroupName)
      });
    },
    onError: (error) => {
      console.error("Failed to update access group:", error);
    }
  });
};

// Mutation to delete an access group
export const useDeleteAccessGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accessGroupName }) => {
      const params = {
        accessgroup: accessGroupName
      };
      const response = await AxiosInstance.delete("/api/accessgroups", { params });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Remove the specific access group query from cache first
      queryClient.removeQueries({
        queryKey: ["accessgroups", variables.accessGroupName]
      });

      // Invalidate only the access groups list query, not individual access group queries
      queryClient.invalidateQueries({
        queryKey: ["accessgroups"],
        exact: true // Only invalidate exact matches
      });

      // Don't refetch the deleted access group
      queryClient.setQueryData(
        ["accessgroups", variables.accessGroupName],
        undefined
      );
    },
    onError: (error) => {
      console.error("Failed to delete access group:", error);
    }
  });
};
