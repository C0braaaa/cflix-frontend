import * as request from '../utils/backendRequest';

export const getNotificationAPI = async () => {
    try {
        const res = await request.get('notifications');
        return res;
    } catch (error) {
        console.error('Error: ', error);
        return { data: [] };
    }
};

export const markAsReadAPI = async (id) => {
    return await request.put(`notifications/${id}/read`);
};

export const markAllAsReadAPI = async () => {
    return await request.put(`notifications/read-all`);
};

export const deleteNotificationAPI = async (id) => {
    return await request.remove(`notifications/${id}`);
};
