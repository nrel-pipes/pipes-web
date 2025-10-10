
import { useQuery } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';


export const getCatalogModels = async () => {
  const response = await AxiosInstance.get("/api/catalogmodels");
  return response.data;
};


export const useGetCatalogModels = (options = {}) => {
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
