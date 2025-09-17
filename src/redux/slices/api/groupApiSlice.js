import { apiSlice } from '../apiSlice';

const GROUP_URL = '/user';

export const groupApiSlice = apiSlice.injectEndpoints({
    tagTypes: ['GroupMembers'],
    endpoints: (builder) => ({
        createGroup: builder.mutation({
            query: (data) => ({
                url: `${GROUP_URL}/create`, // Sesuai dengan backend route
                method: 'POST',
                body: data,
            }),
        }),
        getUserGroups: builder.query({
            query: () => ({
                url: `${GROUP_URL}/my-groups`, // Sesuai dengan backend route
                method: 'GET',
            }),
        }),
        removeUserFromGroup: builder.mutation({
            query: ({ groupId, userId }) => ({
                url: `${GROUP_URL}/group/${groupId}/remove-user`,
                method: 'DELETE',
                body: { userId },
            }),
            invalidatesTags: (result, error, { groupId }) => [
                { type: 'GroupMembers', id: groupId },
            ],
        }),
        addUserToGroup: builder.mutation({
            query: ({ groupId, userId }) => ({
                url: `${GROUP_URL}/${groupId}/add-user`,
                method: 'POST',
                body: { userId },
            }),
            invalidatesTags: (result, error, { groupId }) => [
                { type: 'GroupMembers', id: groupId },
            ],
        }),

        getGroupMembers: builder.query({
            query: (groupId) => ({
                url: `${GROUP_URL}/group-members/${groupId}`,
                method: 'GET',
            }),
            providesTags: (result, error, groupId) =>
                result
                    ? [{ type: 'GroupMembers', id: groupId }]
                    : [{ type: 'GroupMembers', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateGroupMutation,
    useGetUserGroupsQuery,
    useGetGroupMembersQuery,
    useAddUserToGroupMutation,
    useRemoveUserFromGroupMutation,
} = groupApiSlice;
