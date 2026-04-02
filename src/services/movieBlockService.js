import * as request from '../utils/backendRequest';

export const blockMovieAPI = async (slug, name, reason = 'inappropriate') => {
    return await request.post('movie/block', { slug, name, reason });
};

export const unblockMovieAPI = async (slug) => {
    return await request.put(`movie/${slug}/unblock`);
};

export const getAllBlockedSlugsAPI = async () => {
    return await request.get('movie/blocked-slugs');
};

export const checkMovieBlockedAPI = async (slug) => {
    return await request.get(`movie/${slug}/status`);
};
