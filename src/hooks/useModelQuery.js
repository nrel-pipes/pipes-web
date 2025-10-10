import { useQuery } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';

export const getModels = async (projectName, projectRunName) => {
  try {
    const params = {
      project: projectName
    };

    if (projectRunName) {
      params.projectrun = projectRunName;
    }

    const response = await AxiosInstance.get('/api/models', { params });

    return response.data || [];
  } catch (error) {
    console.error("Error getting models:", error);
    throw error;
  }
};

// Get model catalog
export const getCatalogModels = async () => {
  const response = await AxiosInstance.get("/api/catalogmodels");
  return response.data;
};

export const useGetModelsQuery = (projectName, projectRunName = null, options = {}) => {
  return useQuery({
    queryKey: ["models", projectName, projectRunName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getModels(projectName, projectRunName);
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
      console.error("Error in models query:", error);
    },
    ...options
  });
};

export const useGetModelCatalog = (options = {}) => {
  return useQuery({
    queryKey: ["modelCatalog"],
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
