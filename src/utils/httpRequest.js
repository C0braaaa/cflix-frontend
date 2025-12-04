import axios from 'axios';

const httpRequest = axios.create({
    baseURL: 'https://phimapi.com/',
    timeout: 60000,
    headers: {
        Accept: 'application/json',
    },
    decompress: true,
});

export const get = async (path, options = {}) => {
    const respone = await httpRequest.get(path, options);
    return respone.data;
};

export default httpRequest;
