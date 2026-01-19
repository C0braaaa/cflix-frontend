import * as request from '../utils/backendRequest';

export const getAllSliderAPI = async () => {
    const res = await request.get('slider/hot');
    return res.data;
};
