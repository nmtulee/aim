import { apiSlice } from "./apiSlice.js";
import { STUDY_WORK_URL } from "../constants.js";

export const studyWorkApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all study works
    getAllStudyWorks: builder.query({
      query: (params = {}) => ({
        url: STUDY_WORK_URL,
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          country: params.country || '',
          search: params.search || '',
        },
      }),
      providesTags: ['StudyWork'],
    }),
    getStudyWorkById: builder.query({
      query: (id) => ({
        url: `${STUDY_WORK_URL}/${id}`,
      }),
        providesTags: ['StudyWork'],
    }),
    // Create new study work (Admin only)
    createStudyWork: builder.mutation({
      query: (studyWorkData) => ({
        url: STUDY_WORK_URL,
        method: 'POST',
        body: studyWorkData,
      }),
      invalidatesTags: ['StudyWork'],
    }),
    // Update study work (Admin only)
    updateStudyWork: builder.mutation({
      query: ({ id, ...studyWorkData }) => ({
        url: `${STUDY_WORK_URL}/${id}`,
        method: 'PUT',
        body: studyWorkData,
      }),
      invalidatesTags: ['StudyWork'],
    }),
    // Delete study work (Admin only)
    deleteStudyWork: builder.mutation({
      query: (id) => ({
        url: `${STUDY_WORK_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StudyWork'],
    }),
    getStudyWorks: builder.query({
      query: () => ({
        url: `${STUDY_WORK_URL}/all`,
      }),
        providesTags: ['StudyWork'],
    }),
  }),
});
export const {
  useGetAllStudyWorksQuery,
  useGetStudyWorkByIdQuery,
  useCreateStudyWorkMutation,
  useUpdateStudyWorkMutation,
  useDeleteStudyWorkMutation,
  useGetStudyWorksQuery,
} = studyWorkApiSlice;