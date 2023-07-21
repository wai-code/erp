import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';
import { getResourceList } from '../common/global';
import { Resource } from '../common/interfaces';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: []
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


function convertToRouteRecordRaw(resources: Resource[]): RouteRecordRaw[] {
    const routeRecords: RouteRecordRaw[] = [];

    function createRouteRecord(resource: Resource): RouteRecordRaw {
        return {
            name: resource.name,
            path: resource.url,
            component: () => import(`../views/${resource.name}.vue`),
            meta: {
                title: resource.label,
                resource_id: resource.id,
            },
        };
    }

    function recursivelyCreateRouteRecords(resources: Resource[]) {
        for (const resource of resources) {
            const routeRecord = createRouteRecord(resource);
            if (resource.children && resource.children.length > 0) {
                routeRecord.children = [];
                recursivelyCreateRouteRecords(resource.children);
            }
            routeRecords.push(routeRecord);
        }
    }

    recursivelyCreateRouteRecords(resources);

    return routeRecords;
}

routes[1].children?.push(...convertToRouteRecordRaw(await getResourceList()))

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    console.log(to)
    document.title = `${to.meta.title} | 5Plus ERP System`;
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (to.path !== '/login' && (!token || !username)) {
        next('/login');
    } else {
        next();
    }
    console.log(to)
});

export default router;
