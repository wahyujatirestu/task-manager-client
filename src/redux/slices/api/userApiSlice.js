import { apiSlice } from '../apiSlice';

const USER_URL = '/user';

export const userApiSlice = apiSlice.injectEndpoints({
    tagTypes: ['GroupMembers'],
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: `${USER_URL}/get-users`,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),

        getTeamList: builder.query({
            query: () => ({
                url: `${USER_URL}/get-team`,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'GroupMembers' }],
        }),

        userAction: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data.id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),

        searchUsers: builder.query({
            query: (query) => ({
                url: `${USER_URL}/search-users?query=${query}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getNotifications: builder.query({
            query: () => ({
                url: `${USER_URL}/notifications`,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        markNotiAsRead: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/change-password`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),
    }),
});

export const {
    useUpdateUserMutation,
    useGetTeamListQuery,
    useDeleteUserMutation,
    useUserActionMutation,
    useGetNotificationsQuery,
    useMarkNotiAsReadMutation,
    useChangePasswordMutation,
    useGetAllUsersQuery,
    useSearchUsersQuery,
} = userApiSlice;
