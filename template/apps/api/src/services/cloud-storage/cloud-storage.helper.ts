export const getFileKey = (url: string) => {
  const decodedUrl = decodeURI(url);
  const { pathname } = new URL(decodedUrl);

  return pathname.substring(1);
};
