import { apiSlice } from './apiSlice.js';
import { TESTIMONIALS_URL } from '../constants.js';

export const testimonialApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User endpoints
    createTestimonial: builder.mutation({
      query: (data) => ({
        url: TESTIMONIALS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),

    getMyTestimonial: builder.query({
      query: () => ({
        url: `${TESTIMONIALS_URL}/my`,
        method: 'GET',
      }),
      providesTags: ['Testimonial'],
    }),

    updateMyTestimonial: builder.mutation({
      query: (data) => ({
        url: `${TESTIMONIALS_URL}/my`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),

    deleteMyTestimonial: builder.mutation({
      query: () => ({
        url: `${TESTIMONIALS_URL}/my`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),

    // Public endpoints
    getAllTestimonials: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Add pagination parameters
        if (params.page) searchParams.append('page', params.page);
        if (params.limit) searchParams.append('limit', params.limit);

        // Add filter parameters
        if (params.country) searchParams.append('country', params.country);
        if (params.minRating)
          searchParams.append('minRating', params.minRating);

        // Add sorting parameters
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder)
          searchParams.append('sortOrder', params.sortOrder);

        return {
          url: `${TESTIMONIALS_URL}?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Testimonial'],
    }),

    getTestimonialById: builder.query({
      query: (id) => ({
        url: `${TESTIMONIALS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Testimonial'],
    }),

    // Admin endpoints
    getAllTestimonialsAdmin: builder.query({
      query: () => `${TESTIMONIALS_URL}/admin`,
      providesTags: ['Testimonial'],
    }),

    getTestimonialByIdAdmin: builder.query({
      query: (id) => ({
        url: `${TESTIMONIALS_URL}/admin/${id}`,
        method: 'GET',
      }),
      providesTags: ['Testimonial'],
    }),

    updateTestimonialById: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TESTIMONIALS_URL}/admin/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),

    deleteTestimonialById: builder.mutation({
      query: (id) => ({
        url: `${TESTIMONIALS_URL}/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),

    // Bulk operations (admin)
    bulkUpdateTestimonials: builder.mutation({
      query: (data) => ({
        url: `${TESTIMONIALS_URL}/admin/bulk`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),

    approveTestimonial: builder.mutation({
      query: (id) => ({
        url: `${TESTIMONIALS_URL}/admin/${id}`,
        method: 'PUT',
        body: { approved: true },
      }),
      invalidatesTags: ['Testimonial'],
    }),

    rejectTestimonial: builder.mutation({
      query: (id) => ({
        url: `${TESTIMONIALS_URL}/admin/${id}`,
        method: 'PUT',
        body: { approved: false },
      }),
      invalidatesTags: ['Testimonial'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // User hooks
  useCreateTestimonialMutation,
  useGetMyTestimonialQuery,
  useUpdateMyTestimonialMutation,
  useDeleteMyTestimonialMutation,

  // Public hooks
  useGetAllTestimonialsQuery,
  useGetTestimonialByIdQuery,

  // Admin hooks
  useGetAllTestimonialsAdminQuery,
  useGetTestimonialByIdAdminQuery,
  useUpdateTestimonialByIdMutation,
  useDeleteTestimonialByIdMutation,
  useBulkUpdateTestimonialsMutation,
  useApproveTestimonialMutation,
  useRejectTestimonialMutation,
} = testimonialApiSlice;
