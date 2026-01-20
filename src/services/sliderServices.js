import * as request from '../utils/backendRequest';

export const getAllSliderAPI = async () => {
    const res = await request.get('slider/hot');
    return res.data;
};

export const createNewSliderAPI = async (data) => {
    const res = await request.post('slider/add', data);
    return res.data;
};
