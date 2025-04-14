import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';
import axiosClient from '../utilities/AxiosInstance';

// UserDetail
export const getUserDetail = async (email) => {
  const response = await axiosClient.get("/api/users/detail", {
    params: { email }
  });
  return response.data;
};

export const useUserDetailQuery = (email) => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['current-user', email],
    queryFn: () => getUserDetail(email),
    enabled: !!email && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
