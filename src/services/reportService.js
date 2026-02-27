import * as request from '../utils/backendRequest';

export const createReportAPI = async (data) => {
    return await request.post('report', data);
};

export const getStatsReportsAPI = async () => {
    return await request.get('report/stats');
};

export const getReportsAPI = async (page = 1, type = null, status = null) => {
    return await request.get('report', {
        params: { page, type, status },
    });
};

export const deleteReportAPI = async (id) => {
    return await request.remove(`report/${id}`);
};

export const updateStatusAPI = async (id, data) => {
    return await request.put(`report/${id}/status`, data);
};
