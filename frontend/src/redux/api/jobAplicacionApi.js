
import { JOB_APLICACION_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";


export const jobAplicacionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new job application
    createJobAplicacion: builder.mutation({
      query: (applicationData) => ({
        url: JOB_APLICACION_URL,
        method: 'POST',
        body: applicationData,
      }),
      invalidatesTags: ['JobAplicacion'],
    }),
    // Get all job applications (Admin only)
    getJobAplicacions: builder.query({
      query: () => ({
        url: `${JOB_APLICACION_URL}/all`,
      }),
      providesTags: ['JobAplicacion'],
    }),
    // Get a job application by ID (Admin only)
    getJobAplicacionById: builder.query({
      query: (id) => ({
        url: `${JOB_APLICACION_URL}/${id}`,
      }),
      providesTags: ['JobAplicacion'],
    }),
    // Delete a job application (Admin only)
    deleteJobAplicacion: builder.mutation({
      query: (id) => ({
        url: `${JOB_APLICACION_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JobAplicacion'],
    }),

    deleteMyJobAplicacion: builder.mutation({
      query: (id) => ({
        url: `${JOB_APLICACION_URL}/my/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JobAplicacion'],
    }),
    getMyJobAplicacion: builder.query({
      query: (id) => ({
        url: `${JOB_APLICACION_URL}/my/${id}`,
      }),
      providesTags: ['JobAplicacion'],
    }),
  }),
});
export const {
    useCreateJobAplicacionMutation,
    useGetJobAplicacionsQuery,
    useGetJobAplicacionByIdQuery,
    useDeleteJobAplicacionMutation,
    useDeleteMyJobAplicacionMutation,
    useGetMyJobAplicacionQuery
} = jobAplicacionApiSlice;