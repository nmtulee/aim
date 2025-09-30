import { apiSlice } from "./apiSlice";
import { CATEGORIES_URL } from "../constants.js";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => CATEGORIES_URL,
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query({
      query: (id) => `${CATEGORIES_URL}/single/${id}`,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: CATEGORIES_URL,
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategoryById: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `${CATEGORIES_URL}/single/${id}`,
        method: 'PUT',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategoryById: builder.mutation({
      query: (id) => ({
        url: `${CATEGORIES_URL}/single/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});
export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryByIdMutation,
  useDeleteCategoryByIdMutation,
} = categoryApiSlice;