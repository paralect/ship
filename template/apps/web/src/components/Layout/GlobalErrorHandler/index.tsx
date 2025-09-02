import { FC, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import DOMPurify from 'dompurify';

const GlobalErrorHandler: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const error = searchParams.get('error');

  useEffect(() => {
    if (error && typeof error === 'string') {
      const sanitizedError = DOMPurify.sanitize(decodeURIComponent(error), { ALLOWED_TAGS: [] });

      showNotification({
        title: 'Error',
        message: sanitizedError,
        color: 'red',
      });

      // Remove the error from the URL to prevent showing it again on refresh
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');

      const newUrl = newSearchParams.toString() ? `${pathname}?${newSearchParams.toString()}` : pathname;

      router.replace(newUrl);
    }
  }, [error, router, searchParams, pathname]);

  return null;
};

export default GlobalErrorHandler;
