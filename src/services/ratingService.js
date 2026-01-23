import * as request from '../utils/backendRequest';

export const toggleLikeAPI = async (slug) => {
    return await request.post('rating/like', { slug });
};

export const toggleDislikeAPI = async (slug) => {
    return await request.post('rating/dislike', { slug });
};

export const getRatingAPI = async (slug) => {
    return await request.get(`rating/${slug}`);
};
