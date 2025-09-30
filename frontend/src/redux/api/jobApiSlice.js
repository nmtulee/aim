import { apiSlice } from './apiSlice';
import { JOBS_URL } from '../constants';

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all jobs with optional filtering and pagination
    getAllJobs: builder.query({
      query: (params = {}) => ({
        url: JOBS_URL,
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          category: params.category,
          country: params.country,
          isSchengen: params.isSchengen !== '' ? params.isSchengen : undefined,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          includeInactive: params.includeInactive,
        },
      }),
      providesTags: ['Job'],
    }),

    // Get single job by ID
    getJobById: builder.query({
      query: (id) => ({
        url: `${JOBS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    // Get jobs by category
    getJobsByCategory: builder.query({
      query: ({ categoryId, page = 1, limit = 10 }) => ({
        url: `${JOBS_URL}/category/${categoryId}`,
        params: { page, limit },
      }),
      providesTags: ['Job'],
    }),

    // Get jobs statistics (Admin only)
    getJobsStats: builder.query({
      query: () => ({
        url: `${JOBS_URL}/stats`,
      }),
      providesTags: ['JobStats'],
    }),

    // Create new job (Admin only)
    createJob: builder.mutation({
      query: (jobData) => ({
        url: JOBS_URL,
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job', 'JobStats'],
    }),

    // Update job (Admin only)
    updateJob: builder.mutation({
      query: ({ id, ...jobData }) => ({
        url: `${JOBS_URL}/${id}`,
        method: 'PUT',
        body: jobData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Job', id },
        'Job',
        'JobStats',
      ],
    }),

    // Delete job (Admin only)
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `${JOBS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job', 'JobStats'],
    }),
    getJobs: builder.query({
      query: () => ({
        url: `${JOBS_URL}/all`,
      }),
      providesTags: ['Job'],
    }),

    // Toggle job active status (Admin only)
    toggleJobStatus: builder.mutation({
      query: (id) => ({
        url: `${JOBS_URL}/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Job', id },
        'Job',
        'JobStats',
      ],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetJobsByCategoryQuery,
  useGetJobsStatsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetJobsQuery,
  useToggleJobStatusMutation,
} = jobApiSlice;
