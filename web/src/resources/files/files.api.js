import api from 'services/api.service';

export const upload = (file) => {
  return api.postFile('/files', file);
};

export const getDownloadUrl = (key) => {
  return api.get(`/files/${key}`);
};
