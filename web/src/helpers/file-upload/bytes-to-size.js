const bytesToSize = (bytes) => {
  const setSizes = ['bytes', 'kb', 'mb'];
  let size;

  if (bytes === 0) size = '0 Byte';

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  const givenNumber = bytes / 1000 ** i;

  size = Number.isInteger(givenNumber)
    ? `${givenNumber} ${setSizes[i]}`
    : `${givenNumber.toFixed(1)} ${setSizes[i]}`;

  return size;
};

export default bytesToSize;
