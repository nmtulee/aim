import { apiSlice } from './apiSlice.js';
import { BLOGS_URL } from '../constants.js';

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({ page = 1, limit = 6 } = {}) =>
        `${BLOGS_URL}?page=${page}&limit=${limit}`,
      providesTags: ['Blog'],
    }),
    getBlogById: builder.query({
      query: (id) => `${BLOGS_URL}/blog/${id}`,
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation({
      query: (blog) => ({
        url: BLOGS_URL,
        method: 'POST',
        body: blog,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation({
      query: ({ id, ...blog }) => ({
        url: `${BLOGS_URL}/blog/${id}`,
        method: 'PUT',
        body: blog,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${BLOGS_URL}/blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    createReview: builder.mutation({
      query: ({ id, review }) => ({
        url: `${BLOGS_URL}/reviews/${id}`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteReview: builder.mutation({
      query: ({ blogId, reviewId }) => ({
        url: `${BLOGS_URL}/reviews/${blogId}/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    getBlogsStats: builder.query({
      query: () => `${BLOGS_URL}/stats`,
      providesTags: ['Blog'],
    }),
    getAllBlogsNoPagination: builder.query({
      query: () => `${BLOGS_URL}/all`,
      providesTags: ['Blog'],
    }),
    getBlogsByUser: builder.query({
      query: ({ userId, page = 1, limit = 6 }) =>
        `${BLOGS_URL}/user/${userId}?page=${page}&limit=${limit}`,
      providesTags: ['Blog'],
    }),
    searchBlogs: builder.query({
      query: ({ q, page = 1, limit = 6 }) =>
        `${BLOGS_URL}/search?q=${encodeURIComponent(
          q
        )}&page=${page}&limit=${limit}`,
      providesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetBlogsStatsQuery,
  useGetAllBlogsNoPaginationQuery, // This replaces useGetBlosQuery
  useGetBlogsByUserQuery,
  useSearchBlogsQuery,
} = blogApiSlice;
