import { useQueryClient, useMutation } from '@tanstack/react-query';
import { logout as logoutApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate('/login', { replace: true });
    },
    onError: (err) => {
      console.log('ERROR', err);
      toast.error('There was a problem signing out');
    },
  });
  return { logout, isLoading };
}

export default useLogout;
