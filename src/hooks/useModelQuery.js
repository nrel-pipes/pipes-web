import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';
import AxiosInstance from './AxiosInstance';


export const getModels = async (projectName, projectRunName) => {

  try {
    const encodedProjectName = encodeURIComponent(projectName);
    let url = `/api/models?project=${encodedProjectName}`;

    if (projectRunName) {
      const encodedProjectRunName = encodeURIComponent(projectRunName);
      url += `&projectrun=${encodedProjectRunName}`;
    }

    const response = await AxiosInstance.get(url);
    return response.data || [];
  } catch (error) {
    console.error("Error getting models:", error);
    throw error;
  }
};


export const useGetModelsQuery = (projectName, projectRunName = null, options = {}) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["models", projectName, projectRunName],
    queryFn: async () => {
      if (!projectName) {
        return [];
      }
      return await getModels(projectName, projectRunName);
    },
    enabled: isLoggedIn && !!projectName,
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

