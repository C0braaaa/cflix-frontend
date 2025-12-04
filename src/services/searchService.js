// src/services/searchService.js
import * as request from '../utils/httpRequest';

export const search = async (keyword, page = 1, limit = 32) => {
    try {
        const res = await request.get('v1/api/tim-kiem', {
            params: { keyword, page, limit },
        });
        return res?.data || {};
    } catch (error) {
        console.error('Search API error:', error);
        return {};
    }
};
