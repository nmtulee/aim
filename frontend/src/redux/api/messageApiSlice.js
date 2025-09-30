import { apiSlice } from "./apiSlice.js";
import { MESSAGES_URL } from "../constants.js";


export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (message) => ({
        url: MESSAGES_URL,
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Message"],
    }),
    getMessages: builder.query({
      query: () => `${MESSAGES_URL}`,
      providesTags: ["Message"],
    }),
    getMessageById: builder.query({
      query: (id) => `${MESSAGES_URL}/${id}`,
      providesTags: ["Message"],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `${MESSAGES_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});   

export const {
  useCreateMessageMutation,
  useGetMessagesQuery,
  useGetMessageByIdQuery,
  useDeleteMessageMutation,
} = messageApiSlice;