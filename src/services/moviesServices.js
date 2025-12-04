import * as request from '../utils/httpRequest';

export const typeList = async (page = 1, limit = 32, slug, country = null, year = null) => {
    try {
        const res = await request.get(`v1/api/danh-sach/${slug}`, {
            params: { page, limit, country, year },
        });
        return res?.data || {};
    } catch (error) {
        console.error('Chet me APi no loi cho nao roi:', error);
        return {};
    }
};

export const detail = async (slug) => {
    try {
        const res = await request.get(`phim/${slug}`);
        return res || [];
    } catch (error) {
        console.error('Chet me API no loi cho nao roi:', error);
    }
};

export const type = async (page = 1, limit = 32, typeSlug) => {
    try {
        const res = await request.get(`v1/api/the-loai/${typeSlug}`, {
            params: { page, limit },
        });
        return res?.data || {};
    } catch (error) {
        console.error('Chet me API no loi cho nao roi:', error);
        return {};
    }
};

export const nations = async (page = 1, limit = 32, nationSlug) => {
    try {
        const res = await request.get(`v1/api/quoc-gia/${nationSlug}`, {
            params: { page, limit },
        });
        return res?.data || {};
    } catch (error) {
        console.error('Chet me API no loi cho nao roi:', error);
        return {};
    }
};
