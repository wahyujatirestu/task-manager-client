import { apiSlice } from '../apiSlice';

const TASK_URL = '/task';

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDasboardStats: builder.query({
            query: (data) => ({
                url: `${TASK_URL}/dashboard`,
                method: 'GET',
                body: data,
                credentials: 'include',
            }),
        }),

        getAllTask: builder.query({
            query: ({ strQuery, isTrashed, search }) => ({
                url: `${TASK_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        createTask: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/create`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),

        duplicateTask: builder.mutation({
            query: (id) => ({
                url: `${TASK_URL}/duplicate/${id}`,
                method: 'POST',
                body: {},
                credentials: 'include',
            }),
        }),

        updateTask: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/update/${data.id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),

        trashTast: builder.mutation({
            query: (id) => ({
                url: `${TASK_URL}/${id}`,
                method: 'PUT',
                credentials: 'include',
            }),
        }),

        createSubTask: builder.mutation({
            query: ({ data, id }) => ({
                url: `${TASK_URL}/create-subtask/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
        }),
    }),
});

export const {
    useGetDasboardStatsQuery,
    useGetAllTaskQuery,
    useCreateTaskMutation,
    useDuplicateTaskMutation,
    useUpdateTaskMutation,
    useTrashTastMutation,
    useCreateSubTaskMutation,
} = taskApiSlice;
