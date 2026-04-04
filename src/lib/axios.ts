import axios from 'axios';
import { loaderStart, loaderDone } from '../components/shared/GlobalLoader';

const BASE_URL = 'https://localhost:7249/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});



api.interceptors.request.use(config => {
    loaderStart();
    return config;
});

api.interceptors.response.use(
    response => { loaderDone(); return response; },
    error => {
        loaderDone();
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);