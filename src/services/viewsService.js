import * as request from '../utils/backendRequest';

export const increaseViewAPI = async (data) => {
    const res = await request.post('trending/views', data);
    return res;
};

export const getTopViewedAPI = async (type) => {
    const res = await request.get('trending/views', {
        params: { type },
    });
    return res;
};
