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


// UserList
export const getUsers = async () => {
  const response = await AxiosInstance.get("/api/users");
  return response.data;
};

export const useGetUsersQuery = (options = {}) => {
  const { isLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ['users-list'],
    queryFn: getUsers,
    enabled: isLoggedIn && (options.enabled !== false),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options
  });
};

