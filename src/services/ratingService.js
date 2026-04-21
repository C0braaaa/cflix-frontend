import * as request from '../utils/backendRequest';

export const toggleLikeAPI = async ({ slug, name, poster_url }) => {
    return await request.post('rating/like', { slug, name, poster_url });
};

export const toggleDislikeAPI = async ({ slug, name, poster_url }) => {
    return await request.post('rating/dislike', { slug, name, poster_url });
};

export const getRatingAPI = async (slug) => {
    return await request.get(`rating/${slug}`);
};

export const getTopLikedAPI = async () => {
    return await request.get('rating/top-liked');
};
