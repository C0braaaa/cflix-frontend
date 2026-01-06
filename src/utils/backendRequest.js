import axios from 'axios';

const backendRequest = axios.create({
    baseURL: 'http://localhost:5001/v1/',
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
    decompress: true,
    withCredentials: true,
});

backendRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response, config } = error;
        if (response && response.status === 401 && !config.url.includes('auth/login')) {
            console.warn('Token hết hạn hoặc không hợp lệ! Đang đăng xuất...');
            localStorage.removeItem('cflix_user');
            localStorage.removeItem('cflix_token');
            window.location.href = '/';

            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);

export const get = async (path, options = {}) => {
    const respone = await backendRequest.get(path, options);
    return respone.data;
};

export const post = async (path, data, options = {}) => {
    const response = await backendRequest.post(path, data, options);
    return response.data;
};

export const put = async (path, data, options = {}) => {
    const response = await backendRequest.put(path, data, options);
    return response.data;
};

export const remove = async (path, options = {}) => {
    const response = await backendRequest.delete(path, options);
    return response.data;
};

export default backendRequest;
