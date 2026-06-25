import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/api/auth.api';
import { useAuth } from '@/providers/AuthProvider';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: ({ token }) => {
      login(token);
      void navigate('/scoring');
    },
  });

  return {
    submit: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.isError ? 'Неверный логин или пароль' : null,
  };
}
