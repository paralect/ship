const escapeRegExpString = (searchString: string): RegExp => {
  const escapedString = searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(escapedString, 'gi');
};

export default {
  escapeRegExpString,
};
