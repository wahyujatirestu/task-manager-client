import { apiSlice } from '../apiSlice';

const AUTH_URL = '/user';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => {
                const url = `${AUTH_URL}/login`;
                console.log(`Generated URL: ${url}`);
                return {
                    url,
                    method: 'POST',
                    body: data,
                    credentials: 'include',
                };
            },
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),

        logout: builder.mutation({
            query: () => {
                const url = `${AUTH_URL}/logout`;
                console.log(`Generated URL: ${url}`);
                return {
                    url,
                    method: 'POST',
                    credentials: 'include',
                };
            },
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
    authApiSlice;
