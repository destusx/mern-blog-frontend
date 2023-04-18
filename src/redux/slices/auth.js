import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async params => {
    const { data } = await axios.post('/auth/login', params);
    return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async params => {
    const { data } = await axios.post('/auth/register', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me');
    return data;
});

const initialState = {
    data: null,
    authStatus: 'idle',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: state => {
            state.data = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAuth.pending, state => {
                state.authStatus = 'loading';
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.authStatus = 'idle';
                state.data = action.payload;
            })
            .addCase(fetchAuth.rejected, state => {
                state.authStatus = 'error';
            })
            .addCase(fetchAuthMe.pending, state => {
                state.authStatus = 'loading';
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.authStatus = 'idle';
                state.data = action.payload;
            })
            .addCase(fetchAuthMe.rejected, state => {
                state.authStatus = 'error';
            })
            .addCase(fetchRegister.pending, state => {
                state.authStatus = 'loading';
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.authStatus = 'idle';
                state.data = action.payload;
            })
            .addCase(fetchRegister.rejected, state => {
                state.authStatus = 'error';
            });
    },
});

export const selectIsAuth = state => Boolean(state.auth.data);

export default authSlice.reducer;

export const { logout } = authSlice.actions;
