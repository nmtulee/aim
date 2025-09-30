import { apiSlice } from "./apiSlice.js";
import { LANGUAGE_COURSE_URL } from "../constants.js";

export const languageCourseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLanguageCourses: builder.query({
      query: ({ page = 1, limit = 10, country, search, sortBy, sortOrder }) => {
        const params = new URLSearchParams({
          page,
          limit,
          ...(country ? { country } : {}),
          ...(search ? { search } : {}),
          ...(sortBy ? { sortBy } : {}),
          ...(sortOrder ? { sortOrder } : {}),
        });

        return `${LANGUAGE_COURSE_URL}?${params.toString()}`;
      },
      providesTags: ['LanguageCourse'],
    }),

    getLanguageCourses: builder.query({
      query: () => ({
        url: `${LANGUAGE_COURSE_URL}/all`,
        method: 'GET',
      }),
      providesTags: ['LanguageCourse'],
    }),
    getLanguageCourseById: builder.query({
      query: (id) => `${LANGUAGE_COURSE_URL}/${id}`,
      providesTags: ['LanguageCourse'],
    }),
    createLanguageCourse: builder.mutation({
      query: (course) => ({
        url: LANGUAGE_COURSE_URL,
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['LanguageCourse'],
    }),
    updateLanguageCourse: builder.mutation({
      query: ({ id, ...course }) => ({
        url: `${LANGUAGE_COURSE_URL}/${id}`,
        method: 'PUT',
        body: course,
      }),
      invalidatesTags: ['LanguageCourse'],
    }),
    deleteLanguageCourse: builder.mutation({
      query: (id) => ({
        url: `${LANGUAGE_COURSE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LanguageCourse'],
    }),
    getLanguageCoursesStats: builder.query({
      query: () => ({
        url: `${LANGUAGE_COURSE_URL}/stats`,
        method: 'GET',
      }),
      providesTags: ['LanguageCourse'],
    }),
    addLevelToCourse: builder.mutation({
      query: ({ id, level }) => ({
        url: `${LANGUAGE_COURSE_URL}/${id}/levels`,
        method: 'POST',
        body: level,
      }),
      invalidatesTags: ['LanguageCourse'],
    }),
    updateCourseLevel: builder.mutation({
      query: ({ id, levelId, ...level }) => ({
        url: `${LANGUAGE_COURSE_URL}/${id}/levels/${levelId}`,
        method: 'PUT',
        body: level,
      }),
      invalidatesTags: ['LanguageCourse'],
    }),
    deleteCourseLevel: builder.mutation({
      query: ({ id, levelId }) => ({
        url: `${LANGUAGE_COURSE_URL}/${id}/levels/${levelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LanguageCourse'],
    }),
  }),
});

export const {
  useGetAllLanguageCoursesQuery,
  useGetLanguageCoursesQuery,
  useGetLanguageCourseByIdQuery,
  useCreateLanguageCourseMutation,
  useUpdateLanguageCourseMutation,
  useDeleteLanguageCourseMutation,
  useGetLanguageCoursesStatsQuery,
  useAddLevelToCourseMutation,
  useUpdateCourseLevelMutation,
  useDeleteCourseLevelMutation,
} = languageCourseApiSlice;