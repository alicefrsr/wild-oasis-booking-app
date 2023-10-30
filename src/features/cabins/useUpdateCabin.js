import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAndEditCabin } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useUpdateCabin() {
  const queryClient = useQueryClient();
  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    // mutationFn: newCabin=> createCabin(newCabin),
    mutationFn: ({ newCabinData, id }) => createAndEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success('Cabin successfully updated');
      // invalidate cache so that it refetches data
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
      // reset fields
      // reset();// react hook form lib
      // this can now be passed in as an option on createCabin in form onSubmit fn
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editCabin };
}
