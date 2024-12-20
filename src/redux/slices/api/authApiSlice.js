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

        verifyEmail: builder.query({
            query: ({ queryString }) => ({
                url: `${AUTH_URL}/verify-email?${queryString}`,
                method: 'GET',
            }),
        }),

        resendVerificationEmail: builder.mutation({
            query: (email) => ({
                url: `${AUTH_URL}/resend-verification`,
                method: 'POST',
                body: { email },
            }),
        }),

        requestPasswordReset: builder.mutation({
            query: (data) => {
                console.log('Data yang dikirim ke API:', data); // Log untuk debugging
                return {
                    url: '/user/forget-password',
                    method: 'POST',
                    body: data,
                    credentials: 'include',
                };
            },
        }),

        resetPassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/reset-password`,
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

export const {
    useLoginMutation,
    useRegisterMutation,
    useVerifyEmailQuery,
    useLogoutMutation,
    useRequestPasswordResetMutation,
    useResetPasswordMutation,
    useResendVerificationEmailMutation,
} = authApiSlice;
