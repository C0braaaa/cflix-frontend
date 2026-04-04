import * as request from '../utils/backendRequest';

export const blockMovieAPI = async (slug, name, origin_name, type, poster_url) => {
    return await request.post('movie/block', { slug, name, origin_name, type, poster_url });
};

export const unblockMovieAPI = async (slug) => {
    return await request.put(`movie/${slug}/unblock`);
};

export const getAllBlockedAPI = async (page = 1, limit = 10) => {
    return await request.get('movie/blocked', { params: { page, limit } });
};

export const getAllBlockedSlugsAPI = async () => {
    return await request.get('movie/blocked-slugs');
};

export const checkMovieBlockedAPI = async (slug) => {
    return await request.get(`movie/${slug}/status`);
};
