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
