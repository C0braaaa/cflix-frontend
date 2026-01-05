import * as request from '../utils/backendRequest';

export const loginAPI = async (data) => {
    const res = await request.post('auth/login', data);
    return res;
};
