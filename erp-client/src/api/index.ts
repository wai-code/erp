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
            const token = localStorage.getItem('token');
            const username: string | null = localStorage.getItem('username');
            if (token && config.headers) {
                config.headers['token'] = token;
            }
            if (username && config.headers) {
                config.headers['username'] = username;
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

export const getResourceList = () => {
    return api.get('/resource/list'); // Return the Axios Promise directly
};

export const getRoleList = () => {
    return api.get('/role/list');
};

export const getUserList = () => {
    return api.get('/user/list');
};

export const addUser = (userInfo: {
    name: string,
    phone: string,
    email: string,
    password: string,
    role: string,
}) => {
    return api.post(`/user`, userInfo)
}

export const updateUser = (userInfo: {
    name: string,
    role: string,
    phone: string,
    email: string,
    password: string,
}) => {
    return api.post(`/user/${userInfo.name}`, userInfo)
}

export const deleteUser = (name: string) => {
    return api.get(`/user/delete/${name}`);
};

export const getUserPermission = (userName: string) => {
    return api.get(`/user/${userName}/permission`)
}

export const getRolePermission = (roleName: string) => {
    return api.get(`/role/${roleName}/permission`)
}
