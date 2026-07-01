import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/api/auth.api';
import type { LoginRequestDto } from '@/types/api';
import { useAuth } from '@/providers/AuthProvider';

interface LoginInput extends LoginRequestDto {
  remember: boolean;
}

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ login: userLogin, password }: LoginInput) =>
      loginUser({ login: userLogin, password }),
    onSuccess: ({ token }, { remember }) => {
      login(token, remember);
      void navigate('/scoring');
    },
  });

  return {
    submit: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.isError ? 'Неверный логин или пароль' : null,
  };
}
