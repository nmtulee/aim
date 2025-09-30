import { apiSlice } from './apiSlice.js';
import { RESUMES_URL } from '../constants.js';

export const resumeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all resumes with filtering and pagination (public)
    getResumes: builder.query({
      query: ({ jobTitle = '', category = '', page = 1, limit = 6 }) => {
        const params = new URLSearchParams();

        if (jobTitle) params.append('jobTitle', jobTitle);
        if (category) params.append('category', category);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        return {
          url: `${RESUMES_URL}?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Resume'],
    }),

    // Get all resumes without pagination (admin only)
    getAllResumesNoPagination: builder.query({
      query: () => ({
        url: `${RESUMES_URL}/all`,
        method: 'GET',
      }),
      providesTags: ['Resume'],
    }),

    // Search resumes by name or job title
    searchResumes: builder.query({
      query: ({ q, page = 1, limit = 6 }) => {
        const params = new URLSearchParams();

        if (q) params.append('q', q);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        return {
          url: `${RESUMES_URL}/search?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Resume'],
    }),

    // Get resume statistics (admin only)
    getResumeStats: builder.query({
      query: () => ({
        url: `${RESUMES_URL}/stats`,
        method: 'GET',
      }),
      providesTags: ['Resume'],
    }),

    // Get single resume by ID (public)
    getResumeById: builder.query({
      query: (id) => ({
        url: `${RESUMES_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Resume'],
    }),

    // Get current user's resume
    getMyResume: builder.query({
      query: () => ({
        url: `${RESUMES_URL}/me`,
        method: 'GET',
      }),
      providesTags: ['Resume'],
    }),

    // Create new resume (authenticated users)
    createResume: builder.mutation({
      query: (resumeData) => ({
        url: RESUMES_URL,
        method: 'POST',
        body: resumeData,
      }),
      invalidatesTags: ['Resume'],
    }),

    // Update current user's resume
    updateMyResume: builder.mutation({
      query: (resumeData) => ({
        url: `${RESUMES_URL}/me`,
        method: 'PUT',
        body: resumeData,
      }),
      invalidatesTags: ['Resume'],
    }),

    // Update resume by ID (admin only)
    updateResumeById: builder.mutation({
      query: ({ id, ...resume }) => ({
        url: `${RESUMES_URL}/${id}`,
        method: 'PUT',
        body: resume,
      }),
      invalidatesTags: ['Resume'],
    }),

    // Delete resume by ID (admin only)
    deleteResumeById: builder.mutation({
      query: (id) => ({
        url: `${RESUMES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),

    // Toggle resume hire status (admin only)
    toggleResumeHireStatus: builder.mutation({
      query: (id) => ({
        url: `${RESUMES_URL}/${id}/hire-status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Resume'],
    }),

    // Upload resume file/document (if you implement file upload)
    uploadResumeFile: builder.mutation({
      query: (formData) => ({
        url: `${RESUMES_URL}/upload`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Resume'],
    }),
    deleteMyResume: builder.mutation({
      query: () => ({
        url: `${RESUMES_URL}/me`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),
  }),
});

export const {
  useGetResumesQuery,
  useGetAllResumesNoPaginationQuery,
  useSearchResumesQuery,
  useGetResumeStatsQuery,
  useGetResumeByIdQuery,
  useGetMyResumeQuery,
  useCreateResumeMutation,
  useUpdateMyResumeMutation,
  useUpdateResumeByIdMutation,
  useDeleteResumeByIdMutation,
  useToggleResumeHireStatusMutation,
  useUploadResumeFileMutation,
  useDeleteMyResumeMutation
} = resumeApiSlice;


