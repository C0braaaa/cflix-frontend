import * as request from '../utils/backendRequest';

export const getAllSliderAPI = async () => {
    const res = await request.get('slider/hot');
    return res.data;
};

export const createNewSliderAPI = async (data) => {
    const res = await request.post('slider/add', data);
    return res.data;
};

export const deleteSliderAPI = async (id) => {
    const res = await request.remove(`slider/sliders/${id}`);
    return res;
};

export const updateSliderAPI = async (id, data) => {
    const res = await request.put(`slider/sliders/${id}`, data);
    return res.data;
};
