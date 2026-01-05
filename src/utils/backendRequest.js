import axios from 'axios';

const backendRequest = axios.create({
    baseURL: 'http://localhost:5001/v1/',
    timeout: 10000,
    headers: {
        Accept: 'application/json',
    },
    decompress: true,
});

export const get = async (path, options = {}) => {
    const respone = await backendRequest.get(path, options);
    return respone.data;
};

// Hàm helper cho method POST (Dùng cho Login/Register)
export const post = async (path, data, options = {}) => {
    const response = await backendRequest.post(path, data, options);
    return response.data;
};

// Các method khác nếu cần
export const put = async (path, data, options = {}) => {
    const response = await backendRequest.put(path, data, options);
    return response.data;
};

export const remove = async (path, options = {}) => {
    const response = await backendRequest.delete(path, options);
    return response.data;
};

export default backendRequest;
