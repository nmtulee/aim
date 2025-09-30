import { TEAM_URL } from "../constants.js"
import { apiSlice } from "./apiSlice.js"



export const teamApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllTeamMembers: builder.query({
            query: () => ({
                url:TEAM_URL,
            }),
            providesTags: ['TeamMember'],
        }),
        getTeamMemberById: builder.query({
            query: (id) => ({
                url:`${TEAM_URL}/${id}`,
            }),
            providesTags: ['TeamMember'],
        }),
        updateTeamMember: builder.mutation({
            query:({id, data}) => ({
                url:`${TEAM_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['TeamMember'],
        }),
        deleteTeamMember: builder.mutation({
            query:(id) => ({
                url:`${TEAM_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TeamMember'],
        }),
        createTeamMember: builder.mutation({
            query: (data) => ({
                url: `${TEAM_URL}`,
                method: "POST",
                body:data
            }),
            invalidatesTags: ["TeamMember"]
        }),
        
    })
})

export const {
    useGetAllTeamMembersQuery,
    useGetTeamMemberByIdQuery,
    useUpdateTeamMemberMutation,
    useDeleteTeamMemberMutation,
    useCreateTeamMemberMutation,
} = teamApiSlice