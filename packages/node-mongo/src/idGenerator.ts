import { ObjectId } from 'mongodb';

const generateId = () => {
  const objectId = new ObjectId();
  return objectId.toHexString();
};

export { generateId };
