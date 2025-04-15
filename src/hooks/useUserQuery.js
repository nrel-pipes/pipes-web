import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../stores/AuthStore';
import AxiosInstance from './AxiosInstance';

// UserDetail
export const getUserDetail = async (email) => {
  const response = await AxiosInstance.get("/api/users/detail", {
    params: { email }
  });
  return response.data;
};

export const useGetUserQuery = (email) => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['current-user', email],
    queryFn: () => getUserDetail(email),
    enabled: !!email && !!accessToken,
    staleTime: 24 * 60 * 60 * 1000, // 1 day
  });
};
