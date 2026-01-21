import * as request from '../utils/backendRequest';

export const addCommentAPI = async (data) => {
    const res = await request.post('comment/add', data);
    return res;
};

export const getCommentBySlugAPI = async (slug) => {
    const res = await request.get(`comment/${slug}`);
    return res;
};
export const toggleVoteCommentAPI = async (id, type) => {
    const res = await request.put(`comment/vote/${id}`, { type });
    return res;
};
