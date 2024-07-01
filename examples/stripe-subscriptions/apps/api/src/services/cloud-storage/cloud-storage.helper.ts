export const getFileKey = (url: string | null | undefined) => {
  if (!url) return '';

  const decodedUrl = decodeURI(url);
  const { pathname } = new URL(decodedUrl);

  return pathname.substring(1);
};
