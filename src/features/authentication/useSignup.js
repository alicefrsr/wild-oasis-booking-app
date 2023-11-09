import { useMutation } from '@tanstack/react-query';
import { signup as signupApi } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function useSignup() {
  const navigate = useNavigate();
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      console.log(user);
      navigate('/dashboard', { replace: true });
      toast.success(
        "Account successfully created. Please verify the new account from the user's email address"
      );
    },
    onError: (err) => {
      console.log('ERROR', err);
      toast.error('There was a problem creating new user');
    },
  });
  return { signup, isLoading };
}

export default useSignup;
