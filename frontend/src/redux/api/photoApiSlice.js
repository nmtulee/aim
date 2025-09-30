import { apiSlice } from './apiSlice.js';
import { PHOTOS_URL } from '../constants.js';

export const photoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPhoto: builder.mutation({
      query: (formData) => ({
        url: PHOTOS_URL,
        method: 'POST',
        body: formData,
      }),
    }),
    deletePhoto: builder.mutation({
      query: (fileName) => ({
        url: `${PHOTOS_URL}/${fileName}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useUploadPhotoMutation, useDeletePhotoMutation } = photoApiSlice;
