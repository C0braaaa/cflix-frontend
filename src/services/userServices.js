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
