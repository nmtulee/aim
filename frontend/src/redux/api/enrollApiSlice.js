import { apiSlice } from "./apiSlice.js";
import { ENROLL } from "../constants.js";



export const languageEnrollApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateEnroll: builder.mutation({
      query: (data) => ({
        url: `${ENROLL}/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Enroll'],
    }),
    getEnrollByUser: builder.query({
      query: (courseId) => `${ENROLL}/${courseId}`,
      providesTags: ['Enroll'],
    }),
    getAllEnrolls: builder.query({
      query: () => `${ENROLL}/all`,
      providesTags: ['Enroll'],
    }),
    deleteEnroll: builder.mutation({
      query: (id) => ({
        url: `${ENROLL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Enroll'],
    }),
  }),
});

export const {
  useCreateEnrollMutation,
  useGetEnrollByUserQuery,
  useGetAllEnrollsQuery,
  useDeleteEnrollMutation,
} = languageEnrollApi;

