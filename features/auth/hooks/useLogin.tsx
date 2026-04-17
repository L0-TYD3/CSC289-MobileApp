import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store';
import { LoginUserPayload } from '../types';

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  return useMutation({
    mutationFn: async (payload: LoginUserPayload) => {
      const { accessToken } = await apiClient
        .POST('/api/auth/login', { body: payload })
        .then(unwrapResponse);
      await setToken(accessToken);
      const user = await apiClient.GET('/api/auth/me').then(unwrapResponse);
      return { token: accessToken, user };
    },
    onSuccess: async ({ user }) => {
      await Promise.all([setUser(user), setIsAuthenticated(true)]);
    },
    onError: (error) => {
      console.error(error);
      appToast.error(error.message);
    },
  });
};
