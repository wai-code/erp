import axios from 'axios';
import router from '../router';

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
            if (token && config.headers) {
                config.headers['token'] = token;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status === 403 || error.response.status === 401) {
            // Redirect to login page
            router.push('/login');
        }
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


export const updateRolePermission = (name: string, permissions: string) => {
    return api.post(`/role/${name}`, { permissions });
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

// Product
export const getProducts = () => {
    return api.get(`/products`)
}

export const getProduct = (id: number) => {
    return api.get(`/products/${id}`)
}

export const addProduct = (data: any) => {
    return api.post(`/products`, data)
}

export const deleteProduct = (id: number) => {
    return api.get(`/products/delete/${id}`)
}

export const updateProduct = (id: number, data: any) => {
    return api.post(`/products/${id}`, data)
}

// Supplier
export const getSuppliers = () => {
    return api.get(`/suppliers`)
}

export const getSupplier = (id: number) => {
    return api.get(`/suppliers/${id}`)
}

export const addSupplier = (data: any) => {
    return api.post(`/suppliers`, data)
}

export const deleteSupplier = (id: number) => {
    return api.get(`/suppliers/delete/${id}`)
}

export const updateSupplier = (id: number, data: any) => {
    return api.post(`/suppliers/${id}`, data)
}

// Purchase
export const getPurchases = () => {
    return api.get(`/purchases`)
}

export const getPurchase = (id: number) => {
    return api.get(`/purchases/${id}`)
}

export const addPurchase = (data: any) => {
    return api.post(`/purchases`, data)
}

export const deletePurchase = (id: number) => {
    return api.get(`/purchases/delete/${id}`)
}

export const updatePurchase = (id: number, data: any) => {
    return api.post(`/purchases/${id}`, data)
}

