import * as request from '../utils/backendRequest';

export const createReportAPI = async (data) => {
    return await request.post('report', data);
};

export const getStatsReportsAPI = async () => {
    return await request.get('report/stats');
};
