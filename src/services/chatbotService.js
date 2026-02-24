import * as request from '../utils/backendRequest';

export const chatWithAI_API = async (history) => {
    const res = await request.post('chatbot', { history });
    return res;
};
