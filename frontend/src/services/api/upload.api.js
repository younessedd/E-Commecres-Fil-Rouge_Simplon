import { makeFormDataRequest } from './api.config.js';

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return makeFormDataRequest('/upload/image', formData, 'POST');
  },
  
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images[]', file);
    });
    return makeFormDataRequest('/upload/multiple', formData, 'POST');
  },
};

export default uploadAPI;