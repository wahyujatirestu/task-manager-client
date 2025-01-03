import { apiSlice } from '../apiSlice';

const TASK_URL = '/task';

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDasboardStats: builder.query({
            query: () => ({
                url: `${TASK_URL}/dashboard`,
                method: 'GET',
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

        searchTask: builder.query({
            query: ({ query }) => ({
                url: `${TASK_URL}/search?query=${query}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getSuggestions: builder.query({
            query: (query) => ({
                url: `${TASK_URL}/suggestions?query=${query}`,
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

        trashTask: builder.mutation({
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

        getSingleTask: builder.query({
            query: (id) => ({
                url: `${TASK_URL}/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),

        getSubTask: builder.query({
            query: (id) => ({
                url: `${TASK_URL}/get-subtask/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: (result, error, id) => [{ type: 'SubTask', id }],
        }),

        postTaskActivity: builder.mutation({
            query: ({ data, id }) => ({
                url: `${TASK_URL}/activity/${id}`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),

        deleteRestoreTask: builder.mutation({
            query: ({ id, actionType }) => ({
                url: `${TASK_URL}/delete-restore/${id}?actionType=${actionType}`,
                method: 'DELETE',
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
    useTrashTaskMutation,
    useCreateSubTaskMutation,
    useGetSubTaskQuery,
    useGetSingleTaskQuery,
    usePostTaskActivityMutation,
    useDeleteRestoreTaskMutation,
    useSearchTaskQuery,
    useGetSuggestionsQuery,
} = taskApiSlice;
