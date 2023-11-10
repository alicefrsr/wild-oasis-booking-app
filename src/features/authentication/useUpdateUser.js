// import { useQuery } from '@tanstack/react-query';
// import { getCurrentUser } from '../../services/apiAuth';

// export function useUser() {
//   const {
//     data: user,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ['user'],
//     queryFn: getCurrentUser,
//   });
//   return { isLoading, user, isAuthenticated: user?.role === 'authenticated' };
// }

import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateCurrentUser } from '../../services/apiAuth';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    // onSuccess: () => {
    //   toast.success('User account successfully updated');
    // the above was not updating avatar without a reload, so used queryClient.setQueryData
    // but somehow now works without so removed it...
    onSuccess: () => {
      toast.success('User account successfully updated');
      // queryClient.setQueryData(['user'], data.user); ?

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
