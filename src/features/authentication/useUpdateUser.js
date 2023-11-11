import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateCurrentUser } from '../../services/apiAuth';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success('User account successfully updated');
      // update data manually in the cache (else is not updating avatar without a reload)
      // but somehow was working without ...?)
      queryClient.setQueryData(['user'], user);

      // invalidate cache so that it refetches data
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      // reset fields
      // reset();// react hook form lib
      // this can now be passed in as an option on createUser in form onSubmit fn
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateUser };
}
