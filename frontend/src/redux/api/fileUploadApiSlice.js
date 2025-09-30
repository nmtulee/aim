import { FILE_URL } from '../constants.js';
import { apiSlice } from './apiSlice.js';

export const fileUploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPDF: builder.mutation({
      query: (formData) => ({
        url: FILE_URL,
        method: 'POST',
        body: formData,
      }),
    }),
    deletePDF: builder.mutation({
      query: (fileName) => ({
        url: `${FILE_URL}/${fileName}`,
        method: 'DELETE',
      }),
    }),
    }),
});

export const { useUploadPDFMutation, useDeletePDFMutation } =
  fileUploadApiSlice;
