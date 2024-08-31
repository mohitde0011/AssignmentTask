import axios from 'axios';

const BASE_URL = 'https://testyourapp.online/testpractical-be/api'; 

const apiClient = axios.create({
    baseURL: BASE_URL,
    
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use(
    (config) => {
 
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
 
        return Promise.reject(error);
    }
);

export default apiClient;