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

        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers['Authorization'] = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {

        // if (error.response.status === 401) {

        //     console.log('Unauthorized access');
        // }
        return Promise.reject(error);
    }
);

export default apiClient;