import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchPopularPosts = createAsyncThunk(
    'posts/fetchPopularPosts',
    async () => {
        const { data } = await axios.get('posts/popular');
        return data;
    }
);

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('posts/tags');
    return data;
});

export const fetchRemovePost = createAsyncThunk(
    'posts/fetchRemovePost',
    async id => {
        await axios.delete(`posts/${id}`);
    }
);

const initialState = {
    posts: {
        items: [],
        postsStatusLoading: 'idle',
    },
    tags: {
        items: [],
        tagsStatusLoading: 'idle',
    },
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPosts.pending, state => {
                state.posts.postsStatusLoading = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.postsStatusLoading = 'idle';
                state.posts.items = action.payload;
            })
            .addCase(fetchPosts.rejected, state => {
                state.posts.postsStatusLoading = 'error';
            })
            .addCase(fetchPopularPosts.pending, state => {
                state.posts.postsStatusLoading = 'loading';
            })
            .addCase(fetchPopularPosts.fulfilled, (state, action) => {
                state.posts.postsStatusLoading = 'idle';
                state.posts.items = action.payload;
            })
            .addCase(fetchPopularPosts.rejected, state => {
                state.posts.postsStatusLoading = 'error';
            })
            .addCase(fetchTags.pending, state => {
                state.tags.tagsStatusLoading = 'loading';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags.tagsStatusLoading = 'idle';
                state.tags.items = action.payload;
            })
            .addCase(fetchTags.rejected, state => {
                state.tags.tagsStatusLoading = 'error';
            })
            .addCase(fetchRemovePost.pending, (state, action) => {
                state.posts.items = state.posts.items.filter(
                    item => item._id !== action.meta.arg
                );
            });
    },
});

export const {} = postsSlice.actions;

export default postsSlice.reducer;
