import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';

const GlobalErrorHandler: FC = () => {
  const router = useRouter();

  const { error } = router.query;

  useEffect(() => {
    if (error && typeof error === 'string') {
      const sanitizedError = DOMPurify.sanitize(decodeURIComponent(error), { ALLOWED_TAGS: [] });

      toast.error('Error', {
        description: sanitizedError,
      });

      // Remove the error from the URL to prevent showing it again on refresh
      const { pathname, query: currentQuery } = router;

      const { error: _, ...newQuery } = currentQuery; // Remove error from query
      router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
    }
  }, [error, router]);

  return null;
};

export default GlobalErrorHandler;
