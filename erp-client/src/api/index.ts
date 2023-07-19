// api.js

import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // 基础URL为代理的路径
    timeout: 10000, // 可根据需要调整
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // You can perform request configuration here, such as adding headers
        console.log('Request interceptor triggered');

        // For non-login requests, retrieve token from localStorage and add it to the request headers
        if (config.url !== '/login') {
            const token = localStorage.getItem('authToken');
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = (user: { name: string, password: string }) => {
    return api.post('/login', user);
}

// Export API methods with request configurations
export const getUserList = () => {
    return api.get('/user/list'); // Return the Axios Promise directly
};

export const getUserPermission = (userName: string) => {
    return api.get(`/user/${userName}/permission`)
}

// If you need to create more API methods, you can define them here as well
// export const postData = (data) => {
//   return api.post('/endpoint', data);
// };
