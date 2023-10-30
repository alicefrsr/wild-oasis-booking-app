import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSetting as updateSettingApi } from '../../services/apiSettings';
import toast from 'react-hot-toast';

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success('Setting successfully updated');
      // invalidate cache so that it refetches data
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
      // reset fields
      // reset();// react hook form lib
      // this can now be passed in as an option on createSetting in form onSubmit fn
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateSetting };
}
