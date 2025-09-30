import { apiSlice } from './apiSlice.js';
import { USERS_URL } from '../constants.js';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/admincontrol/${id}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    logOut: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/admincontrol/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/admincontrol/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    UserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    sendVerificationCode: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendcode`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    sendVerificationPass: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sendverifypassword`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyPass: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verifypassword`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getUsersStats: builder.query({
      query: () => ({
        url: `${USERS_URL}/users`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUserProfileQuery,
  useSendVerificationCodeMutation,
  useVerifyUserMutation,
  useSendVerificationPassMutation,
  useVerifyPassMutation,
  useLogOutMutation,
  useUpdateUserProfileMutation,
  useGetUsersStatsQuery
} = usersApiSlice;
