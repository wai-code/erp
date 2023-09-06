import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/system/permission',
                name: 'Permission',
                component: () => import('../views/Permission.vue'),
                meta: {
                    title: "权限管理",
                    requiresAuth: true
                }
            },
            {
                path: '/system/user',
                name: 'User',
                component: () => import('../views/User.vue'),
                meta: {
                    title: "用户管理",
                    requiresAuth: true
                }
            },
            {
                path: '/purchase/supplier',
                name: 'Supplier',
                component: () => import('../views/Supplier.vue'),
                meta: {
                    title: "供应商管理",
                    requiresAuth: true
                }
            },
            {
                path: '/purchase/product',
                name: 'Product',
                component: () => import('../views/Product.vue'),
                meta: {
                    title: "产品管理",
                    requiresAuth: true
                }
            },
            {
                path: '/purchase/order',
                name: 'PurchaseOrder',
                component: () => import('../views/PurchaseOrder.vue'),
                meta: {
                    title: "采购订单",
                    requiresAuth: true
                }
            },
            {
                path: '/sales/customer',
                name: 'Customers',
                component: () => import('../views/Customers.vue'),
                meta: {
                    title: "客户管理",
                    requiresAuth: true
                }
            },
            {
                path: '/sales/order',
                name: 'SalesOrders',
                component: () => import('../views/SalesOrders.vue'),
                meta: {
                    title: "销售订单",
                    requiresAuth: true
                }
            },
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue'),
                meta: {
                    title: "首页",
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 5Plus ERP System`;
    const requiresAuth = to.meta.requiresAuth;
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (requiresAuth && (!token || !username)) {
        next('/login');
    } else {
        next();
    }
    console.log(to)
});

export default router;
