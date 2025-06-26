import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import DOMPurify from 'dompurify';

const GlobalErrorHandler: FC = () => {
  const router = useRouter();

  const { error } = router.query;

  useEffect(() => {
    if (error && typeof error === 'string') {
      const sanitizedError = DOMPurify.sanitize(decodeURIComponent(error), { ALLOWED_TAGS: [] });

      showNotification({
        title: 'Error',
        message: sanitizedError,
        color: 'red',
      });

      // Remove the error from the URL to prevent showing it again on refresh
      const { pathname, query: currentQuery } = router;

      const { error: errorParam, ...newQuery } = currentQuery; // Remove error from query
      router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
    }
  }, [error, router]);

  return null;
};

export default GlobalErrorHandler;
