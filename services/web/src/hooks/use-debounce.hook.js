import { useEffect, useState } from 'react';

export default function useDebounceHook(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    },
    [value, delay],
  );

  return debouncedValue;
}
