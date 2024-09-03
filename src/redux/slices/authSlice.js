import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')).user
        : null,
    isSidebarOpen: false,
    accessToken: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')).accessToken
        : null,
    refreshToken: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')).refreshToken
        : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },

        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('userInfo');
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('userInfo');
        },
        setOpenSidebar: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
    },
});

export const { setCredentials, clearCredentials, logout, setOpenSidebar } =
    authSlice.actions;

export default authSlice.reducer;
