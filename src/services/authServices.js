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

export const forgotPasswordAPI = async (email) => {
    const res = await request.post('auth/forgot-password', { email: email });
    return res;
};

export const resetPasswordAPi = async (data) => {
    const res = await request.post('auth/reset-password', data);
    return res;
};

export const verifyTokenResetPassAPI = async (token) => {
    const res = await request.post('auth/verify-token', { token });
    return res;
};

export const changePasswordAPI = async (data) => {
    const res = await request.put('auth/change-password', data);
    return res;
};
