import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';


export const getCatalogDatasets = async () => {
  const response = await AxiosInstance.get("/api/catalogdatasets");
  return response.data;
};


export const useGetCatalogDatasetsQuery = (options = {}) => {
  return useQuery({
    queryKey: ["catalogDatasets"],
    queryFn: async () => {
      try {
        const result = await getCatalogDatasets();
        return result;
      } catch (error) {
        console.error("Error fetching dataset catalog:", error);
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


// Get single catalog dataset
export const getCatalogDataset = async (catalogDatasetName) => {
  try {
    const params = {
      dataset_name: catalogDatasetName
    };

    const response = await AxiosInstance.get('/api/catalogdataset/detail', { params });
    return response.data;
  } catch (error) {
    console.error("Error getting catalog dataset:", error);
    throw error;
  }
};

export const useGetCatalogDatasetQuery = (catalogDatasetName, options = {}) => {
  return useQuery({
    queryKey: ["catalogDataset", catalogDatasetName],
    queryFn: async () => {
      if (!catalogDatasetName) {
        throw new Error("Catalog dataset name is required");
      }
      return await getCatalogDataset(catalogDatasetName);
    },
    enabled: !!catalogDatasetName,
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
      console.error("Error in catalog dataset query:", error);
    },
    ...options
  });
};

// Create catalog dataset API function
const createCatalogDataset = async (data) => {
  try {
    const response = await AxiosInstance.post('/api/catalogdataset/create', data);
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


export const useCreateCatalogDatasetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCatalogDataset,
    onSuccess: (data) => {
      // Invalidate catalog datasets list
      queryClient.invalidateQueries({
        queryKey: ["catalogDatasets"]
      });

      // Optionally prefetch the updated data
      queryClient.prefetchQuery({
        queryKey: ["catalogDatasets"],
        queryFn: () => getCatalogDatasets()
      });
    },
    onError: (error) => {
      console.error("Failed to create catalog dataset:", error);
    }
  });
};


// Update catalog dataset API function
const updateCatalogDataset = async ({ datasetName, data }) => {
  try {
    const params = {
      dataset_name: datasetName
    };

    const response = await AxiosInstance.patch('/api/catalogdataset/update', data, { params });
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


export const useUpdateCatalogDatasetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCatalogDataset,
    onSuccess: (data, variables) => {
      // Invalidate catalog datasets list
      queryClient.invalidateQueries({
        queryKey: ["catalogDatasets"]
      });

      // Handle cache invalidation for renamed datasets
      const oldName = variables.datasetName;
      const newName = variables.data.name?.trim();

      if (oldName !== newName) {
        // Remove old cache
        queryClient.removeQueries({
          queryKey: ["catalogDataset", oldName]
        });

        // Invalidate new cache
        queryClient.invalidateQueries({
          queryKey: ["catalogDataset", newName]
        });
      } else {
        // Invalidate cache for unchanged name
        queryClient.invalidateQueries({
          queryKey: ["catalogDataset", oldName]
        });
      }
    },
    onError: (error) => {
      console.error("Failed to update catalog dataset:", error);
    }
  });
};


// Delete catalog dataset API function
const deleteCatalogDataset = async (datasetName) => {
  try {
    const params = {
      dataset_name: datasetName
    };

    const response = await AxiosInstance.delete('/api/catalogdataset/delete', { params });
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


export const useDeleteCatalogDatasetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCatalogDataset,
    onSuccess: (data, datasetName) => {
      // Cancel any outgoing queries for the deleted dataset to prevent refetch
      queryClient.cancelQueries({
        queryKey: ["catalogDataset", datasetName]
      });

      // Remove the deleted catalog dataset from cache immediately
      queryClient.removeQueries({
        queryKey: ["catalogDataset", datasetName]
      });

      // Only invalidate the catalog datasets list to refresh it
      queryClient.invalidateQueries({
        queryKey: ["catalogDatasets"]
      });
    },
    onError: (error) => {
      console.error("Failed to delete catalog dataset:", error);
    }
  });
};
