import { IMG_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";



export const imgUploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImg: builder.mutation({
      query: (formData) => ({
        url: IMG_URL,
        method: 'POST',
        body: formData,
      }),
    }),
    deleteImg: builder.mutation({
      query: ( fileName ) => ({
        url: `${IMG_URL}/${fileName}`,
        method: 'DELETE',
      }),
    }),
  }),
});


export const {
    useUploadImgMutation,
    useDeleteImgMutation
} = imgUploadApiSlice;