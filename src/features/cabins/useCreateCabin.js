import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createAndEditCabin } from '../../services/apiCabins';

export function useCreateCabin() {
  const queryClient = useQueryClient();

  // create cabin
  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    // mutationFn: newCabin=> createCabin(newCabin),
    mutationFn: createAndEditCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      // invalidate cache so that it refetches data
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
      // reset fields
      //   reset();// react hook form lib
      // this can now be passed in as an option on createCabin in form onSubmit fn
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createCabin };
}
