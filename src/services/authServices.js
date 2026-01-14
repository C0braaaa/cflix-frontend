import * as request from '../utils/backendRequest';

export const loginAPI = async (data) => {
    const res = await request.post('auth/login', data);
    return res;
};

export const loginGoogleAPI = async (credential) => {
    const res = await request.post('auth/login-google', { credential });
    return res;
};

export const logoutAPI = async () => {
    const res = await request.post('auth/logout');
    return res;
};

export const registerAPI = async (data) => {
    const res = await request.post('auth/register', data);
    return res;
};

export const togglePlaylistAPI = async (movieData) => {
    const res = await request.post('auth/playlist', movieData);
    return res;
};

export const saveProgressAPI = async (movieData) => {
    const res = await request.post('auth/continue-watching', movieData);
    return res;
};

export const removeContinueWatchingAPI = async (movileSlug) => {
    const res = await request.remove('auth/continue-watching', { data: movileSlug });
    return res;
};

export const deleteUserAPI = async (userId) => {
    const res = await request.remove(`auth/user/${userId}`);
    return res;
};

export const getFavoritesAPI = async (page = 1, limit = 18) => {
    const res = await request.get('auth/favorite', { params: { page, limit } });
    return res;
};
export const getPlaylistAPI = async (page = 1, limit = 18) => {
    const res = await request.get('auth/playlist', { params: { page, limit } });
    return res;
};
export const getContinueWatchingAPI = async (page = 1, limit = 18) => {
    const res = await request.get('auth/continue-watching', { params: { page, limit } });
    return res;
};
