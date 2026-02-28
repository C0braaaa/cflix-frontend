import * as request from '../utils/backendRequest';

export const addTrafficAPI = async () => {
    return await request.post('traffic/record');
};

export const getTrafficStatsAPI = async (days = 7) => {
    return await request.get('traffic/stats', {
        params: {
            days,
        },
    });
};
