import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from './authSlice';

const API_URI = import.meta.env.VITE_APP_BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: API_URI + '/api',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', 'application/json');
        }
        return headers;
    },
    credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Attempt to refresh the token
        const refreshResult = await baseQuery(
            '/refresh-token',
            api,
            extraOptions
        );

        if (refreshResult.data) {
            // Store the new tokens
            api.dispatch(
                setCredentials({
                    accessToken: refreshResult.data.accessToken,
                })
            );

            // Retry the original query with the new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh token is invalid, log out the user
            api.dispatch(logout());
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({}),
});
