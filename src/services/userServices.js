import * as request from '../utils/backendRequest';

export const updateProfileAPI = async (data) => {
    const res = await request.put('user/update', data);
    return res;
};

export const getAllUSersAPI = async (keyword = null, role = null, is_active = null) => {
    const res = await request.get('user/all-users', { params: { keyword, role, is_active } });
    return res;
};

export const getMeAPI = async () => {
    const res = await request.get('user/me');
    return res;
};

export const updateUserByIDAPI = async (id, data) => {
    const res = await request.put(`user/admin/update/${id}`, data);
    return res;
};

export const toggleFavoriteAPI = async (movieData) => {
    const res = await request.post('user/favorite', movieData);
    return res;
};

export const togglePlaylistAPI = async (movieData) => {
    const res = await request.post('user/playlist', movieData);
    return res;
};

export const saveProgressAPI = async (movieData) => {
    const res = await request.post('user/continue-watching', movieData);
    return res;
};

export const removeContinueWatchingAPI = async (movileSlug) => {
    const res = await request.remove('user/continue-watching', { data: movileSlug });
    return res;
};

export const deleteUserAPI = async (userId) => {
    const res = await request.remove(`user/user/${userId}`);
    return res;
};

export const getFavoritesAPI = async (page = 1, limit = 18) => {
    const res = await request.get('user/favorite', { params: { page, limit } });
    return res;
};
export const getPlaylistAPI = async (page = 1, limit = 18) => {
    const res = await request.get('user/playlist', { params: { page, limit } });
    return res;
};
export const getContinueWatchingAPI = async (page = 1, limit = 18) => {
    const res = await request.get('user/continue-watching', { params: { page, limit } });
    return res;
};
