import { useMutation, useQuery } from '@tanstack/react-query';
import AxiosInstance from './AxiosInstance';

// UserDetail
export const getUserDetail = async (email) => {
  const response = await AxiosInstance.get("/api/users/detail", {
    params: { email }
  });
  return response.data;
};

export const useGetUserQuery = (email) => {

  return useQuery({
    queryKey: ['current-user', email],
    queryFn: () => getUserDetail(email),
    enabled: !!email, // Only check if email is provided
    staleTime: 24 * 60 * 60 * 1000, // 1 day
  });
};


// UserList
export const getUsers = async () => {
  const response = await AxiosInstance.get("/api/users");
  return response.data;
};

export const useGetUsersQuery = (options = {}) => {

  return useQuery({
    queryKey: ['users-list'],
    queryFn: getUsers,
    enabled: options.enabled !== false, // Only respect the enabled option passed
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options
  });
};

// Update user information
export const updateUser = async ({ email, userData }) => {
  const response = await AxiosInstance.put("/api/users/update", userData, {
    params: { email }
  });
  return response.data;
};

export const useUserUpdateMutation = (options = {}) => {
  return useMutation({
    mutationFn: ({ email, userData }) => updateUser({ email, userData }),
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options
  });
};
