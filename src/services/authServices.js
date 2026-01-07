import * as request from '../utils/backendRequest';

export const loginAPI = async (data) => {
    const res = await request.post('auth/login', data);
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

export const updateProfileAPI = async (data) => {
    const res = await request.put('auth/update', data);
    return res;
};

export const updateUserByIDAPI = async (id, data) => {
    const res = await request.put(`auth/admin/update/${id}`, data);
    return res;
};
export const getMeAPI = async () => {
    const res = await request.get('auth/me');
    return res;
};

export const getAllUSersAPI = async (keyword = null, role = null, is_active = null) => {
    const res = await request.get('auth/all-users', { params: { keyword, role, is_active } });
    return res;
};
