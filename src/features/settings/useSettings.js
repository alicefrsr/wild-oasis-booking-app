import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

export function useSettings() {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['settings'], // to uniquely identify this query in our cache
    queryFn: getSettings, // an async function
  });
  return { isLoading, error, settings };
}
