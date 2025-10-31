import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';


export const getCatalogModels = async () => {
  const response = await AxiosInstance.get("/api/catalogmodels");
  return response.data;
};


export const useGetCatalogModelsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["catalogModels"], // Changed from "modelCatalog" to match mutation invalidations
    queryFn: async () => {
      try {
        const result = await getCatalogModels();
        return result;
      } catch (error) {
        console.error("Error fetching model catalog:", error);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry 4xx errors
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
    ...options
  });
};


// Get single catalog model
export const getCatalogModel = async (catalogModelName) => {
  try {
    const params = {
      model_name: catalogModelName
    };

    const response = await AxiosInstance.get('/api/catalogmodel/detail', { params });
    return response.data;
  } catch (error) {
    console.error("Error getting catalog model:", error);
    throw error;
  }
};

export const useGetCatalogModelQuery = (catalogModelName, options = {}) => {
  return useQuery({
    queryKey: ["catalogModel", catalogModelName],
    queryFn: async () => {
      if (!catalogModelName) {
        throw new Error("Catalog model name is required");
      }
      return await getCatalogModel(catalogModelName);
    },
    enabled: !!catalogModelName,
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
      console.error("Error in catalog model query:", error);
    },
    ...options
  });
};

// Create catalog model API function
const createCatalogModel = async (data) => {
  try {
    const response = await AxiosInstance.post('/api/catalogmodel/create', data);
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


export const useCreateCatalogModelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCatalogModel,
    onSuccess: (data) => {
      // Invalidate catalog models list
      queryClient.invalidateQueries({
        queryKey: ["catalogModels"]
      });

      // Optionally prefetch the updated data
      queryClient.prefetchQuery({
        queryKey: ["catalogModels"],
        queryFn: () => getCatalogModels()
      });
    },
    onError: (error) => {
      console.error("Failed to create catalog model:", error);
    }
  });
};


// Update catalog model API function
const updateCatalogModel = async ({ modelName, data }) => {
  try {
    const params = {
      model_name: modelName
    };

    const response = await AxiosInstance.patch('/api/catalogmodel/update', data, { params });
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


export const useUpdateCatalogModelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCatalogModel,
    onSuccess: (data, variables) => {
      // Invalidate catalog models list
      queryClient.invalidateQueries({
        queryKey: ["catalogModels"]
      });

      // Invalidate specific catalog model query - use correct variable name
      queryClient.invalidateQueries({
        queryKey: ["catalogModel", variables.modelName]
      });

      // Remove the catalog model from cache to force refetch
      queryClient.removeQueries({
        queryKey: ["catalogModel", variables.modelName]
      });
    },
    onError: (error) => {
      console.error("Failed to update catalog model:", error);
    }
  });
};


// Delete catalog model API function
const deleteCatalogModel = async (modelName) => {
  try {
    const params = {
      model_name: modelName
    };

    const response = await AxiosInstance.delete('/api/catalogmodel/delete', { params });
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


export const useDeleteCatalogModelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCatalogModel,
    onSuccess: (data, modelName) => {
      // Cancel any outgoing queries for the deleted model to prevent refetch
      queryClient.cancelQueries({
        queryKey: ["catalogModel", modelName]
      });

      // Remove the deleted catalog model from cache immediately
      queryClient.removeQueries({
        queryKey: ["catalogModel", modelName]
      });

      // Only invalidate the catalog models list to refresh it
      queryClient.invalidateQueries({
        queryKey: ["catalogModels"]
      });
    },
    onError: (error) => {
      console.error("Failed to delete catalog model:", error);
    }
  });
};
