import DOMPurify from 'dompurify';

/**
 * Sanitizes an error message to prevent XSS attacks
 */
export const sanitizeErrorMessage = (message: string): string => {
  // First, decode the URI component to handle encoded messages
  const decodedMessage = decodeURIComponent(message);

  // Then sanitize the message to remove any potential XSS
  return DOMPurify.sanitize(decodedMessage, { ALLOWED_TAGS: [] });
};
