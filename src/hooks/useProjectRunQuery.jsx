import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';

// Function to fetch project runs
const fetchProjectRuns = async (projectId, token) => {
  if (!projectId) return [];

  const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/runs`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project runs');
  }

  return response.json();
};

// Hook to get project runs for a specific project
export const useGetProjectRunsQuery = (projectId, enabled = true) => {
  const { getIdToken } = useAuthStore();

  return useQuery({
    queryKey: ['projectRuns', projectId],
    queryFn: async () => {
      const token = await getIdToken();
      return fetchProjectRuns(projectId, token);
    },
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};
