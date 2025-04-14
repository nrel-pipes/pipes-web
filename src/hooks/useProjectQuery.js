import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';
import axiosClient from '../utilities/AxiosInstance';


// Project Basics
export const getProjectBasics = async () => {
  const response = await axiosClient.get("/api/projects/basics");
  return response.data;
};

export const useProjectBasicsQuery = () => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["project-basics"],
    queryFn: () => getProjectBasics(),
    enabled: !!isLoggedIn,
  });
};


// Project Detail
export const getProject = async ({ projectName }) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    const response = await axiosClient.get(`/api/projects?project=${encodedProjectName}`);
    if (!response.data) {
      throw new Error("No data received from the server.");
    }
    return response.data;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
};


export const useProjectDetailQuery = (projectName) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["current-project", projectName],
    queryFn: () => getProject({ projectName}),
    enabled: !!isLoggedIn
  });
};
